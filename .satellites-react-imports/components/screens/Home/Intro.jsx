import OneColGrid from 'imports/components/OneColGrid';
const {
    rubix:{
        Button,
        Panel,
        PanelBody,
        PanelHeader,
        PanelContainer,
    },
    reactRouter:{Link},
}=require('imports/externals');

const Header=()=>(
    <OneColGrid className="header">
        <h1>
            "Student Assistance Team’s Evaluation of Learning & Linkage to Interventions Towards Educational Success"
        </h1>
    </OneColGrid>
);
const Body=({user})=>(
    <OneColGrid>
        <h2 className="hidden-xs">
            More than a typical Student Information System, SATELLITES is a Student <em>Intervention</em> System Designed for Real Results. Fast.
        </h2>
        {user?
            <div/>
            :
            <Button bsStyle="primary">
                <Link to="/login">Get Started</Link>
            </Button>
        }
    </OneColGrid>
);
export default ({user})=>(
    <section className="intro text-center" style={{height:$(window).height()}}>
        <PanelContainer className='wow animated fadeIn'  controls={false}>
            <Panel>
                <PanelHeader className='bg-green'>
                    <Header/>
                </PanelHeader>
                <PanelBody style={{paddingBottom:'30px'}}>
                    <Body/>
                </PanelBody>
            </Panel>
        </PanelContainer>
    </section>
)


