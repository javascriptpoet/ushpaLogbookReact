/*
creates reducer for a tracker
each tracker does have its own reducer but its the same func bound to a specific trackerId.
The shape of the state for each tracker/reducer is {isReady,isActive,trackerId,...(reactive data)}
reactive data is the keys returned by trackerFunc when it runs within reactive computation. it better not duplicate
the tracker builtin keys. trackerId is a random generated string id to keep store serializable.
isReady is updated by the trackerFunc via updateIsReadyActionCreator.
If on ssr the state is hydrated with isActive:true, its ok. It might be out of sync till a component starts the tracker up
 */
export default ({
    externals:{Immutable,_},
    locals:{actions}
})=>({_trackerId})=>(
    state=Immutable.Map({
        isReady:false,
        isActive:false,
        _trackerId
    }),
    action
)=>{
    const {type,_trackerId:actionTrackerId,isActive,isReady,reactiveData}=actions;
    if(_trackerId==actionTrackerId) 
        switch(type){
            case updateActionType:
                return _.reduce(reactiveData,(memo,val,key)=>memo.set(key,val),state)
            case isReadyUpdateActionType:
                return state.set('isReady',isReady);
        };
    return state;
}