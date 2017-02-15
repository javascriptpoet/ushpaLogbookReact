({scope:{}})=>
import {
    AppLayout,
    HomeScreen,
    ProfileScreen
} from 'imports/components';

const {
    reactRedux:{Provider},
    reactRouter:{ IndexRoute, Route },
    stdAccounts:{Accounts,STATES},
    reactRouter:{browserHistory},
}=require('imports/externals');

const go=(path)=>{
    if(Meteor.isClient) browserHistory.push(path)
};

export const Routes= (
    <Route path='/' component={AppLayout}>
        <IndexRoute component={HomeScreen} />
        <Route path="signup" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_UP}/>} />
        <Route path="signin" component={() => <Accounts.ui.LoginForm formState={STATES.SIGN_IN}/>} />
        <Route path="passwordChange" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_CHANGE}/>} />
        <Route path="passwordReset" component={() => <Accounts.ui.LoginForm formState={STATES.PASSWORD_RESET}/>} />
        <Route path="profile" component={ProfileScreen}/>
    </Route>
);