export default ({utils,unwrap,externals:{
    reactRouter:{browserHistory},
    stdAccounts:{Accounts}
}})=>()=>Meteor.startup(()=>{
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





