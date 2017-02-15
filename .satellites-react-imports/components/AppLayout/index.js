import {reducer as headerReducer} from './Header/reducers';
import Header from './Header';
import style from './style.import.scss';

const {
    React:{createClass},
    rubix:{
        Grid,
        Row,
        Col,
        MainContainer,
        Dispatcher
    },
    reactiveRedux:{reactiveConnect},
    reduxImmutable:{combineReducers:combineImmutableReducers}
}=require('imports/externals');

export const reducer=combineImmutableReducers({
    header:headerReducer
});
export default reactiveConnect({
    mapTrackersToProps: (state)=> {
        return {userTracker: state.userTracker}
    },
    mapStateToProps: (state)=> {
        return {
            deleteAccountModalShowState: state.appLayout.getIn(['header', 'show'])
        }
    },
    componentDidMount(){
        window.router=this.props.router;
    },
    ReactType: createClass({
        render() {
            return (
                <div>
                    <Header {...this.props}/>
                    <div  className="myAppBody">
                        <Grid>
                            <Row>
                                <Col xs={12}>
                                    {this.props.children}
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                </div>
            )
        }
    })
})



