import thunk from 'redux-thunk';

export default {
    t: require('tcomb-form'),
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
    reactAddonsTestUtils: require('react-addons-test-utils'),
    stdAccounts: require('meteor/jspoet:accounts-bootstrap'),
    reduxImmutable: require('redux-immutable'),
    meteor: {
        ValidatedMethod: require('meteor/mdg:validated-method'),
        Mongo: require('meteor/mongo'),
        meteor: require('meteor/meteor'),
        _: require('meteor/underscore')._,
        Tracker:require('meteor/tracker').Tracker,
        Random:require('meteor/random').Random,

    },
    deep: require('deep-get-set'),
}