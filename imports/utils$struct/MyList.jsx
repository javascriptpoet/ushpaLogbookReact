export default ()=>class {
    constructor(list){
        this.list=list
    };
    loadParams(params){return Object.assign(this,params)};
    context(v){return this.loadParams({context:v})};
    getValue(v){return this.loadParams({getValue:v})};
    value(v){return this.loadParams({value:v})};
    getKey(v=()=>undefined){return this.loadParams({getKey:v})};
    toObject(params){
        const {list,context,getValue,value,getKey}=this.loadParams(params);
        return list.reduce((memo,listItem,listIndex)=>{
            this.loadParams({listItem,listIndex});
            memo[getKey(this)]=(()=>{
                if(getValue) return getValue(this);
                return value;
            })()
        })
    }
}