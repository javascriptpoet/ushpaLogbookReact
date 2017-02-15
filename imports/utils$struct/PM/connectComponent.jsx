/*
 connects react component to permission funcs in redux store.
 the connection is made via permissions objects.
 this function can be called only after permissions were consumed into a PM instance.
 specified permissions are mapped to the props of the component. what it gets is permission funcs and is reponsible
 for calling these funcs with proper params to obtain permission bools.
 */
export default ({
    reactRedux:{connect}
})=>({mapPElementsToProps,mapStateToProps,...connectProps})=>{
    const newMapStateToProps=(state)=>_.reduce(
        mapPElementsToProps(),
        (memo,pElement,propName)=>Object.assign({
            [propName]:deepGetSet(state,`${pElement.reduxKey}.${pElement.path}`)
        }),
        mapStateToProps(state)
    );
    return (Component)=>connect(mapStateToProps,...connectProps)(Component)
};