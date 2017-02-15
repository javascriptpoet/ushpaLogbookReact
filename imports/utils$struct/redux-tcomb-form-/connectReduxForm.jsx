/*
connects ReduxForm to redux store vars.
thru a mapping function, store vars can be injected into context of prop of tcomb Form.
The context is built as a tree structure following the structure of the form type
for each level of the tree, there are params used to built options, error handling, even tcomb type
by executing a parametrized custom function
 */
import React from 'react';
import {connect} from 'react-redux';
import {ReduxForm} from './ReduxForm';

const {createClass,createElement}=React;
export const connectReduxForm=({mapStateToParams=()=>{},mapDispatchToParams=()=>{}})=>({ReduxForm})=>{
    const mapStateToProps=(state)=>({params:mapStateToParams(state)});
    const mapDispatchToProps=(dispatch)=>({ACs:mapDispatchToParams(dispatch)});
    const ConnectedReduxForm=connect(mapStateToProps,mapDispatchToProps)(ReduxForm);
    return createClass({
        render(){
            return createElement(ConnectedReduxForm, {
                ...this.props,
                ref:(input)=>{
                    this.tcombApi=input.tcombApi
                }
            })
        }
    })
}