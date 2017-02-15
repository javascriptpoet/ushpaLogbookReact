/*
react style but react-dep free implementation of tcomb composable types
the spirit and syntax of react is preserved with slight additions and mods.
 */
export default ({scope:{
    externals:{t,_},
    vars:{locals:{irreducibles$private:irreducibles}}
}})=>new class {
    constructor() {
        const T=this;
        Object.assign(this,irreducibles);

        //a common ancesstor to all TComponents.
        //it is public for monkey patching. Get over that.
        this.Component=class {
            constructor(props){Object.assign(this,props)}
        };
        this.createClass=(typeProps={})=> {
            const {
                compose = ()=> ({options:{}}),
                getPropTypes,
            }=typeProps;

            const Component= class extends T.Component {
                constructor(elProps={}) {
                    super(typeProps);
                    const {
                        validationProps={},
                        ...otherElProps
                    }=elProps;
                    this.props=otherElProps;

                    //validate props if specified
                    //custom getValidationErrorMessage can be set on props type to be called with args specified at TComponent instantiation
                    if(getPropTypes)t.validate(this.props, getPropTypes.bind(this)(validationProps), {context: validationProps});
                    Object.assign(this,compose(this));
                };
            };
            Component.typeName=typeName;
            return Component;
        };
        const NullComponent=this.createClass({
            compose:()=>({
                type:t.string,
                options:{
                    template:()=>({onChange})=> {
                        onChange('!!! null type. fix me. !!!');
                        return null;
                    }
                }
            })
        })
        // designed to accept three types of TComponents:
        // 1. an object: {type,options}
        // 2. a function: (props)=>{type,options}
        // 3. a composite TClass
        this.createElement=(Component, props)=>{
            if(Component===null) Component=NullComponent;
            T.TComponent(Component);
            let element;
            if (T.TClassComponent.is(Component))
                element= new Component(props)
            else if (T.TObjectComponent.is(Component))
                element= Component;
            return  _.pick(element,'type','options')
        };
        this.createTypeFor=(Component, props)=>this.createElement(Component,props).type;
        this.createOptionsFor=(Component, props)=>this.createElement(Component,props).options
    }
}




