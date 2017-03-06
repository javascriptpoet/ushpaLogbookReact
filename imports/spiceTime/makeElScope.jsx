export default ()=>({
    elScope:{LocalFiles}
})=>({
    rootedLocalFiles
})=>({
    path
})=>(new RootedLocalFiles({path})).reduce({
    reduceFile:({reducing:currentScope,fileName,require})=>declareEls

        handleModule({currentScope,fileName,require}),
    initValue:Object.create(parentScope)
})
