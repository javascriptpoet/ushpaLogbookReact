const {
    reactiveRedux:{registerTracker}
}=require('imports/externals');

export const userIdReducer=registerTracker({
    trackerFunc:()=>{
        return {
            userId:Meteor.userId()
        }
    }
});
export const userReducer=registerTracker({
    trackerFunc:()=>{
        return {
            user:Meteor.user()
        }
    }
});