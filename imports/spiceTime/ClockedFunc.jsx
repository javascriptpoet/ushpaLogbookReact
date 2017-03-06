export default ({externals,utils:{SelfBinder}})=>({elScope})=>({context:{elScope,propsScope}})=>{
    class ClockedFunc extends SelfBinder {
        constructor({tickNames=[],tickFuncs={}}){
            super();
            this.bindProtoMethods();
            class Tick extends SelfBinder {
                constructor({name,tickFunc}){
                    super();
                    this.bindProtoMethods();
                    Object.assign(this,{name,tickFunc,
                        isVal:name.includes('$val'),
                    })
                };
                run(){
                    const {isVal,name,tickFunc}=this;
                    if(isVal)return
                }
            };
            Object.assign(this,{tickNames, tickFuncs});
        };
        defineTick
        tick(){

        }
    }
}


{
    /*tick can return next tick func or object of shape {result,nextTickFunc}
    result is given the key of tick name and hang on original func
    */





    let prevTickResult={nextTickFunc:func};
    let prevContext=parentContext;
    return (func)=Object.assign(func,{

        nextTick:(name,props)=>{
            let tickResult;
            if(typeof prevResult==='function')tickResult={nextTickFunc:}
        }
    })


    const makeClockedFunc=(func)=>{
        let prevResult=func;
        let prevContext=parentContext;
        return Object.assign(func,{
            nextTick:(name,props)=>{prevResult=func[name]=prevResult({
                [`${name}Props`]:props})
            }
        })
    };
    const func=(props)=>val({props,
        elScope:Object.create(parentElScope),
        propsScope:Object.create(parentPropsScope,props)
    });
    return makeClockedFunc(func)
}