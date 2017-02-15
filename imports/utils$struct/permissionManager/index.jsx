/*
the abstraction description
permission definitions are collected from all the screens before routes defined similar to redux reducers. they are
used to initiate one or several permission managers (pM) as instances of PM. Then, components in the screens are connected to
 the permissions in the store thru permissions instances they generated at build time.
 Each pM has its own reducer and its own state in the store. Its state is permission funcs for all permissions it managers
 extended by user overrides, diff for each user.
Each pM has its permission config screen where admin can change user's overrides. Changes are reflected in the state and
propogate to all ui components as props.
 */
import {
    createClass as createTClass,
    createElement as createTElement
} from 'imports/utils/T';
import {PM} from './index';
import {actionCreators, actionTypes} from './actions';
import t from 'tcomb-form';
import {userTrackerReducer} from './userTrackerReducer';
import {combineReducers} from 'redux';
import deepGetSet from 'deep-get-set';
import {_} from 'meteor/underscore';
import {connect} from 'react-redux';

/*
Class for permissions object
each user overridable permission will be associated with instance of this class
each instance has a getPermissions method that builds downstream permissions tree full of permission funcs
or user overrides. permission funcs are called locally at the time of asking for permission.
this permissions instances are not connected to redux store.
each one, however, can generate TType for user permissions override form for its permission tree.
redux connection comes after instantiating a PM class which will provide a form component that updates redux
state on submit as well as user record.
to connect to a permission in redux store, use path property of a permissions object. Each should be used only once
in composing another one. This is to reflect that there is only need for one permission of each type thru application.
e.g. if a permission is used in a TType, the same permisiion will control all the instances of that form type no
matter which form it is used in. It might change in future when user will be able to create custom forms and fields.
Note that the path prop of each permissions object will be updated as it is used to compose other permissions higher up
the tree.
 */
/*
All the enteties below are carefully crafted to fit the abstraction implied below and this is how it should be used.
A one or more pM instances of PM (permission manager) are created by
 */


/*
 connects react component to permission funcs in redux store. the connection is made via permissions objects.
 this function can be called only after permissions were consumed into a PM instance.
 specified permissions are mapped to the props of the component. what it gets is permission funcs and is reponsible
 for calling these funcs with proper params to obtain permission bools.
 */
export const connectComponent=(mapPElementsToProps,mapStateToProps,...connectProps)=>{
    const newMapStateToProps=(state)=>_.reduce(
        mapPElementsToProps(),
        (memo,pElement,propName)=>Object.assign({
            [propName]:deepGetSet(state,`${pElement.reduxKey}.${pElement.path}`)
        }),
        mapStateToProps(state)
    );
    return (Component)=>connect(mapStateToProps,...connectProps)(Component)
};

/*
 Designed to extend a TComponent to condition display of its form element to permissions in redux store.
 As in connectComponent, permissions are mapped to props but here passed to a getPermission func that is expected
 to return a boolean permission. This boolean is used to condition display of TComponent's form element.
 TComponent options.
 there are options to either disable or hide element on permission denied.
 */
export const connectTComponent=(
    TComponent,
    getPermission,
    disable,
    hide,
    ...connectComponentProps
)=>createTClass({
    compose(){
        const tElement=createTElement(TComponent);
        return {
            type:createTElement(TComponent).type,
            options:Object.assign(
                tElement.options || {},
                {
                    disable,
                    template:(locals)=>this.connectComponent(connectComponentProps)(
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
