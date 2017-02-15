export default ()=>(path)=>()=>{
    if(Meteor.isClient){
        window.history.pushState( {} , 'redirect', path );
    }
};