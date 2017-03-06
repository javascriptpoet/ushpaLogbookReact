export default ({externals})=>{
    const unwrap=(strPath)=>require(strPath)({externals,unwrap,LocalFiles});
    const LocalFiles=unwrap('./getLocalFiles')({rootRequire:require});
    return LocalFiles.toObj({getValue:({fileName,require})=>require(`./${fileName}`)})
}