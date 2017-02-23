export default ({externals:{unwrapLocal:unwrapUtilsLocal}})=>({
    unwrapLocal:bootstrapUnwrapLocal,//used for bootstrapping only
    scopeNode:{scope}
})=>new class extends unwrapUtilsLocal({module:'SelfBinder'}){
    constructor(props){
        super();
        const unwrapLocal=({module})=>(bootstrapUnwrapLocal?bootstrapUnwrapLocal({module}):scope[module]);
        createBoundInstance({
            protoMethodWrappers:unwrapLocal({module:'protoMethods'})
        });
        unwrapLocal({module:'constructor'})({self:this})
    }
}