export default ({externals:{
    reactiveRedux:{registerTracker},
    meteor:{Meteor},
    T:{createTClass},
    utils:{myList}
}})=>({reduxKey='pM'})=>Object.create(require('PMComponent')({externals}),{
    /*
     @property pMElement#reduxKey {string}('pM') - the key used for redux state of this instance
     */
    reduxKey,
})



