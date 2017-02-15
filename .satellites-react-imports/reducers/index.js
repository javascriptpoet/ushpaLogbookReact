const {
    redux:{combineReducers}
}=require('imports/externals');

export const rootReducer=combineReducers({
  userIdTracker:require('./userInfo').userIdReducer,
  userTracker:require('./userInfo').userReducer,
  //alert:require('imports/utils/alert').reducer,
  appLayout:require('imports/components/AppLayout').reducer,
});
