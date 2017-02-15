import {openCloseModalAT} from './actionCreators';
const {Immutable} =require('imports/externals');

export const reducer=(
    state=Immutable.fromJS({
        show: false
    }),
    action
)=>{
    const {type,show}=action;
    if(type===openCloseModalAT) {
        const newState=state.set('show',show);
        return newState;
    }
    return state;
}