/*bootstrap func to be called in each index file. It creates the scope of the folder by extending parents scope with
local scope els. Each el name is file name and each file exports an init value for value els and a function with
own func scope which includes props. Els come in two flavors - val and func determined by file name token. For now, later,
file names will be used to define attrs of the type. The point is to let the tree tell its story as we robbing our code
of its voice by splitting it in little bitty cells locked up in their housing modules, afraid of neighbours. The index
files finish the job. I'v designed types that can be refined in place. This is how i avoid circular deps nightmare at
define time.
Then each module is required and unwrapped with that scope into a destruct heaven and pure syntactic bliss. Naked
els can be declared in index files. Then another func allows to define all the local types very granualy. One can define
in local modules or in index but for me it works very good in index. I can design the whole app by typing all the props
and funcs - a complete data flow. Everything is nicely contained and named and very declarative. Then, i fill in a few
one liners in module files. That part is easy and a lot of fun. Design is done, all in one file. Debugging should be
awesome. I basically put my own helmet on the silly flows/bugs of js. I dont want to be straightjacketed like in c++
but i love how quick i can debug my code after all that typing drama. React broke me down to crying. The length of
unrelated stack trace is depressing. Maybe, you know how to fix it.I saw some packages for long traces but could not
make it work with webpack amd meteor involved. I just want to go right over the head of higher authority, straight to
the bounty of their dumpster if not their hearts, as usual.

 */
/* i know its confusing. sorry. will be much better organized in modules in full version. this is an overgrown
bootstrap monster. this is a prime example where confusion coming from - keeping track of separation in time.
all these funcs are nice but when they get executed is hidden. I'm on the path to fix it but these tools are not created yet
so, for the last time ever, bear with confusion.
 */
const  createScope=({externals,scope:{localFiles}})=>({
    //globals binder, perched on top of the tree of folders perculating downscope
    globals:{
        require:topScopeRequire,
        utils
    }
})=>{
    const getCreateLocalScope=({
        //parent to child binder
        parent:{scope:parentScope={},path:parentPath=[]},
        child:{firstName:myFirstName},
    })=>({
        //func itself
        mapScopeProps = ({props})=>props,
        declareLocals = ()=> {},
        getInitValue //what we get is value of a val el or scope wrapped func of func el
    })=>{
        const localFiles=require('./localFiles')({externals});
        const {_}=externals;
        const {SelfBinder}=utils;
        const myPath=parentPath.push(myFirstName);
        const handleModules=({insertToScope,parentScope})=>{
            localFiles({
                require:topScopeRequire,
                path:myPath
            }).makeScope({parentScope,
                handleModule:({currentScope,fileName,require})=>insertToScope({require,
                    scope:currentScope,
                    fileNameObj:new (class {
                        constructor(fileName){
                            this.fileName=fileName;
                            const [firstName,flavor='val']=fileName.split('$');
                            Object.assign(this,{fileName,firstName,flavor})
                        }
                    })(fileName)
                })
            })
        };

        //a func to handle insertion of single el into scope
        const createScopeNode=({getInitValue=null,scope,name,flavor})=>new class El extends SelfBinder{
            constructor(){
                super();
                this.bindProtoMethods();
                if(getInitValue!==null && typeof getInitValue!=='function') getInitValue=()=>getInitValue;
                const {set,get}=Object.assign(this,{scope,name,flavor,getInitValue,
                    isSet:getInitValue===null?false:true,
                });
                set()
                Object.defineProperty(scope,name,{set,get});
            };
            set(getValue){switch(flavor){
                case 'val':
                    this.value=value;break;
                case 'func'

            };
            get(){
                const {value,flavor}=this;
                if(!isSet)return value;
                switch(flavor){
                    case 'val':
                        return value
                    case 'func':
                        const result=value({
                            set: ({name, value})=>scope[name] = value,
                            /*a new scope is created for a func by extending the parent scope with func props mapped
                             by the receipe
                             */
                            scope: Object.create(scope, _.objectMap(
                                mapScopeProps({props}),
                                ({prop, propName})=>({
                                    value: prop,
                                    writable: false
                                })
                            ))
                        });
                        value.result=result;
                        return value
                }
                return flavor==='val'?value:value({
                    set:({name,value})=>scope[name]=value,
                    /*a new scope is created for a func by extending the parent scope with func props mapped
                     by the receipe
                     */
                    scope:Object.create(scope,_.objectMap(
                        mapScopeProps({props}),
                        ({prop,propName})=>({
                            value:prop,
                            writable:false
                        })
                    ))
                })
            }
        };
        const myScope=handleModules({
            insertToScope:({
                currentScope:myScope,
                fileNameObj:{firstName,fileName,flavor},
                require
            })=>createScopeNode({flavor,
                initValue:require(`./${fileName}`)({externals, utils,
                    [(flavor===val?createValScope:createFuncScope)]:getCreateLocalScope({
                        parent:{scope:myScope, path:myPath},
                        child:{name:firstName}
                    })
                }),
                scope:myScope,
                name:firstName
            }).scope,
            parentScope:prevEls
        });
        declareLocals({
            declareFunc:({firstName,initValue})=>createScopeNode({initValue,
                scope:myScope,
                name:firstName+'$func'
            }),
            declareVal:({firstName,initValue})=>createScopeNode({initValue,
                scope:myScope,
                name:firstName+'val'
            })
        });

        /*we are creating scopeNode for this folder
         */
        return createScopeNode
    };
    return getCreateLocalScope
};
export default createScope()
