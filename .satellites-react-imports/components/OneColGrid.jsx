const {
    rubix: {
        Row,
        Col,
        Grid,
    },
}=require('imports/externals');

export default ({children,...gridProps})=>(
    <Grid {...gridProps}>
        <Row>
            <Col xs={12}>
                {children}
            </Col>
        </Row>
    </Grid>
)