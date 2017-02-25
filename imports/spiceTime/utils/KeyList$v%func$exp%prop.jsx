export default ({scope:{externals:{
    _,unwrap
}}})=>(keyList)=>new class extends unwrap('SelfBinder') {
    constructor(){
        super();
        this.createBoundInstance({
            instanceProps:{
                keyList,
                getPropValue :()=>undefined
            }
        })
    };
    toObj({getPropValue}){
        this.getPropValue=getPropValue
    };
    get(){
        return this.list.reduce((reducing,key,index)=>{
            Object.assign(this,{key,index,omit:false});
            const value=this.getPropValue(this);
            const {stop,omit}=this;
            return omit || stop?reducing:{...reducing,[key]:value}
        },{})
    };
    stop(){this.break=true};
    omit(){this.omit=true}
}