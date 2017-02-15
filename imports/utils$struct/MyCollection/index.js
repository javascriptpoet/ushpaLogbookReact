
const {
    permissionManager:{registerPermissions,createClass:createPClass},
    meteor:{
        validatedMethod:{ValidatedMethod},
        mongo:{Mongo},
        meteor:{Meteor}
    },
}=require('imports/externals');

const Permi

export const MyColletion= class extends Mongo.Collection {
    constructor({
        name,
        initialPermissions
    }) {
        super(name);
        this.name=name;
        const onlyAdmin=({user})=>user.hasRole('admin');
        registerPermissions({
            name:`${this.name}Collection`,
            getInitialValue(){
                return Object.assign(this.initialPermissions,{
                    update:onlyAdmin,
                    upsert:onlyAdmin,
                    remove:onlyAdmin,
                    insert:onlyAdmin,
                    find:true,
                    findOne:true
                })
            },
            compose(){
                return {
                    type:t.struct({
                        update:onlyAdmin,
                        upsert:onlyAdmin,
                        remove:onlyAdmin,
                        insert:onlyAdmin,
                        find:true,
                        findOne:true
                    })

                }
            }
        })


        /**
         * all mutator methods overriding mutators in mongo#collection
         * 'update','upsert','remove','insert'
         */
        const methods=_.reduce(['update','upsert','remove','insert'],(memo,name)=>{
            //this will override mongo.collection method.
            //the new method will simulate expected error handling behaviour
            this[name]=()=>{
                let callback=arguments[arguments.length-1];
                const argArray=(typeof  callback==="function")?[...arguments].pop():[...arguments];

                //if callback is passed as arg, use it as the method callback
                //otherwise, log error. a mutator method never throws on client
                if(Meteor.isClient)callback=callback || function(e,res){console.log(e)};
                return methods[name].call({arguments:argArray},callback);
            };
            memo[name]= new ValidatedMethod({
                name:'${this.name}.${name}',
                validator:null,
                run: (args)=> {
                    return super[method.name](...args.arguments)
                },
            }));
            return memo;
        },{});
    }
}

/**
 * a pool of subs managers shared between all the lookup methods in all collections
 * the reason not to have a single global subs manager is its ready status would be shared by all methods that
 * might be active at a particular time. this is cos ready status of each subs tracks all subscriptions cashed
 * by that subs.
 * each method call instance grabs its own subs, does its thing and kindly returns it to the pool when done.
 * if none available, a new one is created. none ever destroyed
 * @type {Array}
 */
const subsPool=[];

/**
 * used to ask for permission by pulling a chain on
 * @returns {*}
 */
function whyCant(){
    //a no-op check method is the context
    try{
        this.call();
        return;
    }catch(e){
        return e
    };
};


/**
 * creates subclass of mongo.collection
 * the idea is to enforce security on all collections including used by legacy third party packages when this subclass is passed to them
 * rather then regular mongo.collection
 * all mutator methods are replaced with mutatormethod based on myvalidatedmethod
 * all lookup methods are replaced with lookupmethod similar in spirit to validatedmethod
 */
export class MyCollection extends Mongo.Collection {
    /**
     * @param args {object}
     *  name {string} - collection name.
     *  permissions {object}
     *      mutator [func] - array of mixins funcs to define permission logic gor all mutator methods
     *      query [func] - array of mixins funcs to define permission logic gor all query methods
     */
    constructor({
        name,
        permissions:{
            mutator=[],
            query=[]
        }
    }){
        super(name);
        const thisCol=this;

        /**
         * @member {string} - collection name
         */
        this.name=name;
        global[name]=this; //for access from browser console
        this.permissions=permissions;

        /**
         * all mutator methods overriding mutators in mongo#collection
         * 'update','upsert','remove','insert'
         */
        const methods=_.reduce(['update','upsert','remove','insert'],(memo,name)=>{
            //this will override mongo.collection method.
            //the new method will simulate expected error handling behaviour
            this[name]=()=>{
                let callback=arguments[arguments.length-1];
                const argArray=(typeof  callback==="function")?[...arguments].pop():[...arguments];

                //if callback is passed as arg, use it as the method callback
                //otherwise, log error. a mutator method never throws on client
                if(Meteor.isClient)callback=callback || function(e,res){console.log(e)};
                return methods[name].call({arguments:argArray},callback);
            };

            //the promiss version of a mutator method is the same
            this['p_${name}']=()=>Promiss.resolve(this[name](...arguments));

            memo[name]= new MyValidatedMethod(_.extend(_.clone(mutatorDef),{
                name:'${this.name}.${name}',
                run: (args)=> {
                    return super[method.name](...args.arguments)
                },
            }));
            return memo;
        },{});

        /*
         create a homemade lookup validated method which is not a method at all but a publishing function
         and a way to subscribe and get data on the client. the main purpose is to provide identical to mutator handling
         of permission mixins.
         permissions are implemented thru mixins. this class provides just basic functionality
         NOTE: validate is not implemented cos validation by schema is expected
         so, it is not a method and is not validated by name is still cool
         */
        class QueryValidatedMethod {
            constructor(methodDef) {
                //process mixins
                ({
                    name,
                    publish,
                    run,
                    mixins
                })=_.reduce(mixins,(memo,mixin)=>{
                    return mixin(memo)
                },methodDef);

                this.name='${thisCol.name}.${name}';
                if (Meteor.isServer && publish) Meteor.publish(this.name, ()=> {
                    //this will pass sub handle as context just in case
                    //if func throws, an empty cursor is returned to keep meteor happy
                    //otherwise it will never raise ready
                    try {
                        return publish.call(this, ...arguments);
                    }catch(e){
                        console.log('Error: lookup method publisher ${this.name}: ${e.message}');
                        return [];
                    }
                })
            };
            call(args){
                try{
                    return run(args)
                }catch(e){
                    console.log('Error: lookup method run ${this.name}: ${e.message}');
                    throw e;
                }
            }
        };

        const mutatorCheckMethod=new MyValidatedMethod({
            run: function () {} ,
            name:'${this.name}.mutatorCheck',
            mixins:permissions.mutator
        });
        const queryCheckMethod=new queryValidatedMethod({
            run: function () {} ,
            name:'${this.name}.mutatorCheck',
            mixins:permissions.query
        });

        /**
         * all query methods overriding queries in mongo#collection
         * find, findOne
         */
        _.each([
            {
                name: 'find',
                run: ()=>super.find(...arguments),
                pub: ()=>super.find(...arguments)
            },
            {
                name: 'findOne',
                run: ()=>super.findOne(...arguments),
                pub: (selector,options)=>super.find(selector,_.extend(_.clone(options),{limit:1}))
            }
        ],(method)=>{
            const queryMethod=new queryValidatedMethod({
                name,
                publish:pub,
                run:()=>run(...arguments),
                mixins:permissions.query,
            });

            /**
             * @member [mutatorMethodname]
             * non promiss version of the method.
             it will override method in mongo#collection
             no subscription is made here.
             it is exactly as the super method but the permission check
             */
            this[name] =()=>{
                try{
                    queryMethod.call(...arguments)
                }catch(e){
                    //return empty cursor on error per meteor specs
                    return super[name]({_id:-1})
                }
            }

            /**
             * @member p[mutatorMethodname]
             * this is the crux - the promiss version of lookup method.
             * this is designed to streamlined meteor sub/pub pattern.
             * invokation of the method o the client does the suscription and returns a promiss
             * which is resolved when subscription is marked ready.
             * an error is thrown if permission check fails.
             *
             * @returns {*}
             */
            this['p_${name}'] =()=>{
                //first, see if we get a permission error
                try{
                    queryCheckMethod.call()
                }catch (e){
                    return Promise.reject(e)
                }
                if (Meteor.isClient) {
                    //grab a subs from the pool. create new one if non is available.
                    // each invokation of each lookup method gets its own subs to avoid interference thru ready status.
                    let subs=_.first(subsPool,(s)=>(s.jspActive?false:true));
                    if(!subs){
                        subs=new SubsManager;
                        subsPool.push(subs);
                    }
                    subs.jspActive=true;

                    //subscribe
                    subs.subscribe('${this.name}.${name}',...arguments);

                    //return promiss that is resolved with the result when subscription is ready
                    return Promise((resolve,reject)=>{
                        Tracker.autorun(()=>{
                            if(subs.ready()){
                                subs.jspActive=false;
                                resolve(this[name](...arguments));
                                Tracker.currentComputation.stop();
                            }
                        })
                    })
                }else{
                    //it is not clear why promiss version of the method be called on server, but, just in case
                    //the nonpromiss version is used to return resolved a promiss immideately
                    return Promiss.resolve(this[name](...arguments));
                };
            };
        });

        /**
         * @member {error:function()} - returns null if you have a right to mutate records, error for a slap in the face
         */
        this.whyCantMutate= ()=>whyCant.call(mutatorCheckMethod);

        /**
         * @member {error:function()} - returns null if you have a right to query records, error for a slap in the face
         */
        this.whyCantLookup=()=>whyCant.call(queryCheckMethod);
    };
};

