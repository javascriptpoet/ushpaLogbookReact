export default ({getLocals,localFiles,
    externals: {t, _},
    utils:{types: {
        func,struct,tClass
    }}
})=>({
    self:{constructor}
})=>({
    globals:{
        externals:appExternals,
        require:appRequire
    }
})=>({
    parentToChild:{
        childModuleName,
        parentNode
    }
})=>{
    const {FullName}=getLocals({require});
    const {
        path:parentPath=[],
        scopes:{typesScope:parentTypes,elsScope:parentEls}
    }=parentNode;
    this.fullName = new FullName(childModuleName);
    this.path = parentPath.push[this.fullName.firstName];
    const {path, fullName, type}=Object.assign(this, {
        parentNode,
        type:constructor,
        elsScope:Object.create(parentEls),
        typesScope:Object.create(parenTypes)
    });


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
        tType: myType,
        localVars,
        declareNakedVars,
        scopedValue: myScopedValue,
        defineVars: userDefineVars,
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
        types: Object.create(parentTypes),
        externals: externals || parentExternals, //inherit from parent
        tType: parentTypes[fullName.firstName],
        localVars: new unwrap({path: './Vars', require})({scopeNode: this}),
        parentScopeNode,
        ...otherConstructorProps
    }));

    /*declare all children/folder files into scope.
     webpack contest is used. absolute path is obtained from defineApp@module
     type is set to the best guess filename provides at first.
     it will be enhanced later by using define - it composes types so the whole sequence must be passed on validation
     */
    localFiles(fullName.path).forEach((fileName, require)=>declareModuleVar({fileName}).define({
        type: new FileName({fileName}).type
    }));

    //let user declare all naked vars
    declareNakedVars({declareNakedVar, getScopedValue, scope});

    //define vars. Again, first my local modules get a chance, then, user finishes the job
    //this provides a way to do declarative defs either in the inde file or in local modules and
    //to declare and define a few strangers.
    _.each(localVars, (localVar)=>require(`./${localVar.fileName}`)({externals, scope, myVar}));

    //time for user to play define
    defineVars(getScopedValue, scope);
}
