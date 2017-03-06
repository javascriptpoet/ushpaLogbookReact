/* this is the law giver function.
the bootstrap func to use in top scope index of each app.
it will be placed in the parent folder holding all apps or imported as npm package for a single app

Heres the landscape of spiceTime.
The spice space is build as network of spiceNodes, each an instance of its SpiceType. SpiceTypes have names,e.g 'screen',
or 'form'. once a scope/folder is defined as 'screen' by $screen token in its name, all its inhabitants downscope
are locked into that type of spice and no other mention of that is necessary, tho does not hurt a single $val or $func.
That is until an evil alien specifies another type of spice in file name and new game begins with its own syntax performing completey
dif function but essential for its parent.
Once spiceType is declared by a file name token, it can be used in a file token anywhere downscope w/o any belaboring the
obvious. What if you need it in a neighboring func scope out of scope? Well, declare it in plain javascript upscope
in a special declare$mySpice.jsx file - one per declaration. Sorry for inconvenience but clarity wins applauds in spiceTime
space.
No boilerplate allowed. All that boring stuff is encapsulated into spice and served as syntactic source or just plain does it for you.
SpiceComponents are no special deal or some kinda globals. There is no god in that universe, sorry. Its an anarchy. So,
if you need to spice with a dif tune, simply come up with a funny name and stick it into module name, e.g. bigBrain$crazy
and you just created the most beautiful artificial mind that likes to discuss the power of spice with you.
Then, you define the new SpiceType inside that module before proceding to the task - in define time wrapper.
The spiceNode of this module is instance of CrazySpiceType and all index files downscope will be unwrapped with
createCrazySpice function. Thats what builds local crazy spice space. If module defies the suggestion, he throws. Thats
type locking, right there on the spot w/o mile long traces to track.
As any property of spice space, SpiceTypes are contained in scopes per js standard - typeScope. theres a type for each
element (el) in elScope.
These types are very granular and dont have to be defined completely or in one place or at all. But, its not a bad idea to
have a file or place in the index file where complete functionality of scope (function) is described in plain javascript.
Nice to design in a single script again. Filling in a few one liners is a spice breeze after that. As a bonus you get type
checking, type interlocking, place to keep default values for all props. And, my faved, complete description of all the props
so im free to be as terse in my code as spice allows me. Note that all the data flow is completely exposed by typing.
Its complete documentation spoken in javascript. And that, after the initial introduction is made thru file names and
structure itself.
All types are composed from other types in typeScope and refined in place.

What is tick:
its a click of a wrapper in this construct (...)=>(...)=>....
This is not a complete example, its the simplest. In general, a tick unwraps the nest wrapper to receive the object created
by the tick (create prop) and stub of the next tick that is filled in by invoking that stub and supplying the next wrapper.
So, result of a tick is this shape {create:t.Any,tick:t.func(...)}
 */
/*
the point here is to bootstrap a func to propagate scope that can be used both for creating timeSpace and other apps as well
then, bootstrap process can use same techniques as the tools it creates will allow
 */
const externals={
    _:require('meteor/underscore')._,
    t:require('tcomb-form'),
    deep: require('deep-get-set'),
    throwError:({msg})=>{throw new Meteor.Error('Scope error',msg)},
};
const utils=require('./utils')({externals});
const makeSTScope=({
    dirPath='./',
    fileName:myFileName='index.js',
    parentScope={}
})=>{
    const locals=(new require('./getLocalFiles')({utils,externals})({rootRequire:require})({dirPath})).toObj({
        getValue:({require,fileName})=>{
            if(fileName!==myFileName)return require(`./${fileName}`)({utils,externals,makeSTScope})({parentScope})
        }
    });
    return Object.create(parentScope,locals)
};
export default makeSTScope({}).basicSpices