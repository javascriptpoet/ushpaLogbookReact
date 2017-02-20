
module.exports=require('./file1')({createScreenScope})

export  default ({createScreenScope})=>createScreenScope()

export default ({createFuncScope,myType,
    externals:{
        React:{ Component },
        reactRedux:{Provider},
        redux:{
            applyMiddleware,
            createStore,
            compose
        },
        reduxThunk:thunk,
        ReactRouterSSR,
    },
    utils:{types:{clockedFunc}}
})=>createFuncScope({
    declareLocals:({declareFunc})=>{
        declareFunc({name:'reducerInitState'})
    },
    initValue:myType.define(clockedFunc({
        ticks:['reducer','component'],
        reducer:({types:{screen1,screen2}})=>({screen1,screen2}),
        component:({types:{screen1,screen2}})=>compose({screen1,screen2})
    })).of(clockedFunc({
        reducer:({scope:{screen1,screen2}})=>combineReducers({screen1,screen2})
    })),


    define:({types:{reducer,screen1,screen2,Person,dog,cat},struct,tClass})=>{
        Person.refine(tClass({
            instanceProps:dog.extended,
            constructorProps:t.struct(),
            inheritsFromTClass:dog,
            methods:t.sruct({
                petCat:dog.methods.petDog
            })
        }));
        dog.refine
    }

});