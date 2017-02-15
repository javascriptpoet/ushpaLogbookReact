
/*
 As in connectComponent, permissions are mapped to props but here passed to a getPermission func that is expected
 to return a boolean permission. This boolean is used to condition display of TComponent's form element.
 TComponent options.
 there are options to either disable or hide element on permission denied.
 */
export default ({
    React:{createElement},
    T:{createElement:createTElement},
    PM
})=>connectTComponent=({
    TComponent,
    getPermission,
    disable,
    hide,
    ...connectComponentProps
})=>createTClass({
    compose(){
        const tElement=createTElement(TComponent);
        return {
            type:createTElement(TComponent).type,
            options:Object.assign(
                tElement.options || {},
                {
                    disable,
                    template:(locals)=>PM.connectComponent(connectComponentProps)(
                        createClass({
                            render(){
                                const formEl=createElement(t.form.Form,tElement);
                                return hide?(!!getPermission.bind(tElement)(this.props) && formEl):formEl
                            }
                        })
                    )
                }
            )
        }
    }
})