
export const deleteAccountMethod=new ValidatedMethod({
    name:'myDeleteAccount',
    validate:null,
    run:(userId=Meteor.userId())=>{
        if( (userId!==Meteor.userId()) && (Meteor.userId() && !Meteor.user().hasRole('admin')))
            throw new Meteor.Error('PermissionError','You dont have permissions for this action')
        if(Meteor.isServer && Meteor.userId()) Meteor.users.remove({_id: userId})
    }
});