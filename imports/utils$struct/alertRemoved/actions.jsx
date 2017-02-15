export const alertActionCreator=({errMsg,warnMsg,infoMsg})=>{
    type:alertActionType,
    errMsg,
    warnMsg,
    infoMsg
}
export const alertActionType='alert';

export const closeAlertActionCreator=()=>{
    type:closeAlertActionType
}
export const closeAlertActionType='closeAlert';
