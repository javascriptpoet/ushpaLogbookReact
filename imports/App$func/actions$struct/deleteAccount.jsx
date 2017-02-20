import {alertAC} from 'imports/actions/alert';
import {deleteAccountMethod} from 'imports/config';

export const deleteAccountAC=(user=Meteor.user())=>(dispatch,getState)=> {
    if (!user) {
        dispatch(alertAC({errMsg: 'no user account to delete'}));
        return;
    }
    deleteAccountMethod.call(user._id, (err, res)=> {
        if (err)
            dispatch(alertAC({errMsg: err.message}))
        else
            dispatch(alertAC({infoMsg: `User account for ${user.username} was deleted`}))
    })
}

