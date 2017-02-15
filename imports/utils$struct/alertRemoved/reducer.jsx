import {
    alertActionType,
    closeAlertActionType
} from './actions';
import {
    errAlert,
    warnAlert,
    infoAlert
} from './alertLevels';
const Immutable = require('immutable');

export const reducer=(
    state=Immutable.Map({
        open:false,
        alertMsg:'',
        alertLevel:''
    }),
    action
)=>{
    const {type,errMsg,warnMsg,infoMsg}=action;
    switch(type){
        case closeAlertActionType:
            return state.set('open',false);
        case alertActionType:    
            return state.merge({
                open:true,
                alertMsg:errMsg || warnMsg || infoMsg,
                alertLevel:(()=>{
                    if(errMsg)return errAlert;
                    if(warnMsg)return warnAlert;
                    if(infoMsg)return infoAlert;
                })()
            });
        default:
            return state;
    }
}