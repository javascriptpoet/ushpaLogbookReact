import {_} from 'meteor/underscore';
import {ValidatedMethod} from 'meteor/mdg:validated-method';
import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor'
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {SubsManager} from 'meteor/meteorhacks:subs-manager';
import {Tracker} from 'meteor/tracker'

//a func to camelize strings
this.camelize= (s)=> {
    return s.replace (/(?:^|[-_])(\w)/g, function (_, c) {
        return c ? c.toUpperCase () : '';
    })
};

//this is not the best way to extend a class but does the job in the abscence of its constructor func.
class MySubs {
    constructor(){
        this.subs=new SubsManager;
        this.active=false;
    };
    subscribe(){
        return _.extend(this.subs.subscribe(...arguments),{
            done:()=>{this.active=false}
        })
    };
    //TODO create clear functionality. all subs in the pool will be cleared on logout regardless active or not for security reasons
};

/**
 * a pool of subs managers shared between all the lookup methods in all collections
 * the reason not to have a single global subs manager is its ready status would be shared by all methods that
 * might be active at a particular time. this is cos ready status of each subs tracks all subscriptions cashed
 * by that subs.
 * each method call instance grabs its own subs, does its thing and kindly returns it to the pool when done.
 * if none available, a new one is created. none ever destroyed
 * @type {Array}
 */
export const subsPool=new class {
    constructor() {
        const subsPool = [];
        this.getSubs=()=>{
            //grab a subs from the pool. create new one if non is available.
            let subs = _.first(this.subsPool, (mySubs)=>(mySubs.active ? false : true));
            if (!subs) {
                subs = new MySubs;
                this.subsPool.push(subs);
            };
            subs.active = true;
            return subs;
        }
    }
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
     *
     *  permissions [permissionFunc] - array of permission funcs
     *  each func is called before a mutator or query method is executed both on server and client.
     *  for queries on the server, it is the publishing func that does the calling
     *  the permission func should throw an error when it needs to, it receives same args as mutator/query method
     *  is called with and the context of an object with props colName and colMethodName.
     *
     *  embeddedFiles {object}
     *  a dict. each member associates an fs file to a field name in schema. it is expected that the value of that field
     *  is id of the file in fs collection. same mixins are applied to quereing and inserting files as to the docs of the collection.
     *  this is designed to be used with autoform-file package
     *  {
     *      fieldName:colFS
     *       ...
     *  }
     *
     */
    constructor({
        name,
        permissions=[],
        embeddedFiles=[]
    }) {
        super(name);
        const thisCol = this;

        /**
         * @member {string} - collection name
         */
        this.name = name;
        global[name] = this; //for access from browser console
        this.permissions = permissions;

        //create mixins array for validated methods.same mixins are used in all the methods.
        //but mixins are given enough info to know whats up.
        mixins=_.map(permissions,permission=>{
            return function(methodDef){
                const {run}=methodDef;
                return _.extend(methodDef,{
                    run:function(){
                        permission.apply(_.pick(methodDef,['colName','colMethodName']),arguments);
                        run.apply(this,arguments);
                    }
                })
            }
        });

        /**
         * @param whyCant {object}
         *  update: {func}
         *  remove: {func}
         *  upsert: {func}
         *  insert: {func}
         */
        this.whyCant={};

        /**
         * all mutator methods overriding mutators in mongo#collection
         * 'update','upsert','remove','insert'
         */
        _.each(['update', 'upsert', 'remove', 'insert'], (memo, name)=> {
            const methodDef={
                name: '${this.name}.${name}',
                mixins:mixins,
                colName:this.name,
                colMethodName:name,

            };

            //this creates mutator method
            const validatedMethod = new ValidatedMethod(_.extend(methodDef,{
                run: (args)=> {super[method.name](...args.arguments)}
            }));

            //this creates mutator check method
            const validatedCheckMethod = new ValidatedMethod(_.extend(methodDef,{
                run: (args)=> {}
            }));

            //this will override mongo.collection method.
            //the new method will simulate expected error handling behaviour
            this[name] = ()=> {
                let callback = arguments[arguments.length - 1];
                const argArray = (typeof  callback === "function") ? [...arguments].pop() : [...arguments];

                //if callback is passed as arg, use it as the method callback
                //otherwise, log error. a mutator method never throws on client
                if (Meteor.isClient)callback = callback ||  function(e, res){console.log(e)};
                return validatedMethod.call({arguments: argArray}, callback);
            };

            //

            //create a check mehtod of the collection for this mutator
            //returns null if you have a right to mutate records, error for a slap in the face
            this.whyCant[name]=()=>{
                try{
                    validatedCheckMethod.call(...arguments);
                    return;
                }catch(e){
                    return e
                };
            }
        });


        /*
         create a homemade lookup validated method which is not a method at all but a publishing function
         and a way to subscribe and get data on the client. the main purpose is to provide identical to mutator handling
         of permission mixins.
         permissions are implemented thru mixins. this class provides just basic functionality
         permission mixins are processed only on client. this avoids publication of disallowed data to the client,
         then, on the client, there is no need to check permissions and doing so can create interlocking problems.
         to avoid these interlocks on the server, mixins should not use mycollection#find and mycollection#findOne but
         mycollection#superFind and mycollection#superFindOne which are wrappers for mongo.collection methods.
         to complete this story, promise versions (p_find,p_findOne) do not check permissions at all. on client,
         there is no disallowed data available to find and, on server, there is no use for promises in the publishing
         funcs and their purpose there is to use nice chaining syntax inside permission funcs.
         NOTE: validate is not implemented cos validation by schema is expected
         so, it is not a method and is not validated but name is still cool
         */
        class QueryValidatedMethod {
            constructor({
                name,
                publish,
                run,
                mixins,
            }) {
                this.name = '${thisCol.name}.${name}';
                this.mixins=mixins;

                //process permission mixins but only on the server
                //client will never have any unouthorized data to find.
                if(Meteor.isServer){
                    ({publish,run} = _.reduce(this.mixins, (memo, mixin)=> {
                        return mixin.call({
                            colName:thisCol.name,
                            colMethodName:name,
                        },memo)
                    }, {publish,run}));
                    if (publish) Meteor.publish(this.name, ()=> {
                        //this will pass sub handle as context just in case
                        //if func throws, an empty cursor is returned to keep meteor happy
                        //otherwise it will never raise ready
                        try {
                            return publish.call(this, ...arguments);
                        } catch (e) {
                            console.log('Error: lookup method publisher ${this.name}: ${e.message}');
                            return [];
                        }
                    });
                };
                this.publish=publish;
                this.run=run;
            };

            //envokation method. it will do permission checks on server but not client
            call(args) {
                return this.run(args)
            };

            //get a subs from the pool, make subscription on this sub using pub of this queryvalidatedmethod
            //and return subs handle that is SubsManager handle extended by done() method. when invoked,
            //done() will return the subs back to the pool.
            subscribe(/*just the args of pub function*/){
                return subsPool.getSubs().subscribe(this.name,...arguments);
            }
        };

        /**
         * all query methods overriding queries in mongo#collection
         * find, findOne
         */
        _.each([
            {
                name: 'find',
                run: ()=>super.find(...arguments),
                publish: ()=>super.find(...arguments)
            },
            {
                name: 'findOne',
                run: ()=>super.findOne(...arguments),
                publish: (selector, options)=>super.find(selector, _.extend(_.clone(options), {limit: 1}))
            }
        ], ({name,run,publish})=> {
            const validatedMethod = new queryValidatedMethod({name,publish,run,mixins});

            /**
             * non promise version of the method.
             it will override method in mongo#collection
             no subscription is made here.
             it is exactly as the super method on client but on server permission mixins are processed to
             allow adjusting the selector so
             only allowed data is found. query methods never throw neither on server or client
             */
            this[name] = ()=> {validatedMethod.call(...arguments)}

            /**
             * @member p[mutatorMethodname]
             * the promise version of lookup method.
             * this is designed to streamline meteor sub/pub pattern.
             * invokation of the method o the client does the suscription and returns a promise
             * which is resolved when subscription is marked ready.
             *promise methods never check permissions. there is no disalowed data on client and on server
             * there is no need for promises. except in the permission mixins as syntax sugar. again, checking permissions
             * there has no purpose and leads to interlocks.
             * @returns {*}
             */
            this['p${camelize(name)}'] = ()=> {
                //returns the method func with its subscription added as a property
                const func=()=>{
                    if (Meteor.isClient) {
                        //grab a subs from the pool. create new one if non is available and subscribe to this method publication
                        // each invokation of each lookup method gets its own subs to avoid interference thru ready status.
                        const subsHandle = validatedMethod.subscribe(...arguments);

                        //return promise that is resolved with the result when subscription is ready
                        return Promise((resolve)=> {
                            Tracker.autorun(()=> {
                                if (subsHandle.ready()) {
                                    subsHandle.done(); //this returns subs back to the pool
                                    resolve(this[name](...arguments));
                                    Tracker.currentComputation.stop();
                                }
                            })
                        })
                    } else {
                        //return a promise resolved with result of query immideately. no subscription
                        //HUGE NOTE: no permissions are applied on server. the promise methods are intended to be used
                        //ONLY as convenient syntax inside permission mixins, not to publish docs. 
                        //permissions inside permissions inside permissions ... hello rabbit in that hole.
                        return promise.resolve(super[name](...arguments));
                    };
                }

                //add subscription property to the method func but only on client
                if(Meteor.isClient){
                    func.subscribe=()=>validatedMethod.subscribe; //this is to bind subscribe to validatedMethod
                };
                return func;
            };

            /*
             wrapper methods to expose mongo#collection#find and findOne.
             use inside permission funcs to avoid interlocks as alternative to promise methods
             these are identical to find and findOne on client and provided just for symmetry
             */
            this['super${camelize(name)}']
        });

        //apply permissions to fs collections
        //the file record is associated with collection records by a query. then, mixins are let loose to do their
        //permissions. the complication is the query has latency, so, we await on a promise of the query before
        //returning the answer. prbly does not matter since the docs will be on the client by then anyway
        //the only issue - if no permission to query col, does not matter what mutator permissions are
        _.each(embeddedFiles,({colFS,fieldName})=>{
            colFS.allow({
                insert: (userId, file)=>{
                    //no sense querying here. there is no id on the file
                    //not ideal but works if insert permissions dont depend on on any related associations
                    !this.whyCant.insert();
                },
                update: async function(userId, file){
                    const doc=await thisCol.p_findOne({'${fieldName}':file._id});
                    return !whyCant.update({_id:doc._id});
                },
                download: async function(userId,file){
                    //if we found related doc, we can downloaded the file
                     return await thisCol.p_findOne({'${fieldName}':file._id});
                }
            });
        });
    }
};

