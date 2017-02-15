export default ({scope:{

}})=>({
    updateActionType:'rrUpdate',
    updateActionCreator:({_trackerId,reactiveData})=>{
        return {
            type:updateActionType,
            _trackerId,
            reactiveData
        }
    },
    isReadyActionType:'rrIsReady',
    isReadyActionCreator:({_trackerId,isReady})=>{
        return (dispatch,getState)=>{
            return {
                type:isReadyActionType,
                isReady,
                _trackerId
            }
        }
    }
})
