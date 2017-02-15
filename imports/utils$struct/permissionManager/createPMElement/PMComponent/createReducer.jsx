//creates and returns reducer to manage the state of this instance of PMComponent
//we putting permission tree full of permission funcs or user overrides in the store.
//no need to send any of these funcs to client by ssr. html will be composed on server and permission tree
//will be reconstructed on client after all js gets loaded.

createReducer=()=>registerTracker({
    trackerFunc: ()=>t.update(this.pElement.defaultPermissions,Meteor.user().permissions || {})
});
