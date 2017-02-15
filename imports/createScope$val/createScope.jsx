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
const  createScope=({externals,scope:{localFiles}})=>({
    //globals binder, perched on top of the tree of folders perculating downscope
    globals:{
        require:topScopeRequire,
        utils
    }
})=>({
    //parent to child binder
    parent:{scope:parentScope={},path:parentPath=[]},
    child:{firstName:myFirstName}
})=>({
    //func itself
    mapScopeProps = ({props})=>props,
    declareLocals = ()=> {},

    /*I know. confusing. THIS IS the crux of confusion, at least mine.
    this is the globals binder of this func (after createScope was called with globals),
    call it with parent,child and get createLocalScope
    in full monty version this will be a clocked func with more straightforward syntax to keep track of
    timing sequences
     */
    getCreateLocalScope
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
    const insertElIntoScope=({initValue=null,scope,name})=>{
        const {set,get}=new class extends SelfBinder{
            constructor(){
                super();
                this.bindProtoMethods();
                //this.flavor;
                if(initValue!==null)Object.assign(this,{
                    value:initValue,
                    isSet:true
                })
            };
            set(value){
                this.value=value
            };
            get(){
                const {value}=this;
                if(!isSet)return value;
                return flavor==='val'?value:type.of(
                    /*a new scope is created for a func by extending the parent scope with func props mapped
                     by the receipe
                     */
                    (props)=>value({
                        scope:Object.create(scope,_.objectMap(
                            mapScopeProps({props}),
                            ({prop,propName})=>({
                                value:prop,
                                writable:false
                            })
                        ))
                    })
                )
            }

        };
        return Object.defineProperty(scope,name,{set,get});
    };
    const myScope=handleModules({
        insertToScope:({
            currentScope:myScope,
            fileNameObj:{firstName,fileName,flavor},
            require
        })=>insertElIntoScope({
            initValue:require(`./${fileName}`)({externals, utils,
                createLocalScope:getCreateLocalScope({
                    parent:{scope:myScope, path:myPath},
                    child:{name:firstName}
                })
            }),
            myScope,
            name:firstName
        }),
        parentScope:prevEls
    });
    declareLocals({declare:({initValue,name})=>insertElIntoScope({initValue, scope:myScope, name})});
    return scope
};
export default createScope()
