export default ({defineSandboxScope})=>defineSandboxScope({
    mapExternals:()=>require('./externals'),
    defineLocals:({defineModules})=>defineModules({names:[
        'reducers',
        'toArray',
        'combineStyling',
        'T',
        'MyList',
        'reactiveRedux'
    ]}),
    getValue:(scope)=>scope
})
