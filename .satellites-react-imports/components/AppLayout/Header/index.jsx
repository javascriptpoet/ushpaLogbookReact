import {
    logoutAC,
} from 'imports/actions';
import {
    openModalAC,
} from './actionCreators';
import DeleteAccountModal from './DeleteAccountModal';
import MyAvatar from 'imports/components/Avatar';
export * from './reducers';
export * from './actionCreators';

const {
    React:{createClass},
    ReactDOM,
    classNames,
    reactRouter:{ Link, withRouter },
    l20n:{
        Entity
    },
    rubix:{
        Label,
        SidebarBtn,
        NavDropdown,
        NavDropdownHover,
        Navbar,
        Nav,
        NavItem,
        MenuItem,
        Badge,
        Button,
        Icon,
        Grid,
        Row,
        Radio,
        Col
    }
}=require('imports/externals');

const Brand=(props)=>(
    <Navbar.Header>
        <Navbar.Brand tabIndex='-1'>
            <a href='/'>
                <span className='myBrand'>S.A.T.E.L.L.I.T.E.S.</span>
            </a>
        </Navbar.Brand>
    </Navbar.Header>
);
export default createClass({
    handleAccounts(selectedKey){
        const {dispatch,router}=this.props;
        switch (selectedKey){
            case 'profile':
                break;
            case 'logout':
                dispatch(logoutAC());
                break;
            case 'deleteAccount':
                dispatch(openModalAC());
                break;
            case 'login':
                router.push('/signin');
                break;
        }
    },
    render(){
        const {isSidebar,userTracker,deleteAccountModalShowState,dispatch}=this.props;
        const user=userTracker.get('user');
        return (
            <div className="myAppNavbar">
                <DeleteAccountModal showState={deleteAccountModalShowState} dispatch={dispatch}/>
                <Grid id='navbar' {...this.props}>
                    <Row>
                        <Col xs={12}>
                            <Navbar className='myRubixNavHeader' fixedTop fluid id='rubix-nav-header'>
                                <Row>
                                    <Col xs={2}>
                                        <SidebarBtn />
                                    </Col>
                                    <Col xs={6}>
                                        <Brand />
                                    </Col>
                                    <Col xs={4} collapseRight className='text-right'>
                                        <Nav onSelect={this.handleAccounts} activeKey='accounts'  pullRight>
                                            {
                                                !!user
                                                    &&
                                                <NavDropdownHover title={<MyAvatar user={user}/>} >
                                                    <MenuItem eventKey="profile">Profile</MenuItem>
                                                    <MenuItem eventKey="logout">Logout</MenuItem>
                                                    <MenuItem eventKey="deleteAccount">Delete account</MenuItem>
                                                </NavDropdownHover>
                                            }
                                            <NavItem className='logout' eventKey={user?"logout":'login'}>
                                                <Icon bundle='fontello' glyph={user?'logout-1':'login-1'} />
                                            </NavItem>
                                        </Nav>
                                    </Col>
                                </Row>
                            </Navbar>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
})


