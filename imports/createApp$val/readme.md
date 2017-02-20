#This is the beginning of a universe
Like any universe, it has a purpose. It builds itself and when its done building it creates a function
createScope. This is the first particle ever - this is the law giver for all other universes that will be created 
by invoking it. <br>

##!!!Warning: 
this is an abstraction that abstracts reality. Its my reality. Remarkably, its very like
reality i observe outside. Perhaps, cos thats all i know. However, you might be from Mars and your reality
might be different. I have no appologies for that.

##How to use docs for this project
The docs are local to each scope/folder/stNode (spaceTimeNode)/granule of spaceTime. But, thats a misnomer. As you can see,
there is a docs dimension and beaty(styles) dimension and type (lawful js description) dimension.
Each readme.md file in each scope is a farely complete description of that scope. So, you strat here to find out the jist. 
It'll get you started, complete with simplified syntax and use case. When ready, you can go to the next level of understanding.
You can go down to each scope and and get an explanation how that stNode operates. You dont have to go all directions at once, tho. 
Just pick what interests you most at the moment. Choose your own path but arrive to the same place, on the right scgedule - your own.

##The reality abstraction
First, i have to do some prose to bring you in. <br>
Space time is composed of stNodes - granules. Each stNode represents a clocked function. Like any function, it has a function scope.
Its js scope, an object that extends parent scope with local elements - the file modules. An element can be of a val or func flavor.
Each element can be a folder full of structure or a simple file.  <br>
Each element is partially defined by its file name and fully in the index of parent scope or in module itself.
The type is all the meta that can be collected before app builds itself.
Heres the execution model. This is the lifecycle of a universe. The purpose of the universe is to define itself as an independant component.
Once a scope collects type info from all of its children (locals), it composes itself and presents itself as a gift to the rest of local
inhibitants. This is a time tick. Each tiime the clock ticks, something is created, otherwise, nothing changed and time did not advance.
So, the scope ticks all its children (off?), collects the results and creates itself - the space node.
This is greate but what about time. A universe does not get built in one tick, instantly. Its a process. Many ticks go by before all the 
elements (matter,particles,functions) are built to construct a space node (stNode). <br>
How do we account for the time dimension syntactically? This is THE source of, at least, my confusion. The syntax of time is missing 
from our js scripts. We have space - the collection of statements but it is important what gets created in which order. Thats time and
it gets very confusing keeping track of it.<br>
A stNode is a unit of space and it defines itself in each instance of time in universe history. Thats the time dimension, therefore timeSpaceNode.
It does it by a dict of functions - doTick. The key is the name of the time tick - the name of what is being created in that tick. So, a screen
stNode might have a reducer, permissions and react component ticks. It takes three ticks to build a screen component. Each doTick func
receives scope partially build up to that time and has access to the results of previous ticks of all local stNodes including type, el and 
beauty (style) scopes.<br>
When a stNode ran its clock, it is done. It built itself. The universe is ready. For what? for the user (the master race) to interact with it thru 
the browser. <br>
###In conclusion:
A universe ticks by universal clock. Each tick composes a property of local space thruout all space,e.g. reducers are composed. When all props are
are calculated,  the only thing left to do is execute the universe. This is when the reducer gets fed to the redux createStore and
routes are consumed by the Router component - the top scope func. When its executed (the app is executed), the universe at user command.
This is the ultimate one liner that does it all:
````javascript
createApp({...}).run()
````


###Val element
NOTE: tcomb types are used to type everybody involved in this story.

This is whats inside a val element file:
````javascript
export default (t.struct({
    externals:t.Object, //globals like React and redux or any other npm or meteor package
    utils:t.Object, //top scope utility lib. a scope can have its own utility but it will be placed into scope as any element
    types:t.Object, //type scope, similar to el scope but each element is type of el
    myType:elType, //type of scope el this module represents
    
}))=>

