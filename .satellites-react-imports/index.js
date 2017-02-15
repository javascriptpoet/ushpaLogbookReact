/*
this is the top scope of the app
the factory of the app top scope, we will instantiate a Component style of scope. It will be propagated
down to all the children below thru index files.
this is where all the externals are imported, a lonely place on the top, they all fly in, we capture them and
stuff every one of them down into the guts of this application.
Nobody else gets to have their own. We give them what they need and they have to chose from it.
They clearly indicate their needs in the getExternals function. Watch for getExternals.jsx files and
in index files for defenition of getExternals. This function picks its deps from the externals coming from us above them.
Note: getExternals does not have to be passed as parameter, unstead, it will be picked out of array of locals as one of
the files in the scope folder.
 */
//NOTE: scopeManager is a bootstrap module and does not have any deps. It is important to import it directly from its
//folder and not thru utils index file cos we dont have a scope for it yet. We are, in fact, in the scope above the app,
//gods pearch.
export default ({defineSandboxScope})=>defineSandboxScope({
    defineLocals:({defineModules})=>defineModules({names:[
        'actions',
        'components',
        'config',
        'entry',
        'methods',
        'reducers',
        'schemas',
        'routes'
    ]})
})

