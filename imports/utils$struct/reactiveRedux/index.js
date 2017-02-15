export default ({createSandboxChildScope})=>createSandboxChildScope({
    defineLocals:({defineLocalModules,defineLocalVar})=>{
        defineLocalModules({moduleNames:[
            'reactiveConnect$export',
            'registerTracker$export',
            'trackers',
            'createTrackerReducer',
            'actions'
        ]});
        defineLocalVar({
            name:'trackers',
            getValue:()=>({})
        })
    },
    getValue:({getExports})=>getExports()
})
