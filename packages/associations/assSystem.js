import {_} from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {filtr} from 'filtr';
import {assErrors} from './assErrors'

/**
 * a system of relationships
 * expected to be extended by extending constructor when a new system is defined. then, it is installed by instantiating the system
 * class.
 * each associations is between two collections represented by a connector function
 * the system is installed on a set of collections specified thru constructor arg. the supplied collections are checked against
 * predefined list and the fields required by the systems are verified for each collection thru schemas attached to collections
 */
class AssSystem {
    constructor({
        /**
         * @param name {string} - name of the system but it is not used anywhere
         */
        name,
        
        /**
         * @param cols {dict}
         * a dict of symbol cols names keyed by real cols names
         */
        colMap,

        /**
         * @parameter mixins {connectorMixinObj | [connectorMixinObj]} - mixin functions.
         * each mixin is serviced in sequence. the mixin object is a dict of mixin funcs and their custom args
         *  keyed by message name. depending on the message, a corresponding func is called
         *  with appropriate payload and context and its expected returned value depends on message.
         *  if multiple mixins return values for the same message, the last one wins.if no mixins responded,
         *  null is returned to indicate it. undefined is interpreted
         *  as a returned value.
         *  a system is acollection of links and each link has two lifes (not nine despite common beleive), one at system definition time and
         *  another during envokation at run time. the mixin funcs are called with different messages in each cycle.
         *  these funcs can be used to customize connector names, or the
         *  names of its parameters, or transform input/output of the connector, or display views and popups, alerts
         *  to create a caliedascope of custom behaviours all encapsulated in ass system definition.
         *  mixins are the key to creating truly friendly syntax adjusted to each app while modularizing complex functionalities for
         *  a more general case.
         *  it is hoped that over time, a set of useful mixins can be contributed
         */
        mixins=[],

        /*
        params below are passed only by addAssSystem method
         */
        /**
         * the context object for define - the func that builds the system
         it is a dictionary keyed by symbolic col names. values are instances of LinkerObj that
         has just one link func in its proto. the func that connects collections by inserting
         connector funcs into promiseExenders
         the link funcs are chained - each link call is bound to its source col and returns the LinkObj of the next collection
         */
        defineHandle,

        /**
         the run time handle object. it serves to namespace the system. all navigatinal chains at run time
         start by accessing this object. it is a dict keyed by real col names.
         the values are promise versions of find that return a promise to find collection records. that promise is extended
         by a promiseExtender of that col. promiseExtender has all the link connectors that return similar promises full of
         links to the next destination. that allows chaining navigation syntax within the namespace of the system.
         */
        runHandle,

        /**
         dictionary of promiseExtenders for each collection keyed by real col names
         these are the objects stuffed with all the links of the corresponding col
         they are used to extend promises returned by link/connector funcs
        
         */
        promiseExtenders,

        /**
         * any number of additional parameters for the consumption of define funcs
         */
    }) {
        _.defaults(_.extend(this,arguments[0]),{
            defineHandle:new DefineHandle({parentAssSystem:this}),
            runHandle:new RunHandle({parentAssSystem:this}),
            promiseExtenders:{}
        });
    };

    /**
     * @method addAssSystem
     * overlays/adds a new system to this one
     * added system can be mapped over new collections or overlayed over old ones. in the later case, it will
     * extend (overwrite) namesake links in cols of the addee system
     * takes a dict of args with following params
     * @param AssSystemDef
     * class def of the system to be added
     * @param colMap
     * dict of real col names:addee system symbolic col names
     * @param name {string}
     * if not supplied, defaults to the addee system name
     * @param mixins [object]
     * mixins applied to the added system in addition to the addee system mixins
     * 
     * NOTE: any parameters needed by the adder system are included as extra parameters to this func
     */
    addAssSystem({
        name=this.name,
        mixins,
        AssSystemDef,
        colMap=this.colMap,
    }){
        // inject the guts of the current system into the added system and let the host
        //service the parasite
        const args=arguments[0];
        //this effectively embeds one system into the other
        return AssSystemDef(_.extend(
            _.omit(args,'assSystemDef'),
            _.pick(this,['defineHandle','runHandle','promiseExtenders']),
            {mixins:this.mixins.concat(Array.of(mixins))}
        ));
    };
};

class RunHandle {
    constructor({
        parentAssSystem
    }){
        this.parentAssSystem=parentAssSystem;
    }
};

class PromiseExtender {
    constructor({
        parentAssSystem,
        realColName
    }){
        this.parentAssSystem=parentAssSystem;
        this.realColName=realColName;
    };

    /**
     * @method reduce
     * a convenience utility to restructure the standard form of chain output
     * works similar to the undescore reduce function.
     * @param reducer {memo:function({memo,colName,doc})}
     * called for each record of each collection. receives prev result and col name and the document
     * returns adjusted result. called in context of handle object with stop property. set it true and dont get
     * bothered no more.
     * if reducer returns a promise, thats what it will get next time. so, you have to keep chaining or,
     * for a saner syntax, use await and wait for your promise on your own.
     * @param initValue {any}
     * the initial value of the result. passed as memo at first envokation
     * @param where {mongoSelector}
     * a mongo style selector object to filter recs in each cursor
     * sure, it can be done inside reducer func but this parameter helps readability and facilitates interactive user
     * interface in future
     */
    reduce({reducer,initValue=[],where={}}){
        return this.then((res)=>{
            const handle={stop:false}
            //res is expected to be a dict of {colName:{mongo cursor} || [object]}
            return _.reduce(res,(memo,cur,colName)=>{
                if (handle.stop)return;
                const data = filtr(where).test((cur instanceof Meteor.Collection.Cursor) ? cur.fetch() : Array.of(cur));
                return _.reduce(data, (memo, doc) =>{
                    if (handle.stop)return;
                    reducer.call(handle, {memo, colName, doc});
                }, memo);
            },initValue);
        })
    };

    /**
     * @method waitThen
     * waits for any number of external promises to fulfil and lets the results be combined and processed by then
     * func. the returned result is passed to the next member of the chain
     * @param waitHow {string}
     * 'All' - wait for all
     * 'Race' - wait for first one (race)
     * @param waitFor {[promise|value] | promise | value}
     * any number of promises or not to wait on every one to get resolved. values are converted to resolved promises
     * @param then {function(res,waitedFor)}
     * function to process results. takes the result from preceding chain member and an array of waitedfor promise results
     */
    waitThen({
        waitFor=[],
        then=(waitedFor=>waitedFor),
        waitHow='All'}){
        //wait for the dragging guy from behind
        return this.then((res)=>{
            //then for all/one strangers
            return Promise[waitHow](waitFor).
            
            //then, we'll let user have his way with that bunch, and, whatever's left will be let go down the chain gang   
            then((waitedFor)=>{
                return then.call(this,{
                    res:res,
                    waitedFor
                })
            })
        })
    }

};

class DefineHandle {
    constructor({parentAssSystem}){
        this.parentAssSystem=parentAssSystem;
    };
    
    //a func to camelize strings
    camelize(s){
        return s.replace (/(?:^|[-_])(\w)/g, function (_, c) {
            return c ? c.toUpperCase () : '';
        })
    };
    
    newCol({colName:symbolColName}){
        const {
            parentAssSystem:{
                runHandle,
                promiseExtenders,
                colMap,
            }
        }=this;
        const realColName=_.invert(parentAssSystem.colMap)[symbolColName];
        if(!realColName) throw assErrors.missingRealCol({symbolColName});
        this[symbolColName]=new defineHandleMember({
            parentDefineHandle:this,
            symbolColName
        });
        promiseExtenders[realColName]=new PromiseExtender({
            parentAssSystem,
            realColName
        });

        /*
         * this inserts a key/value pair in run time handle object. the key is real col name translated from the symbolic name
         * and value is a function that will return a promise to find specified records in that col when envoked. this will
         * facilitate syntax: myAssSystem.schools({selector:{name:'mySchool'}}) to allow a promise chain
         * to navigate the ass system with that col as a starting point.
         */
        runHandle[realColName]=({selector,options})=>{
            //the returned promise is extended with the links of the collection to enable chaining
            return _.extend(col.p_find(selector,options),promiseExtenders[realColName])
        };
    }
};

//sets up prototype for a member of defineHandle. there is an instance for each symbolic col name
class DefineHandleMember {
    constructor({
        parentDefineHandle,
        symbolColName,
    }){
        //a place where link related info goes, an object for each link
        this.linksInfo={};
        this.parentDefineHandle;
        this.symbolColName;
        this.realColName=_.invert(parentDefineHandle.parentAssSystem.colMap)[symbolColName];
        if(!this.realColName) throw assErrors.missingRealCol({symbolColName});
    };
    
    

    /**
     * @method addAssSystem
     * overlays/adds a new system to the one being build at define time
     * this is a wrapper for namesake in AssSystem class where symbolic col names are used instead of real
     * takes a dict of args with following params
     * @param AssSystemDef
     * class def of the system to be added
     * @param args {object}
     * @param colMap {dict}
     *  dict of this system symbolic col names:added system symbolic col names
     *  
     *  NOTE: the rest of params is anything to please adder system
     * }
     */
    addAssSystem({
        colMap:adderColMap=this.parentDefineHandle.parentAssSystem.colMap
    }){
        const args=arguments[0];
        //the supplied col map needs to be translated from the added system giberish to the real cols
        return this.parentDefineHandle.parentAssSystem.addAssSystem(_.extend(
            _.clone(args),
            {
                colMap:_.reduce(adderColMap,(memo,adderSymbolName,addeeSymbolName)=>{
                    memo[_.invert(addeeColMap)[addeeSymbolName]]=adderSymbolName;
                },{})
            })
        )
    };

    /**
     * @method link
     *  used at define time to link collections with a custom connector func
     *  or to install a predefined link class
     *  @parameter toColName {string}
     * collection name to connect to
     * @parameter connector {connectorReturnObject:function} |
     * can be connector function or a assLinkClass that installs a predefine two node system.
     * if function:
     *  name of the link method is either name parameter or name of the func 
     * in later case: 
     *  assLinkClass mixins are used as part of its system, not the ones supplied in this call
     *  parameters to the constructor of the link class are added as parameters to this func call
     *  @parameter name {string}
     *  name of the link. if not supplied, connector func name is used
     *  @param info {connectorInfo}
     *  object full of info. it is placed as property of connector func
    */
    link({
        name,
        toColName,
        connector,
        info={}
    }) {
        const linkDef=arguments[0];
        let {
            symbolColName,
            realColName,
            parentDefineHandle:{
                parentAssSystem:{
                    promiseExtenders, 
                    mixins
                }
            },
        }=this;
        if (connector instanceof AssSystem) {
            parentAssSystem.addAssSystem(
                _.extend(
                    _.omit(linkDef,['toColName','connector']), 
                    {
                        AssSystemDef: connector,
                        colMap: {
                            '${symbolColName}': 'from',
                            '${toColName}': 'to'
                        }
                    }
                )
            );
        } else {
            /*
             processes mixins supplied by user in link definition for a given message being sent to the mixin family
             called in context of the callee
             if no mixins responded, null is returned to indicate it. undefined is interpreted
             as a returned value
             */
            function processMixins(message) {
                const {mixinMessageMap, mixins}=this;
                return _.reduce(mixins, (result, mixin)=> {
                    const {action, args}=mixin[message];
                    const {resultHandler=(actionReturn=>actionReturn), mixinContext}=mixinMessageMap[message];
                    if (action) return resultHandler(action.call(mixinContext, args));
                    return result;
                }, null)
            };

            /*
             this is mixin message map for define time
             */
            mixinMessageMap = {
                beforeLink: {
                    mixinContext: linkDef,
                    resultHandler: (newLinkDef)=> {
                        ({fieldsInfo, toColName, mixins, connector} = newlinkDef)
                    }
                },
                afterLink: {
                    mixinContext: linkDef,
                }
            };

            /*
             send beforeDefine message to mixins provided by the user
             the mixins are expected to modify link definition args to allow adjusting the name of the connector
             at run time, destination collection, even interacting with the config settings or user before his
             system is built
             */
            processMixins.call(this, {message: 'beforeLink'});
            const connectorName=name || connector.name;

            //now that we have a name for the link, record its info
            _.extend(this.links[connectorName],info);
            
            //check if link exists
            if(this[connectorName]){
                throw assErrors.connectorExists({
                    connectorName,
                    realColName,
                    symbolColName
                })
            }; 
            promiseExtenders[realColName] = _.extend(
                (promiseExtenders[realColName] || {}),
                {
                    '${connectorName}': (args)=> {
                        //args are user arguments supplied at connector envokation
                        //context is the promise returned by the prev connector in the chain

                        /*
                         this is mixin message map for run time
                         */
                        mixinMessageMap = {
                            beforeAction: {
                                mixinContext: linkDef,
                                resultHandler: (newLinkDef)=> {
                                    ({info, toColName, connector} = newlinkDef)
                                }
                            },
                            afterAction: {
                                mixinContext: linkDef,
                            },
                            onError: {
                                mixinContext: {linkDef, error},
                            }
                        };
                        return _.extend(
                            //wait for the result from connector func. it is called in context of res of prev connector
                            //in the chain.
                            this.then((res)=> {
                                processMixins.call(this, {message: 'beforeAction'});
                                connector.call(res, args);
                                processMixins.call(this, {message: 'afterAction'});
                            }).//catch any errors, permission most likely, and rethrow to be handled properly by caller
                            catch((e)=> {
                                //do not throw if there was at least one error handler mixin. they should do it
                                //on their own
                                const error = e;
                                if (processMixins.call(this, {message: 'onError'}) === null) throw e
                            }),

                            //extend the returned promise with the links of the destination collection to rattle the chain
                            promiseExtenders[toColName]
                        );
                    }
                }
            );
            promiseExtenders[realColName][connectorName].info=info;

            /*
             afterDefine message to mixins
             can be used for logging or informing user
             */
            processMixins.call(this, {message: 'afterLink'});
        };

        //return handle to the destination symbolic col. this allows chaining link definitions
        //if it does not exist yet, create it
        return parentDefineHandle[toColName] || parentDefineHandle.newCol({name:toColName});
    };
};

/**
 * @exports defineSystem {function}
 * a factory that returns a new assSystem class extended from one supplied or the base class
 * then, the generated class can be used to install a new system of relationship on a set of collections
 * @param args {object}
 * { 
 *      baseAssClass {AssSystem}
 *      the base ass system to extend. if not supplied, base class is used
 *
 *      define {function(args) || object}
 *      -   function where all system links will be built. it will be run as part of the constructor and will
 *      add to the links installed by the base class.it. the only arg it takes is a dict of parameters
  *      passed a dict of parameters
  *      -  a shallow structure that defines all the links between symbolic col names. e.g.
  *      {
  *         from1:{
  *             to1:linkDef11,
  *             to2:linkDef12
  *         },
  *         from2:{
  *             to1:linkDef21
  *         }
      *  }
 */
export const defineAssSystem=({
    baseAssClass=AssSystem,
    define,
})=>{

    /**
     * extend the base ass system class.
     * it is a bit of a hack of an extension. it is the promiseExtenders that are being extended
     * with new links by the define func called by the constructor. not the class itself. the class inheritance is used
     * as a convinient recursive process.
     * see AssClass for constructor args
     */
    return class NewAssClass extends baseAssClass {
        /*
        see AssClass for argument description
         */
        constructor(){
            super(...arguments);
            if(typeof define === 'function'){
                //define func for this extention.
                //it is called in context of the defineHandle and with the single arg, the same one passed
                //to the constructor at system class instantiation.
                //so, if system class is a composite of extensions, each define func will get the same arg
                //and use just the parameters it needs. the only caveat - dont use same names between extensions
                define.call(this.defineHandle,this);
            }else{
                //another option is a structure of nodes.
                const {defineHandle}=this;
                (function climbTree({myParent,myParentName,me,myName,myMonkey}){
                    let me=my;
                    if(myParentName){
                        me=myParent[myName];
                        if(me.connector) myMonkey({
                            fromSymColName:myParentName,
                            linkDef:_.extend(linkDef,{
                                toColName:myName
                            })
                        });
                        return;
                    };
                    _.each(me,(myKid,myKidName)=>{
                        if(typeof myKid !== 'object') return;
                        climbTree({
                            myParent:me,
                            myParentName:myName,
                            me:myKid,
                            myName:myKidName,
                            myMonkey
                        })
                    });
                })({
                    me:define,
                    myMonkey:({fromSymColName,linkDef})=>{
                        //the monkey gets to build the ass system
                        if(!defineHandle[fromSymColName]){
                            //create new node
                            defineHandle.newCol(fromSymColName);
                        }else{
                            //we met that guy before. introduce him to a new friend
                            defineHandle[fromSymColName].link(linkDef)
                        }
                    }
                })
            }
        }
    };
};


