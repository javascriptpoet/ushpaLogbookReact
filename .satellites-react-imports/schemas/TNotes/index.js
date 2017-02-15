import TNote from './TNote';
const {
    T:{createClass,createTypeFor,createOptionsFor},
    t
}=require('imports/externals');

export default createClass({
    getPropTypes(){
        return {
            notesOptions:t.maybe(t.Any),
        }
    },
    compose({options:notesOptions,...otherProps}){
        return {
            type:t.list(createTypeFor(TNote)),
            options:{
                ...notesOptions,
                item:createOptionsFor(TNote,otherProps)
            }
        }
    }
})
