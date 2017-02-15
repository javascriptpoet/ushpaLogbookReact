//this is close to real syntax. second binder is the scope. first one is type scope and globals. But, its a fake.
//good candidate for a typical folder. each of the methods would be split into a module. parent folder will be typed
//as 'class' by $el:class token in file name. That would take care of all the boilerplate. Each method will look like
// ({types})=>({scope})=>({self})=>doItInOneLiner(...)
//yeah, the whole thing is about that nagging destruct statement that does not let me do a proper one liner.
//the framework will provide a self binder to do it in and i'm in, like a fox in the bin, like a lost stoke of bean,
// running off on a long board, from a guy that would hord him, from the hands of the hungry, to be free from that anger.
export default ({scope:{SelfBinder}})=>({require,path})=>new class extends SelfBinder{
    constructor(){
        super();
        this.bindProtoMethods();
        this.fileNames=require.context('./', false, /\.jsx$/).keys();
        this.localRequire=(fileName)=>require(`./${path.join('/')}/${fileName}`)
    };
    makeScope({parentScope={},handleModule}){
        const {reduce,localRequire}=this;
        return reduce({
            reduceFile:({reducing:currentScope,fileName,require})=>handleModule({currentScope,fileName, localRequire}),
            initValue:Object.create(parentScope)
        })
    };
    reduce(reduceFile,initValue){
        const {localRequire,fileNames}=this;
        return fileNames.reduce(
            ({reducing,fileName})=>reduceFile({reducing,fileName,localRequire}),
            initValue
        )
    };
    map(mapFile){
        const {fileNames,localRequire}=this;
        return fileNames.map((fileName)=>mapFile({reducing,fileName,localRequire}))
    };
    forEach(eachFile){
        const {fileNames,localRequire}=this;
        return fileNames.forEach((fileName)=>eachFile({reducing,fileName,localRequire}))
    };
    toObj(getValue){
        const {reduce}=this;
        return reduce(({reducing,fileName, require})=>({...reducing,
            [fileName]:getValue({fileName,require})
        }),{})
    };
}