export default ({externals:{_}})=>()=>({parentScope})=>_.mapObject(
    parentScope,
    (parentScopeProp)=>Object.create(parentScopeProp)
)