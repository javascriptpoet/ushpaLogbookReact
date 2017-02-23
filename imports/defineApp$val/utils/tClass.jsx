export default ({externals:{t,_}})=>()=>{
    const tClass= ({
        prevMyType, //this is for redefinition in place to help circular deps
        methods={},
        instanceProps={},
        constructorProps={},
        extendeeType,
        extendeeClass
    })=>{
        /*handle updating in place. each of static props of myType is treated as a container and updated in place
        as well as myType itself. this is for helping circular deps
         */
        let myType;
        if(prevMyType) {
            const {
                methods:prevMethods,
                instanceProps:prevInstanceProps,
                constructorProps:prevConstructorProps,
                extendeeType:prevExtendeeType,
                extendeeClass:prevExtendeeClass
            }=prevMyType;
            methods = Object.assign(prevMethods, methods);
            instanceProps = Object.assign(prevInstanceProps, instanceProps);
            constructorProps = Object.assign(prevConstructorProps, constructorProps);
            extendeeType = extendeeType ? extendeeType : prevExtendeeType;
            extendeeClass = extendeeClass ? extendeeClass : prevExtendeeClass;
            myType=prevMyType;
        }else myType=t.refinement(t.Function,(C)=>{
            if(!C.constructor) return false;
            return checkMyMethods(C.prototype)
        },'class');
        let {extendeeClass}=Object.assign(myType, {methods, instanceProps, constructorProps, extendeeType,
            extendeeClass:(!extendeeClass && !extendeeType)?Object.constructor:extendeeClass
        });
        const getAllInstanceProps=()=>Object.assign(
            instanceProps,
            extendeeType?extendeeType.getAllInstanceProps():{}
        );
        const checkMyMethods=(proto)=>{
            if(!proto) return false;
            if(!t.struct(methods,{strict:true}).is(_.omit(proto,'constructor'))) return false;
            if(extendeeType) return extendeeType.checkMyMethods(Object.getPrototypeOf(proto));
            if(extendeeClass) return extendeeClass===proto.constructor
        };
        const of=(C)=>{
            myType.is(C);
            return class extends C {
                constructor(props){
                    super(t.struct(constructorProps)(props));
                    myType.instance.is(this)
                }
            }
        };
        const refine=(props)=>tClass({...props,prevMyType:myType});
        return Object.assign(myType, {of,checkMyMethods, getAllInstanceProps,refine,
            instance:t.struct(getAllInstanceProps())
        });
    };
    return tClass
};
