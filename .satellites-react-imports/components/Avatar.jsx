import React from 'react';
import t from 'tcomb-form';
import Avatar from 'react-avatar';

const {
    React:{PropTypes,createClass},
}=require('imports/externals');

export default createClass({
    render(){
        const {name='she did',...otherProps}=this.props;
        return (
            <div  className="myAvatar">
                <Avatar
                    {...{
                        name,
                        src:'/imgs/app/avatars/avatar0.png',
                        email:'Bitchy@Snitch.fu',
                        size:40,
                        rounded:true
                    }}
                    {...otherProps}
                />
                <span className="name fg-white">{name}</span>
                <span className="caret"></span>
            </div>

        )
    }
});