const {
    React:{Component},
    ReactDOM,
    classNames,
    reactRouter:{ Link, withRouter },
    l20n:{
        Entity
    },
    rubix:{
        Row,
        Col,
        Grid,
    }
}=require('imports/externals');

export default class Footer extends Component {
  state = {
    version: 0
  };

  componentDidMount() {
    this.setState({
      version: document.body.getAttribute('data-version')
    });
  }

  render() {
    var year = new Date().getFullYear();
    return (
      <div id='footer-container'>
        <Grid id='footer' className='text-center'>
          <Row>
            <Col xs={12}>
              <div>© {year} SketchPixy Creative - v{this.state.version}</div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
