/*
this file provides externals to the rest of the app
This is the only place the deps are imported, then, they trickle down the scopes
to all the modules react prop style. Each folder/scope picks its own deps
out of passed from the parent in a declarative manner.
No importing from strange and magical places is allowed from now on.
Complete structural lockdown.
Basically, this is immitation/replacement of global object but in a declarative style.
Its OK to have externals if you have complete control of the gang.
 */
import thunk from 'redux-thunk';
import utils from '/.utils';

//note, utils are treated as an external. There is no scope wrapper cos the external guy chose not to
//import any externals from another guy into his sandbox. He did chose to use the scoping scheme internally, tho.
//the reason is it will be a system of npm packages soon managed by npm.
const {
    T,
    reactiveRedux,
    permissionManager,
}=utils;
export default {
    t: require('tcomb-form'),
    T,
    utils,
    injectTapEventPlugin:require('react-tap-event-plugin'),
    reactiveRedux,
    permissionManager,
    React: require('react'),
    reactRedux: require('react-redux'),
    redux: require('redux'),
    reduxThunk: thunk,
    ReactRouterSSR: require('meteor/rubix:reactrouter:react-router-ssr').ReactRouterSSR,
    reactRouter: require('react-router'),
    rubix: require('@sketchpixy/rubix'),
    ReactDOM: require('react-dom'),
    classNames: require('classnames'),
    reactRouter: require('react-router'),
    l20n: require('@sketchpixy/rubix/lib/L20n'),
    Immutable: require('immutable'),
    _: require('meteor/underscore')._,
    reactAddonsTestUtils: require('react-addons-test-utils'),
    stdAccounts: require('meteor/jspoet:accounts-bootstrap'),
    reduxImmutable: require('redux-immutable'),
    meteor: {
        validatedMethod: require('meteor/mdg:validated-method'),
        mongo: require('meteor/mongo'),
        meteor: require('meteor/meteor'),
    },
    deepGetSet: require('deep-get-set')
}

