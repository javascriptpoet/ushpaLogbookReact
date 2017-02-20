/*createStore is func in parent scope, reducerInitState is a val el declared in this scope by index file
when createStore is invoked, the result (store) is recordered as the static prop of createStore, no extra els
and names are required. all in a nice package.
 */
export default ({externals})=>({scope:{createStore,reducerInitState}})=>({history})=>createStore({reducerInitState})