/*this is the bootstrap func and that is why its outside utils, cos utils is using it
for clarity sake, we separate bootstrap sequence into spacelike scopes.
spiceTime will allow to contract that space into an efficient time dimension.
 */
export default ({utils:{SelfBinder}})=>({require,path})=>new class extends SelfBinder{
    constructor(){
        super();
        this.bindProtoMethods();
        this.fileNames=require.context('./', false, /\.jsx$/).keys();
        this.localRequire=(fileName)=>require(`./${path.join('/')}/${fileName}`)
    };
    makeScope({parentScope={},handleModule}){
        const {reduce}=this;
        return reduce({
            reduceFile:({reducing:currentScope,fileName,require})=>handleModule({currentScope,fileName,require}),
            initValue:Object.create(parentScope)
        })
    };
    reduce(reduceFile,initValue){
        const {localRequire:require,fileNames}=this;
        return fileNames.reduce(
            ({reducing,fileName})=>reduceFile({reducing,fileName,require}),
            initValue
        )
    };
    map(mapFile){
        const {fileNames,localRequire:require}=this;
        return fileNames.map((fileName)=>mapFile({reducing,fileName,require}))
    };
    forEach(eachFile){
        const {fileNames,localRequire:require}=this;
        return fileNames.forEach((fileName)=>eachFile({reducing,fileName,require}))
    };
    toObj(getValue){
        const {reduce}=this;
        return reduce(({reducing,fileName, require})=>({...reducing,
            [fileName]:getValue({fileName,require})
        }),{})
    };
}