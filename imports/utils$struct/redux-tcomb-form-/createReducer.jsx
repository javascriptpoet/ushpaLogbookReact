/*
Forms are transient. They are mounted and dismounted along with their state. Multiple instances of the same formId might
be mounted at the same time. Each will have its own state with a unique key in the global forms state
object.
 */

import {actionTypes} from './actionCreators';
import t from 'tcomb-form';
import {_} from 'meteor/underscore';

export let stateKey;
const forms=new class {
    constructor(){
        this.formsCash={};

        this.Form=class {
            constructor(reducer){
                this.reducer=reducer;
            };
            updateState(){
                state[formId] = t.update(formState,actionParams.modifier);
            };

            unmount(){
                delete state[formId];
            }
        };
    };
    doAction({action,state}){

    };
    mount(){
        //handle form creation and cashing. on mount, either connect to cashed form or create new one
        //forms are taken out of cash on unmount
        const {initModifier,reducer}=actionParams;
        if(form) return;
        formsCash[formId]=new this.Form(reducer);
        form=formsCash[formId];
        this.updateState({
            value:{$set:null},
            options:{$set:null},
            context:{$set:null},
            formType:{$set:null},
        });
        !!initModifier && this.updateState(initModifier);
    };
    formAction(){};
};
export const createReducer=(formsStateKey='forms')=>(state={},action)=> {
    stateKey=formsStateKey;
    const {type, formId, ...actionParams}=action;
    let form=formsCash[formId];
    formState=state[formId] || {
        value:null,options:null,context:null
    };



    if(!formRecord)return state;

    switch (type) {
        case actionTypes.mount:
            const {reducer=(state)=>state}=actionParams;
            formRecords[formId]=new FormRecord({reducer});
            break;
        case actionTypes.unmount:
            formRecords[formId].unmount();
            delete formRecords[formId];
            break;
        case actionTypes.updateState:
            formRecords[formId].updateState();
            break;
        case actionTypes.formAction:
            //all currently mounted forms will be envolved and only those
            for(let locFormId in formRecords){
                formRecords[formId].update=t.update(formState,formRecords[locFormId].reducer)
            }
    }
    return state
};

