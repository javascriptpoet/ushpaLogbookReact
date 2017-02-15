import TProfile from 'imports/tcombTypes/Profile';
import AvatarEditor from 'imports/components/AvatarEditor';

const {
    React:{createClass},
    t:{form:{Form}},
    T:{createElement:createTElement}
}=require('imports/externals');

export default createClass({
    onSubmit(evt) {
        evt.preventDefault();
        const {store}=this.context;
    },
    contextTypes:{
        store:React.PropTypes.shape
    },
    render() {
        const {value,userTracker}=this.props;
        //const user = userTracker.get('user');
        return (
            <form onSubmit={this.onSubmit}>
                <Form
                    {...createTElement(TProfile,{
                        Avatar:AvatarEditor,
                        avatarToSide:true
                    })}
                    ref='form'
                />
                <button type="submit" className="btn btn-primary">Save</button>
            </form>
        )
    }
})
