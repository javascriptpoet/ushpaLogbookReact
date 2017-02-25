export default (keyList,getValue)=>require('./KeyList')(keyList).toObj({
    getPropValue:({key,index})=>getValue(key,index)
}).get()
