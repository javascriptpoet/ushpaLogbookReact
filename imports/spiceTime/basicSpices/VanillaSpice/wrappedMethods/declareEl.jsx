/*
declares a child element into local elScope
this is when most of the magic happens - propagation downscope and the mechanics of el initialization and access
 */
export default ({makeSTScope})=>({parentScope})=>({self:parentSpiceNode})=>(childFullName)=>{
    const {
        ElScope:pElScope,
        constructor:pConstructor,
        children:pChildren
    }=parentSpiceNode;
    const cSpiceNode=new pConstructor()
    const {FullName}=makeSTScope({dirPath:'./basicSpices/VanillaSpice/wrappedMethods',parentScope});
    const {firstName,isConst,isFunc}=new FullName({fullName});

    const initEl=({initVal})=>{
        spiceNode.value=initVal;
        Object.defineProperty(elScope,name, {
            get: ()=> {
                if (isFunc) return (props)=>val({
                    elScope:Object.create(elScope),
                    propsScope:Object.create(propsScope,props),
                    props
                })
            },
            set:(newVal)=>{
                if(isConst)throwError('Access Error',`${name} is const. can not be set to ${newVal}`)
                val=newVal
            }
        })
    }
    return Object.defineProperty(targetElScope,name,{
        get:()=>({
            init: (initVal)=>initEl({initVal})
        }),
        set:(newVal)=>throwError('Access Error',`${name} must be init before it can be set to ${newVal}`)
    })[name]
}