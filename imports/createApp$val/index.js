const localFiles=require('./localFiles')({externals});
const scope=localFiles({require}).toObj({
    getValue:({fileName,require})=>require(fileName)({externals,scope})
});
export default scope.createScope