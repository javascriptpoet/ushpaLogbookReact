export default ({externals,utils,unwrap})=>()=>{
    unwrap({require,module:'./accounts$func'})();
    unwrap({require,module:'./mui$func'})();
}
