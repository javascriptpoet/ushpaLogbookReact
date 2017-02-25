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
the wrapper scope. A mapProps func can be supplied to each tick to help name clashes.
You are witnessing the flow of time in its rowest form - the spice flow.
 */
export default ({
    externals: {t, _, getUnwrapLocals},
    utils: {
        SelfBinder, localFiles, types: {
            func,struct,tClass
        }
    }
})=>func().tick('globals',{props:struct({
    externals:t.Object,
    require:t.Function
})}).tick('parentToChild',{props:struct({
    parentSpiceNode:t.Object, //in st we could just get VanillaSpice.instance out of scope
    childModuleName:t.String
}).tick('VanilaSpice',{result:
    tClass() //this would be declared into the scope and defined right here
}).tick('getInstance', {
    constructorProps: struct({}),
    result:struct({}) //again, this would be VanillaSpice.instance and
}).of(
    ({globals})=>({parentToChild})=>()=>({
        VanilaSpice:{},
        getInstance:({constructorProps})=>new //this sucks without spice
    })
)




class SpiceNode extends SelfBinder{
    constructor({
        parentToChild:{childModuleName,parentNode={}},
        getTicks,
        
    }) {
        super();
        this.addWrappedMethods({
            wrappedMethods: unwrapLocal({module:'protoMethods',require})
        });
        const unwrap=getUnwrapLocals({require});
        this.fullName=new unwrap({module:'FullName'})(childModuleName);
        this.path=parentPath?parentPath.push[this.fullName.firstName]:[];
        const {path,fullName,
            parentNode:{scopes:parentScopes, path:parentPath},
            type:class
        }=Object.assign(this,{globals,parentNode});


        /* we will tick the hidden system clock to build spiceNode
         this is the node defining itself by introducing himself to the nieghbours, learning from them about itself
         and recording their knowledge as its own flesh - its props
         each one of instance props is a scope like entity following js scope rules for that particular prop
         this is the space like definition since there is notion of locality - the local spiceNodes in the local scope
         time like definition is done during type definition by defining for each timeSlice
         */




        //build self and deconstruct
        ({
            //instance props
            fullName,
            externals,
            tType:myType,
            localVars,
            declareNakedVars,
            scopedValue:myScopedValue,
            defineVars:userDefineVars,
            parentScopeNode,

            //methods
            // all declares return newly created instance of Var
            declareModuleVar,
            declareVar,
            declareNakedVar, //var thats not a module
            constructor,
            defineVar,
            getScopedValue
        } = Object.assign(this, {
            //build my full name to handle anything with paths or file names and their attributes
            scope: Object.create(parentScope),
            types:Object.create(parentTypes),
            externals:externals || parentExternals, //inherit from parent
            tType:parentTypes[fullName.firstName],
            localVars:new unwrap({path:'./Vars',require})({scopeNode:this}),
            parentScopeNode,
            ...otherConstructorProps
        }));

        /*declare all children/folder files into scope.
         webpack contest is used. absolute path is obtained from defineApp@module
         type is set to the best guess filename provides at first.
         it will be enhanced later by using define - it composes types so the whole sequence must be passed on validation
         */
        localFiles(fullName.path).forEach((fileName,require)=>declareModuleVar({fileName}).define({
            type:new FileName({fileName}).type
        }));

        //let user declare all naked vars
        declareNakedVars({declareNakedVar,getScopedValue,scope});

        //define vars. Again, first my local modules get a chance, then, user finishes the job
        //this provides a way to do declarative defs either in the inde file or in local modules and
        //to declare and define a few strangers.
        _.each(localVars,(localVar)=>require(`./${localVar.fileName}`)({externals, scope, myVar}));

        //time for user to play define
        defineVars(getScopedValue,scope);
    }
}
