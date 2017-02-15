import {closeModalAC} from './actionCreators';
import {deleteAccountAC} from 'imports/actions';

const {
    React:{createClass},
    rubix:{
        Grid,
        Row,
        Col,
        Modal,
        Button
    }
}=require('imports/externals');

export default createClass({
    closeModal(){
        const {dispatch}=this.props;
        dispatch(closeModalAC())
    },
    deleteAccount(){
        const {dispatch}=this.props;
        dispatch(deleteAccountAC());
        dispatch(closeModalAC());
    },
    render(){
        const {showState,dispatch}=this.props;
        return (
            <Modal
                show={showState}
                onHide={this.closeModal}
            >
                <Modal.Header bsStyle="danger" closeButton>
                    <Modal.Title>Delete account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure? There is no way back.
                </Modal.Body>
                <Modal.Footer>
                    <Grid>
                        <Row>
                            <Col xs={12} sm={6}>
                                <Button onClick={this.closeModal}>Cancel</Button>
                            </Col>
                            <Col xs={12} sm={6}>
                                <Button onClick={this.deleteAccount}>Delete</Button>
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Footer>
            </Modal>
        )
    }
})