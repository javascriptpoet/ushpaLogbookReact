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
const t=require('tcomb-form');
const _=require('meteor/underscore')._;
const getUnwrapLocal=({require,wrapperProps})=>({module})=>require(`./${module}`)(wrapperProps);
const externals={_,t,getUnwrapLocal,
    deep: require('deep-get-set'),
    throwError:({msg})=>{throw new Meteor.Error('Scope error',msg)},
};
const utils=require('./utils')({externals});
const {types:{clockedFunc,func,struct}}=utils;
const localModules=require('./localModules')({externals,utils});

/*you are witnessing birth of universe. from now on it will expand in spice and time building all its particles (funcs and vals)
and organizing them in space of spice
first, came one lonely seed, the first top scope spiceNode, smallest granule of spiceTime.
each represents a function scope/spice structure existing in each moment of its history. It simply holds a dict of funcs
that define its type and value in each slice of time.
It came to be and defined itself by this defineApp func.
once the seed is built, we sprout it. (run the app).

NOTE:this will be repeated for each module downscope.
all the typing will be much more descriptive in timeSpice and there will be an option
to ban all type defs to a separate module in each scope which be a receipe to instantiate app boilerplate programmatically
from a tree structure of funcs. The receipe can be created by guy thru some nice visualization tool and a few one liners filled
in in gui editor or into files of boilerplate by webstorm, or by a script run by webstorm. Just a few scripts and we can
insert all kinds of stuff into the app with a few console commands like spiceTime createCrazySpice 'name:....'. a simple
gui with a few forms be a lot nicer. too much typing. After a while we can consolidate all the scripts into a nice ui
and let community have its way with it.
Type info can be used to actually create js code. e.g.if elScope is specified as extension of parent, thats what it will do
before serving it to func. So is any data flow connection. That would be advanced (not too hard) feature but it could reduce work
and bugs tremendously. my goal is three lines per app. always been from day one. that was the promise of meteor. they did great but
 need a bit of help. we are close.
 */

//an app might be blind up scope but it still wants to contribute its export to the callee like any other element.
//we have to chain cos chrome does weird things with order of keys in an object. We need to fix the sequence.
//the other way is to have an array of tick names and a dict of tick funcs. Thats just too verbose and off the subject.
//the func below is single tick ticker. it is still ticked func but it creates just one tick using old school syntax.
export default {
    types:utils.types,
    VanillaSpice:func({
        globals:struct({
            externals:t.Object,
            require:t.Function
        }),
        defaultProps:{
            externals:{}
        },
        result:tClass
    }).of((globals)=>{
        const getUnwrap=({require,
            wrapperProps={externals,utils,getUnwrap,globals}
        })=>({module})=>require(`./${module}`)(wrapperProps);
        const unwrap=getUnwrap({require});

        /*we are binding all spice nodes in the app to app globals on first tick
        then, we are binding to parent node but here there is no one above
        parent to child wrapper has a result of {class,getInstance} clas is VanillaSpice and getInstance gets an instance
        of VanillaSpice
        the next step is a func that instantiate instance of vanilla spice bound to app globals and parent
        the receiver can refine this base spice into any exotic by SpiceType#refine
         */
        return unwrap({module:'vanillaSpice'})()({globals})({parentToChild:{}}).VanillaSpice
    })
}
