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
 */
const t=require('tcomb-form');
const _=require('meteor/underscore')._;
const getUnwrapLocal=({require,wrapperProps})=>({module})=>require(`./${module}`)(wrapperProps);
const externals={_,t,getUnwrapLocal,
    deep: require('deep-get-set'),
    throwError:({msg})=>{throw new Meteor.Error('Scope error',msg)},
};
const utils=require('./utils')({externals});
const {
    //basicTypes are wrappers around tcomb types that expose internals as static props,e.g props and result of a t.func
    basicTypes:{func,struct}
}=utils;
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
//this will be declare('defineWrapperProps',struct({externals,typesScope,utils,createSpecialSpice})
const defineWrapperProps=struct({
    externals:t.Object,
    typesScope:t.Object, //that could broke down to indicate inheritance from parent and it would get object.Create unlished on it
    utils:t.Object, //utils folder from top scope. local utils can be reg modules and appear in scope
    // in timeSpice it can be defined as derrivative of SpiceType#define and composed by spiceTime machinery thru a parametrized func
    //that would be very terse and very descriptive. The whole code base can be gradually shrunk to a few terse descriptive statements
    //thats what the power of spice is all about - clarity in/and style
    createSpecialSpice:t.Function
});
const runTimeWrapperProps=struct({
    elScope:t.Object
});
export default func(
    ({props=struct({})})=>t.Any
)
export default func({
    //the props that define SpiceType of the app plus a few app specific
    props:struct({
        //passed to all modules thru defineTime wrapper
        externals:t.maybe(t.Object),
        //webpack require func of the index file/top scope. all downscope require funcs in each scope are resolved relative
        //to this require using spiceNode#path
        require:t.func(t.String,t.Function), //this can be broken down granular to show what wrappers are expected out of mudules
        define:t.maybe(func({//a func to declare and define types
            //({typesScope,declare})=>undefined
            props:struct({
                typesScope:t.Object,
                declare:t.Function //way too tedious to define types w/o spice powers. this whole mess will be a one liner
            })
        })),
        //for func elements
        //components can be accessed as getValue.defineWrapper.props or getValue.defineWrapper.runTimeWrapper.props
        getValue:t.maybe(func(
            ('defineWrapper',defineWrapperProps)=>('runTimeWrapper',runTimeWrapperProps)=>t.Any))
    }),
    result:t.Object //spiceNode which would be named in typeScope by the time spiceTime is built. e.g. result:createSpiceNode.result
}).of(({
    externals:appExternals,
    require:appRequire,
    define
})=>{
    const getUnwrap=({require,
        wrapperProps={externals,utils,getUnwrap,
            globals:{appExternals,appRequire}
        }
    })=>({module})=>require(`./${module}`)(getWrapperProps({wrapperProps:getWrapperProps({wrapperProps})}));
    const unwrap=getUnwrap({require});

    //dont get fooled. The iternal seed is not a child to anyone but cold eternal darkness indicated by empty parentToChild
    //relationship. we get the seed spiceNode. What type? The basic VanillaSpiceComponent. If thats ok, just invoke its run()
    //method and you are done.
    //if some exotic spice is required from get go, you refine the type with refine(...) method. no type token is needed
    //in module name. it has a name and no one above will be interested to know what else it presumes of itself
    return unwrap({module:'getChildSpiceNode'})({
        parentToChild:{}
    })
})


