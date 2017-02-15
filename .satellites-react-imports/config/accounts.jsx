const {
    reactRouter:{browserHistory},
    stdAccounts:{Accounts},
}=require('imports/externals');

const go=(path)=>()=>{
    if(Meteor.isClient){
        window.history.pushState( {} , 'redirect', path );
    }
};
Meteor.startup(()=>{
    Accounts.config({
        sendVerificationEmail: true,
        forbidClientAccountCreation: false
    });

    Accounts.ui.config({
        passwordSignupFields: 'USERNAME_AND_EMAIL',
        resetPasswordPath: '/resetPassword',
        changePasswordPath: '/changePassword',
        profilePath: '/profile',
        loginPath: '/signin',
        signUpPath: '/signup',
        requireEmailVerification:true,
        minimumPasswordLength: 6,
    });
})
