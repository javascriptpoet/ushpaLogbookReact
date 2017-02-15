import {_} from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import objectPath from 'object-path';

/**
 * @export promiseTaker {function(...arguments):function({object})}
 * this is a utility function that allows returning promisees within reactive computations akin to template helpers
 * @param args {object}
 *  promiseGiver {promise:function({...})}
 *      a promise returning function e.g. template helper that spits out promisees
 * @param whileWaiting
 */
export const promiseTaker=({
    promiseGiver,
    whileWaiting='...loading',
    onError=({e})=>('error: ${e.message}')
})=>{
    let curValue=typeof whileWaiting==='function'?whileWaiting():whileWaiting;
    return ()=>{
        const curComputation=Tracker.currentComputation;
        const {firstRun}=curComputation;

        //onError func is bound to local arguments, however, if you prefer BTOYO (bring this on youw own),
        //use an error function
        promiseGiver(...arguments).
        then((res)=>{curValue=res}).
        catch((e)=>{
            const res=onError.call({curValue,args:[...arguments]});
            if(res===null) return;
            curValue=res;
        });
        return curValue;
    }
};

/**
 * @exports observePromise {function}
 * when outside a reactive computation,e.g. template helper, use this function to wrap a promise chain to automatically
 * update a  variable with the result of reserved promise. inside, it wraps the promiseGiver func in a promiseTaker
 * blanketed within a reactive comp.
 * but it does not stay under the blanket for ever. you get the handle for the trouble of calling the func. do handle.stop() to
 * stop the computation. if you are inside one of the template life hooks, e.g. onCreate, the func will know it and will
 * do cleanup when template instance is destroyed.
 *   @param args {object}
 *      observe {
 *      specifies a place to put result in when chained promises are resolved.
 *      when this option is specified, the chain will run in a reactive computation and will reactively update
 *      the observable. it will envoke onError, well, on error and use the returned value to update the observable.
 *      no update is done if it returns null.
 *          object {object} - object container of the observable
 *          key {string} - key of the observable in that object
 *      },
 *      onError @see {@link promiseTaker#onError}
 *      on error callback. takes error as parameter and current value of observable as context. whatever it returns, unless null, is returned
 *      as result and used to upate observable
 *   @returns {observePromiseHandle}
 *   an object with #stop() method. if called within template lifecycle callbacks, no cleanup is necessary.
 */
export const observePromise = ({})=> ({
    promiseGiver,
    observe: {
        object:observedObj,
        key:observedKey,
    },
    onError,
    whileWaiting
})=>{
    return (Template.instance() || Tracker).autorun(()=>{
        objectPath.set(observedObj,observedKey,promiseTaker({
            promiseGiver,
            whileWaiting,
            onError
        }))
    })
}