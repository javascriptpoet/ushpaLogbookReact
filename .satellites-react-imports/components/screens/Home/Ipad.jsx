import ipadImg from './ipad.png';

const {
    rubix:{
        Row,
        Col,
        Grid,
        Button,
        Image,
        Panel,
        PanelBody,
        PanelContainer,
    },
    reactRouter:{Link},
}=require('imports/externals');

export default ()=>{
    return (
        <section className="ipad text-center">
            <PanelContainer className='wow animated fadeIn'  controls={false}>
                <Panel>
                    <PanelBody>
                        <Grid>
                            <Row>
                                <Col sm={6}>
                                    <h3>A revolutionary way to personalize student progress</h3>
                                    <p>Quickly Identify Students on the Intervention List and Address Their Unique Needs</p>
                                    <Button bsStyle="danger" retainBackground>
                                        <Link to='http://thegreatacademy.org/'>Made by The GREAT Academy</Link>
                                    </Button>
                                </Col>
                                <Col sm={6}>
                                    <Image src={ipadImg} alt="" className="wow animated fadeInRight" data-wow-delay="1s"/>
                                </Col>
                            </Row>
                        </Grid>
                    </PanelBody>
                </Panel>
            </PanelContainer>
        </section>
    )
}

