export default ({
    externals:{t, _},
    utils:{SelfBinder,localFiles},
    unwrapLocal,
    localModules
})=>localModules.toObj({getValue:({fileName,require})=>unwrapLocal({module:fileName}),require})