export const logoutAC=()=>{
    Meteor.logout();
    return {type:null}
}
