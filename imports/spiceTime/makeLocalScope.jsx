export default ({})=>({elScope:{
    rootedLocalFiles,
    declareEl
}})=>({appRootRequire,appExternals})=>({parentScope,path=[]})=>rootedMakeScope({parentScope,
    handleModule:({currentScope,fileName,require})=>({...currentScope,
        //get rid of jsx extension
        [fileName.split('.').pop()]:require(fileName)({...globals,
            makeSpiceTimeScope,localRequire:require,
        })
    })
})

