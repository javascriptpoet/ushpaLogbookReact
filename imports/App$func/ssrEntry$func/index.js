export default ({createFuncScope,set,
    externals:{
        React:{ Component },
        reactRedux:{Provider},
        redux:{
            applyMiddleware,
            createStore,
            compose
        },
        reduxThunk:thunk,
        ReactRouterSSR,
    },
    utils
})=>{
    const {config,actions,Routes,reducer}=createFuncScope({
        declareLocalls:({declare})=>{
            declare({name:'reducerInitState'})
        }
    });


// Pass the state of the store as the object to be dehydrated server side
    const dehydrateHook = () => store.getState();

// Take the rehydrated state and use it as the initial state client side
    const rehydrateHook = state => initialState = state;

// Create a redux store and pass into the redux Provider wrapper
    const wrapperHook = app =>(
        <Provider store={store}>
            {app}
        </Provider>
    );
    const rootElement='root';
    const clientOptions = { historyHook, rehydrateHook, wrapperHook, rootElement };
    const serverOptions = { historyHook, dehydrateHook,disableSSR:true };

    Meteor.startup(() => {
        if(Meteor.isServer){
            // Do server-rendering only in production
            // Otherwise, it will break the hot-reload
            // DO NOT REMOVE THIS LINE. TO TEST run: "meteor --production" instead
            if (process.env.NODE_ENV === 'production') {
                ReactRouterSSR.LoadWebpackStats(WebpackStats);

                ReactRouterSSR.Run(Routes,clientOptions,serverOptions)
            }

            WebApp.addHtmlAttributeHook(function() {
                return {
                    "dir": "ltr",
                    "class": "default"
                }
            });
        }else if(Meteor.isClient)
            ReactRouterSSR.Run(Routes,clientOptions,serverOptions)
    });


}