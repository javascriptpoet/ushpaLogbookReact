export default ({
    externals:{
        React:{Componen,createClass,PropTypes},
        reactRedux:{connect},
        _,
    },
    locals:{trackers}
})=>({
    mapTrackersToProps=null,
    ReactType,
    mapStateToProps=null,
    mapDispatchToProps=null,
    mergeProps=null,
    options={}
})=>connect(
        //modify mapStateToProps to inject reactive data from  all the trackers returned by mapTrackersToProps
        state=>Object.assign(
            mapStateToProps?mapStateToProps(state):{},
            mapTrackersToProps?mapTrackersToProps(state):{}
        ),
        dispatch=>Object.assign(
            mapDispatchToProps?mapDispatchToProps(dispatch):{},
            {dispatch}
        ),
        mergeProps,
        options
    )(createClass({
        contextTypes: {
            store: PropTypes.object
        },
        startStopTrackers(state){
            // we keep track of trackers by their ids inside the state returned by mapTrackersToProps for each tracker
            const {store}=this.context;
            const {dispatch}=this.props;
            _.each(
                mapTrackersToProps(store.getState()),
                (trackerState)=>trackers[trackerState.get('_trackerId')][`onComponent${state}`](dispatch)
            )
        },
         componentDidMount(){
             this.startStopTrackers('Mount');
         },
        componentWillUnmount(){
            this.startStopTrackers('Unmount')
        },
        render(){
            return <ReactType  {...this.props} />
        }
    })
)
