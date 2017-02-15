/*creates lower scope within PM CodeUnit
 */
export default ({outerScope})=>passScope([outerScope,externals])([
    //connects react component to permission funcs in redux store.
    'connectComponent',

    /*
     @method PM#connectTComponent(params)
     Designed to extend a TComponent to condition display of its form element to permissions in redux store.
     @Parameter params {object}
     {
     }

     */
    'connectTComponent',

    /*
     returns an instance of PMComponent, a permission manager that will manage its heard of permissions
     (the answer is always no) and manage their state in redux store.
     */
    'createPMElement',
    'PMComponent'
])


export default ({externals})=>({
    createReducer:require('./createReducer')(externals)({}),
    loadPElement:require('./loadPElement')(externals),
    loadPElement:require('./loadPElement')(externals),
})

class {
    //it gets instance of Permissions representing the top level for PM instance
    //each instance will have its own reducer,state and config form
    constructor({reduxKey}) {
        this.reduxKey = reduxKey;
        this.pElement=pElement;
    };

    //creates and returns reducer to manage the state of this instance of PMComponent
    //we putting permission tree full of permission funcs or user overrides in the store.
    //no need to send any of these funcs to client by ssr. html will be composed on server and permission tree
    //will be reconstructed on client after all js gets loaded.

    createReducer=()=>registerTracker({
        trackerFunc: ()=>t.update(this.pElement.defaultPermissions,Meteor.user().permissions || {})
    });

    //loads/connects permission tree structure to an instance of PMComponent and its redux state
    loadPElement(props){
        return require('./loadPElement')({externals})(props)
    };

    //creates class to generate pElements specific to the PM instance, that is aware of its
    //reducer key in redux store and having access to its state.
    createPComponent(){
        const pM=this;
        return class PComponent {
            constructor({compose, permissionFunc, template}) {
                Object.assign(this, {
                    compose,
                    permissionFunc,
                    template,
                    pM
                });

                //config form type for permissionNode
                //it we replaced for upstream nodes during composition at build time
                //for each node itll be its config form that includes all downstream nodes
                this.TType = createTClass({
                    compose: ()=>({
                        type: t.Boolean,
                        options: {
                            template
                        }
                    })
                });
            };

            //a recursive walker for accessing tree composed downstream tr.
            //a recursion mechanism built into classes abstraction or compose func does not fit the bill here
            treeWalker(hisMonkeys) {
                return ({parent})=> {
                    const {
                        onEachNode = ()=> {
                        },
                        onBranchNode = ()=> {
                        },
                        onPermissionNode = ()=> {
                        }
                    }=hisMonkeys;
                    const {permissionFunc, compose, template,PComponent}=this;
                    const monkeyToys = {
                        current: this,
                        parrent
                    };
                    if (permissionFunc) {
                        onPermitionNode(monkeyToys);
                    } else if ((compose() instanceof PComponent))
                    //this allows linking one permission to another
                        return compose().treeWalker(hisMonkeys)(monkeyToys)
                    else {
                        //better be an object of Permission instances
                        _.each(pCompose, (pElement, name)=> {
                            this.name = name;
                            pElement.treeWalker(hisMonkeys)({parent: this})
                        });
                        onBranchNode(monkeyToys);
                    }
                    onEachNode(monkeyToys);
                }
            };

            getChildren({getChild}) {
                const {compose = ()=>({})}=this;
                return _.reduce(compose(), (composing, childPElement, name)=>Object.assign(composing, {
                    [name]: getChild({childPElement, name})
                }), {})
            }
        }
    };
};
