//The ugliness is due to bootstrapping issues. The nice syntax we creating is not there yet. This is what the fight is about.
//We are patching up a simplified implementation to use that nice syntax downstream, at least some of it.
export default ({externals})=>require('./../locals')({externals})()({require,
    unwrapProps:{externals}
}).els;
