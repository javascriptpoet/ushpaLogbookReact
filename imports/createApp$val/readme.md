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

###Val element
NOTE: tcomb types are used to type everybody involved in this story.

This is whats inside a val element file:
````javascript
export default (t.struct({
    externals:t.Object, //globals like React and redux or any other npm or meteor package
    utils:t.Object, //top scope utility lib 
    types
}))=>

