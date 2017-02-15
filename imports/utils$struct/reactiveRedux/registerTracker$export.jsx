export default ({
    externals:{_, meteor:{Tracker,Random}},
    locals:{createTrackerReducer, trackers,actions:{
        isReadyUpdateActionCreator,
        updateActionCreator,
    }}
})=>({trackerFunc})=>{
    const _trackerId=Random.id();
    trackers[_trackerId]=new class {
        constructor(){
            this.trackerFunc=trackerFunc;
            this._trackerId=_trackerId;
            this.connectedComponentsNum=0;
        };
        onComponentMount(dispatch){
            if(!this.connectedComponentsNum){
                this.computation=Tracker.autorun(()=>{
                    //every time trackerFunc is rerun, it updates reactiveData for that tracker in the store with data returned by the
                    //trackerFunc. Expects an object which is converted to immutable map and stuck into the state under trackerId key.
                    dispatch(updateActionCreator({
                        reactiveData:this.trackerFunc({
                            dispatch,
                            updateIsReady:(props)=>this.updateIsReady({dispatch,...props})
                        }),
                        _trackerId:this._trackerId
                    }))
                });
            };
            this.connectedComponentsNum++;
        };
        onComponentUnmount(){
            this.connectedComponentsNum--;
            if(!this.connectedComponentsNum){
                this.computation.stop();
            };
        };
        updateIsReady(dispatch,isReady){
            dispatch(isReadyUpdateActionCreator({
                _trackerId:this._trackerId,
                isReady
            }));
        }
    };
    return createTrackerReducer({_trackerId});
};

