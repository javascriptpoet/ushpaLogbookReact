export default ({scope:{
    externals:{
        redux:{combineReducers},
        meteor:{_}
    }
}})=>({
    /*
     extends a reducer to filter out by name supplied in the action.
     useful for reusing reducers
     */
    makeNamedReducer({reducer,name}){(state,action)=>(name && name!==action.actionName)?state:reducer(state,action)},

    /*
     creates combined reducer from a structure resembling shape of the state
     immutable safe
     reducers are extended to be named if $name is specified inside descriptor object{$reducer,$name}
     an array of 'side effect only' reducer descriptors can be supplied under $sideEffectsReducers key. 
     reducer descriptors are as described above (can be named), the reducer signature is reducer(action)
     */
    combineNestedReducers({reducerMap}){
        return combineReducers(_.reduce(
            _.clone(reducerMap),
            (memo,reducerDescriptor,key)=>Object.assign(memo,{
                [key]:(typeof reducerDescriptor === 'object')?
                    (()=>{
                        let {$reducer:reducer, $name:name}=reducerDescriptor;
                        memo[key] = name ?
                            makeNamedReducer({
                                reducer: $reducer,
                                name
                            }) :
                            combineNestedReducers(reducerDescriptor)
                    })():
                    reducerDescriptor
            }),
            {}
        ));
        
    },

    /*
     creates a reducer from a map of case functions
     */
    caseFuncsToReducer({$initState:initState,...caseMap}){
        return (state = initState, action) => {
            const reducer = caseMap[action.type];
    
            return reducer ? reducer(state, action) : state;
        };
    }
})
