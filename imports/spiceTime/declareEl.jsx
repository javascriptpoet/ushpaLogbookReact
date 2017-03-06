/*
declares el in elScope as func or val of const or not
designed to work for bootstrap and run time
once declared, an ell has to be init(val)
if el declared as func, that func gets wrapped in system runTickProps of shape {elScope,propsScope}
 */
const declareEl= ()=>({elScope:{throwError}})=>({isBootstrap})=>({name, context, appProps})=>{
    let val;
    let setEl,initEl;
    if(isBootstrap){
        const {elScope,propsScope,flavor:{isConst,isFunc}}=context;
        initEl=({initVal})=>{
            val=initVal;
            Object.defineProperty(elScope,name, {
                get: ()=> {
                    if (isFunc) return (props)=>val({
                        elScope:Object.create(elScope),
                        propsScope:Object.create(propsScope,props),
                        props //in bootstrap props are a container. it will be *props later
                    })
                },
                set:(newVal)=>{
                    if(isConst)throwError('Access Error',`${name} is const. can not be set to ${newVal}`)
                    val=newVal
                }
            })
        }
    }
    return Object.defineProperty(targetElScope,name,{
        get:()=>({
            init: (initVal)=>initEl({initVal})
        }),
        set:(newVal)=>throwError('Access Error',`${name} must be init before it can be set to ${newVal}`)
    })[name]
}