/*
there are only two scopes/props built in into spiceNode - types and els
user can extend with more
 */
export default ()=>({self:{makeScope}})=>()=>

    makeScope({handleModule,parentScope:parentScopes[scopeName]})