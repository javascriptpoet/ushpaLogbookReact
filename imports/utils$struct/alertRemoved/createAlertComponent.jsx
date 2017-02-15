/*
displays snackbar with the message, controlled by its state in store
 */

import { connect } from 'react-redux';
import React,{PropTypes, Component} from 'react';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import {closeAlertActionCreator} from './actions';
import {eventActionHandler} from 'imports/utils';
import { bindActionCreators } from 'redux';

//TODO: add styling for alert levels
class AlertReactType extends Component {
    render() {
        const { 
            children,
            alertState,
            closeAlertActionCreator,
            ...restProps
        }=this.props;
        const Child=React.cloneElement(React.Children.only(children),{...restProps});
        return (
            <div>
                {Child}
                <Snackbar
                    open={alertState.get('open')}
                    message={alertState.get('alertMsg')}
                    action="Dismiss"
                    autoHideDuration={3000}
                    onRequestClose={(e)=>{
                        e.preventDefault();
                        closeAlertActionCreator()
                    }}
                />
            </div>
        )
    }
};

export const createAlertComponent=({alertStatePath})=>{
    const mapDispatchToProps=(dispatch)=>bindActionCreators({closeAlertActionCreator},dispatch)
    const mapStateToProps=state=>{return {
        alertState:state[alertStatePath]
    }};
    return connect(mapStateToProps,mapDispatchToProps)(AlertReactType)
} 
