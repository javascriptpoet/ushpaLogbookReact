/*
We have to type in local files for the lack of tools to do it in index files which is the prefered way
however, types can be refined thru the code base and definitions can be split however it makes sense.
ticks can be added to a func and type elements can be refined for each defined tick.
 */
/*
if it was spiceTime, second arg in each tick definition could be wrapped by scopeMe(getScopedValue) func
at run time, each wrapper will be served with its scope. its the same scope object but it moves thru time
while moving thru the space of wrappers, each tick generating more history hanging off eac scope function element.
Why not off val els? Vals tick inside but mute outside so to us, they get done in one tick and the results appear
as props of an object. Yeah, they return an object if they wonna be tickled. They can be complex and structured inside.
Each wrapper is a function scope and has its own spiceNode and its own scope. the props of the wrapper are injected into
the wrapper scope.
You are witnessing the flow of time in its rowest form - the spice flow.

spiceTime version of this module:
export default ({defineClass})
 */

export default ({makeSpiceTimeScope,
    externals: {t},
    utils: {SelfBinder,types:{func,struct,tClass}}
})=>func().tick('globals',{
    props:struct({
        externals:t.Object,
        require:t.Function
    }),
    defaults:{externals:{}}
}).tick('parentToChild',{
    props:struct({
        parentNode:t.Object, //in st we could just get VanillaSpice.instance out of scope
        childModuleName:t.String
    }),
    defaults:{parentNode:{}}
}).tick('VanillaSpice',{
    result: tClass()
}).tick('getInstance',{
    constructorProps: struct({}),
    result:struct({}) //again, this would be VanillaSpice.instance and
}).of(
    (/*this would be {elsScope,scopeMe} in spiceTime*/)=>{
        const {}=>
        return ({globals})=>({parentToChild})=>()=>{ //in spiceTime, parallel syntax will be used ...of().tick(name,wrapper)
            const {protoMethods,constructor}=getLocals({require});
            const VanillaSpice=class extends SelfBinder {
                constructor(constructorProps){
                    super();
                    this.addWrappedMethods({
                        wrappedMethods:protoMethods({globals})({parentToChild})
                    });
                    constructor({self:this})({globals})({parentToChild})(constructorProps)
                }
            };
            //doing it as a clocked func w/o spiceTime actually complicates things. this is just to finetune the syntax
            return {VanillaSpice,
                getInstance:({constructorProps})=>new VanillaSpice({constructorProps})
            }
        }
    }
)







