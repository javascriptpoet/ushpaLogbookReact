export default ({
    utils:{SelfBinder},
    externals:{_}
})=>({rootRequire})=>class extends SelfBinder{
    constructor({dirPath}){
        super();
        this.bindProtoMethods();
        this.localRequire=(fileName)=>rootRequire(`${dirPath}/${fileName}`);
        this.fileNames=rootRequire.context(dirPath, false, /\.jsx$/).keys();
    };
    makeScope({handleModule,parentScope,locals={}}){
        const {reduce}=this;
        return reduce((({
            reducing:currentScope,
            fileName,
            require
        })=>Object.assign(
            currentScope,
            handleModule({fileName,require}) || {}
        )),Object.create(parentScope,locals))
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

