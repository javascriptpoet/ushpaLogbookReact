import {_} from 'meteor/underscore';

export const actionTypes={
    updateState:'redux-tcomb-forms.updateState',
    mount:'redux-tcomb-forms.mount',
    unmount:'redux-tcomb-forms.unmount',
    formAction:'redux-tcomb-forms.formAction',
};
export const actionCreators={
    updateState:(modifier)=>({
        type:actionTypes.updateState,
        modifier,
    }),
    mount:({formId,initModifier,reducer})=>({
        type:actionTypes.mount,
        ...{formId,initModifier,reducer}
    }),
    unmount:({formId})=>({
        type:actionTypes.unmount,
        formId
    }),
    formAction:({formId,formAC})=>({
        type:actionTypes.formAction,
        ...{formId,formAC}
    })
};
export const bindACsToFormId=({formId})=>
    _.reduce(
        actionCreators,
        (memo,actionCreator,name)=>Object.assign(memo,{
            [name]:(otherParams={})=>actionCreator({formId,...otherParams})
        }),
        {}
    )
