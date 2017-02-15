
/*
this is a self contained component. It creates its own scope
and keeps everyone in a sandbox and it does not take any
parameters from anyone above but it can, hmmmm
It does not load its own npm deps, but expects to find refs to them in app externals,
then, it also expects to find its utils deps in utils folder. Utils destruct shows what those are
but imports them
and expects them to be there. All deps are collected from
externals and inserted in top scope.jsx Dep checks are possible in future.

 */
import {ComponentSComponent} from './scopeManager';
import externals from './getExternals';

export default ()=>{
    return parentScope._passToLocalModules({externals,fileNames:[
        //connects react component to permission funcs in redux store.
        'connectComponent',

        /*
         @method PM#connectTComponent(params)
         Designed to extend a TComponent to condition display of its form element to permissions in redux store.
         @Parameter params {object}
         {
         }

         */
        'connectTComponent',

        /*
         returns an instance of PMComponent, a permission manager that will manage its heard of permissions
         (the answer is always no) and manage their state in redux store.
         */
        'createPMElement',
        'PMComponent'
    ]})
}

