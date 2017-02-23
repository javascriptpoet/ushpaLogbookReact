/* extend into new class and call createBoundInstance in constructor
 */
export default ({externals:{_}})=>class SelfBinder {
    constructor({instanceProps={}}){
        Object.assign(this,instanceProps);
    };
    bindProtoMethods(){
        const {prototype}=this;
        _.omit(Object.getOwnPropertyNames(prototype),'constructor').forEach((methodName)=>{
            const method=prototype[methodName];
            if(typeof method==='function')prototype[methodName]=method.bind(this)
        })
        return this
    };
    addWrappedMethods({wrappedMethods}){
        const {prototype}=this;
        Object.assign(prototype,_.objectMap(wrappedMethods,(wrappedMethod)=>wrappedMethod({self:this})));
    };
}