/*
the spice bounded func becomes static prop of each spice.
it extends timeline with new ticks by concatanating new ticks to the old ones
this is done in place. first, a new spice is declared to produce a new class - extension of VanillaSpice
with new name. THATS IT.
Then the timeline of new spice is composed sequentially by a chain of define().define()..
Each define can specify an array of spices and/or additional stray ticks. The juice of timelenes of each spice
is extracted and composed into the new guy timeline. A few strays are thrown in as well. This can be done
in one define or spread out thru your whole structure and scopes and modules downscope. A spice can be declared
upscope and defined three scopes down
So, yes, a func way downscope can modify behaviour of an element out of its scope by monkying with timeline of its proto -
 institutionalized monkey patching. Not sure if thats a good idea but it fits the abstraction so i think i can handle it.
 I call it app composition.*/
export default ({
    externals:{t,_},
    utils:{toArray}
})=>()=>({parentSpice})=>({spices:donorSpices,getTickNames,getTicks})=>{
    const {prototype:pPrototype}=parentSpice;
    const pTl={getTicks,getTickNames}=pPrototype;
    //props are extendee tick names/ticks
    const extendTl=({
        extendeeTl:{getTickNames:eeGetTickNames,getTicks:eeGetTicks},
        extenderTl:{getTickNames:erGetTickNames,getTicks:erGetTicks}
    })=>({
        getTickNames:(props)=>[...eeGetTickNames(props),...erGetTickNames(protoGetTickNames(props))],
        getTicks:(props)=>({...eeGetTicks(props),...erGetTicks(protoGetTickNames(props))})
    });
    object.assign(pPrototype,toArray(donorSpices).reduce((extendeeTl,donorSpice)=>extendTl({extendeeTl,
        extenderTl:_.pick(donorSpice,'getTicks','getTickNames')
    }),pTl))
}