export default ({
    externals:{
        redux:{
            applyMiddleware,
            createStore,
            compose
        },
        reduxThunk:thunk
    }
})=>({scope:{screens:{
    reducer
}}})=>({reducerInitState})=>createStore(
    reducer,
    reducerInitState,
    applyMiddleware(thunk)
)