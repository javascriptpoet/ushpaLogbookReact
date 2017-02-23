export default ({externals:{_,deep},define})=>define({
    getType:()=>
    getValue: ()=> {
        class Deep {
            constructor(deepObj) {
                this.deepObj = deepObj;
            };

            setValue({value, path, onCondition = true}) {
                return (()=> {
                    if (onCondition) {
                        deep(this.deepObj, path, value);
                        return value
                    }
                    ;
                    return value
                })()
            };

            defineProperty(propPath, onCondition = true, propName, propSpec = {
                get: ({itsMe})=> {
                    if (!itsMe)throw new Meteor.Error('Getter error', 'getting of prop value is not allowed')
                },
                set: ()=> {
                    throw new Meteor.Error('Setter error', 'setting of prop value is not allowed')
                }
            }) {
                this.setValue({
                    value: Object.defineProperty(
                        deep(this.deepObj, propPath),
                        propName,
                        propSpec
                    ),
                    path: propPath,
                    onCondition
                });
                return propSpec.get({itsMe: true})
            }
        };
        return (deepObj)=>new Deep(deepObj)
    }
})