/*
timeline gets composed from
    1. spice timeline which can not be modified when spiceNode is instantiated from it
        but instance ticks can be adeed to it
    2. by $tick files first. each one should have tick sequence number in its name like tickName$tick:2
        this is the sequence number passed the proto ticks.
    3. then, by getTimeline func in the index file which can add its tack on top of the ticks
 */
export default ()=>(makeSTScope)=>({self:{timeline:{tickNames,ticks}}})=>(name,tick)=>{
    if(ticks[name])throwError(`attempt to double install tick ${name}. use another tick if intent is to extend the old one`);
    ticks[name]=tick;
    tickNames.concat(name)
};