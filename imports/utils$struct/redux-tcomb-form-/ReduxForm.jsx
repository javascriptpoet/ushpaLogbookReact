/*
A wrapper for the Form component
It wraps tcomb-form Form component. The idea is to extend onChange function passed as property with its own redux connection functionality
 */
import React from 'react';
import t from 'tcomb-form';
import {bindACsToFormId} from './actionCreators';
import {bindActionCreators} from 'redux';
import {stateKey} from './createReducer';
import { Random } from 'meteor/random';
import {connect} from 'react-redux';
import {_} from 'meteor/underscore';

const {createElement,createClass,PropTypes,Component}=React;

//returns a reat class that extends tcomb Form with redux version of onChange prop and connects it to redux store
// Connection is thru state of the form specified by formId
//actionCreators for form related actions are passed to children (form element templates) in react context
export const ReduxForm=class FormMounter extends Component {
    constructor(props,context){
        super(props,context);
        const {store:{dispatch}}=context;
        const {init:{context,value,options,type},params={},onChange,...otherProps}=props;
        this.formId=Random.id();
        this.formACs=bindActionCreators(bindACsToFormId({formId:this.formId}),dispatch);
        const {update}=this.formACs;

        //this is useful to initiate record update forms with value of the collection record
        //update will happen only if initValue prop was specified so undefined and null can be used
        update({context,value,options,formType:type});
        const onChangeExtended=(value)=>{
            onChange && onChange(value);
            update({value})
        };
        const mapStateToProps = (state)=>({
            reduxFormState: state[stateKey][this.formId] || {}
        });
        this.ReduxConnector=connect(mapStateToProps)(t.form.Form)
    };
    componentWillUnmount(){
        this.formACs.unmount()
    };
    render(){
        let {reduxFormState:{context,value,options,formType:type},params={},ACs={},...otherProps}=this.props;
        context=t.update(
            {
                ...reduxFormState.context,
                ...{
                    ACs: {
                        ...ACs,
                        formACs: {...formACs}
                    }
                }
            },
            params
        );
        return createElement(this.ReduxConnector,{
            ...otherProps,
            context,value,options,type,
            onChange:onChangeExtended,
            ref:(input)=>{
                _.bindAll(input,'getValue','getComponent','validate');
                this.tcombApi=input
            }
        })
    }
};
Object.assign(ReduxForm,{
    propTypes:{
        init:PropType.shape({
            value:PropTypes.any, //inits redux state. useful for update forms
            options:PropTypes.shape, //used to initialize form options in redux store
            context:PropTypes.shape, //used to initialize form context in redux store
            type:PropTypes.any, //used to initialize form type in redux store, yes, even form type can be morphed
        }),
        params:PropTypes.any, //passed thru context to be used by field templates to generate options and other locals
        ACs:PropTypes.shape
    },
    contextTypes:{
        store:PropTypes.any
    }
})





