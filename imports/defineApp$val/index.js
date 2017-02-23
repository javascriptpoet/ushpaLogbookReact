/* this is the law giver function.
the bootstrap func to use in top scope index of each app.
it will be placed in the parent folder holding all apps or imported as npm package for a single app

Heres the landscape of spiceTime.
The spice space is build as network of spiceNodes, each an instance of its SpiceComponent. SpiceComponents have names,e.g 'screen',
or 'form'. once a scope/folder is defined as 'screen' by $screen token in its name, all its inhabitants downscope
are locked into that type of spice and no other mention of that is necessary, tho does not hurt a single $val or $func.
That is until an evil alien specifies another type of spice and new game begins with its own syntax performing completey
dif function but essential for its parent.
No boilerplate allowed. All that boring stuff is encapsulated into spice and served as syntactic source or just plain does it for you.
SpiceComponents are no special deal or some kinda globals. There is no god in that universe, sorry. Its an anarchy. So,
if you need to spice with a dif tune, simply come up with a funny name and stick it into module name, e.g. bigBrain$crazy
and you just created the most beuatiful artifical mind that likes to discuss the power of spice with you.
Then, you define the new SpiceComponent inside that module before proceding to the task - in define time wrapper.
The spiceNode of this module is instance of CrazySpiceComponent and all index files downscope will be unwrapped with
defineCrazySpice function. Thats what builds local crazy spice space. If module defies the suggestion, he throws. Thats
type locking, right there on the spot w/o mile long traces to track.
As any property of spice space, SpiceComponents are contained in scopes per js standard - typeScope. theres a type for each
element (el) elScope.
These types are very granular and dont have to be defined completeley or in one place or at all. But, its not a bad idea to
have a file or place in the index file where complete functionality of scope (function) is described in plain javascript.
Nice to design in a single script again. Filling in a few one liners is a spice breeze after that. As a bonus you get type
checking, type interlocking, place to keep default values for all props. And, my faved, complete description of all the props
so im free to be as terse in my code as spice allows me. Note that all the data flow is completely exposed by typing.
Its complete documentation spoken in javascript. And that, after the initial introduction is made thru file names and
structure itself.
All types are composed from other types in typeScope and refined in place.
 */
const t=require('tcomb-form');
const _=require('meteor/underscore')._;
const getUnwrapLocal=({require,wrapperProps})=>({module})=>require(`./${module}`)(wrapperProps);
const externals={_,t,getUnwrapLocal,
    deep: require('deep-get-set'),
    throwError:({msg})=>{throw new Meteor.Error('Scope error',msg)},
};
const utils=require('./utils')({externals});
const localModules=require('./localModules')({externals,utils});
const getUnwrap=({require,
    getWrapperProps=(props)=>props
})=>({module})=>require(`./${module}`)(getWrapperProps({wrapperProps:getWrapperProps({wrapperProps})}));

/*you are witnessing birth of universe. from now on it will expand in spice and time building all its particles (funcs and vals)
and organizing them in space of spice
first, came one lonely seed, the first top scope spiceNode, smallest granule of spiceTime.
each represents a function scope/spice structure existing in each moment of its history. It simply holds a dict of funcs
that define its type and value in each slice of time.
It came to be and defined itself by this defineApp func.
once the seed is built, we sprout it. (run the app).

NOTE:this will be repeated for each module downscope.

 */
export default ({externals:appExternals,require:appRequire})=>{
    const getUnwrap=({require,
        wrapperProps={externals,utils,getUnwrap,
            globals:{appExternals,appRequire}
        }
    })=>({module})=>require(`./${module}`)(getWrapperProps({wrapperProps:getWrapperProps({wrapperProps})}));
    const unwrap=getUnwrap({require});

    //dont get fooled. The iternal seed is not a child to anyone but cold eternal darkness indicated by empty parentToChild
    //relationship
    return unwrap({module:'getChildSpiceNode'})({
        parentToChild:{}
    })
}

