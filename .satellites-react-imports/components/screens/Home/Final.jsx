import screenshotImg from './screenshot.png';
const {
    rubix:{
        Row,
        Col,
        Grid,
        Image,
        Panel,
        PanelBody,
        PanelContainer,
    },
    reactRouter:{Link},
}=require('imports/externals');

export default ()=>(
    <section className="final text-center">
        <PanelContainer className='wow animated fadeIn'  controls={false}>
            <Panel>
                <PanelBody>
                    <Grid>
                        <Row>
                            <Col md={4} className="text-center wow fadeInDown animated"  data-wow-delay="0.8s">
                                <h3>"Works on All Devices and Updates Instantly</h3>
                            </Col>
                            <Col md={8}>
                                <Image src={screenshotImg} responsive className="wow" data-wow-delay="0.6s" alt="picture"/>
                            </Col>
                        </Row>
                    </Grid>
                </PanelBody>
            </Panel>
        </PanelContainer>
    </section>
)
