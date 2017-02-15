import  OneColGrid from 'imports/components/OneColGrid';

const {
    rubix: {
        Row,
        Col,
        Grid,
        Well,
        Button,
        Icon,
        Panel,
        PanelBody,
        PanelHeader,
        PanelContainer,
    },
    reactRouter:{Link},
}=require('imports/externals');

const Header=()=>(
    <OneColGrid className="header">
        <h3>"Philosophy and Goals"</h3>
        <h4>
            "The SATELLITES - RTI case management system is a Level 2 intervention that uses a collaborative process that assesses, plans, implements, coordinates, monitors, and evaluates the options and services required to meet the students' educational needs. It is characterized by advocacy, communication, and resource management and promotes quality and effective interventions and outcomes. SATELLITES - RTI also provides an organized, structured process for providing accountability and for moving students through the educational process. The process is based on five basic principles:",
        </h4>
    </OneColGrid>
);
const Body=()=>(
    <Grid>
        <Row>
            <Col xs={12}>
                <Step iconName="graduation-cap"
                      data-wow-delay="0.6s"
                      iconTitle='Principal 1 - SATELLITES - RTI is a student centered rather than a program centered approach.'
                      iconText='It starts with the student and uses the program processes to help each student achieve his or her goals and to keep all students in compliance with the state mandates and federal laws."
            '
                />
                <Step iconName="check"
                      data-wow-delay="0.8s"
                      iconTitle="Principal 2 - Students are capable of taking more control of their education."
                      iconText="They are capable of solving problems, making decisions, and setting goals. Students should be actively involved in all phases of the process - assessment, planning, problem solving, and finding resources. SATELLITES seeks to have students as active participants and not as passive ones."
                />
                <Step iconName="users"
                      data-wow-delay="1.0s"
                      iconTitle=	"Principal 3 - The SATELLITES - RTI process should be a shared partnership between the student, parents, Case Manager, ancillary and other school staff."
                      iconText=	"PLC (Professional Learning Community) strategies will be used to implement appropriate modifications, accommodations and or interventions. Although each partner brings different skills, experiences and expertise,. they share in the responsibility for producing progress."
                />
                <Step iconName="wrench"
                      data-wow-delay="1.2s"
                      iconTitle="Principal 4 - SATELLITES - RTI focuses on Prevention and Intervention — the goal of the system is to quickly intervene at the first sign of academic trouble."
                      iconText="Through the use of weekly progress reports the Case Manager/Teacher is provided immediate feedback from classroom teachers. The case manager will immediately coordinate a meeting with the student's treatment team/PLC to develop a plan of action to better support the student."

                />
                <Step iconName="database"
                      data-wow-delay="1.4s"
                      iconTitle="Principal 5 - SATELLITES - RTI is truly data driven."
                      iconText="The system primarily focuses on three pieces of data that have been identified as the primary barriers to academic success: academic, behavior, attendance. The quarterly monitoring of this data leads to data driven decision making that includes, but is not limited to the implementation of programs, interventions, IEP modifications, etc."
                />
            </Col>
        </Row>
    </Grid>
);
export default ()=>(
    <section className="howItWorks text-center">
        <PanelContainer className='wow animated fadeIn'  controls={false}>
            <Panel>
                <PanelHeader className='bg-green'>
                    <Header/>
                </PanelHeader>
                <PanelBody>
                    <Body/>
                </PanelBody>
            </Panel>
        </PanelContainer>
    </section>
)
const Step=({iconName,iconTitle,iconText,...wellProps})=>(
    <Well  className='wow animated fadeIn' {...wellProps}>
        <div className="iconbox">
            <Icon bundle='fontello' glyph={iconName} className="fa-3x"/>
        </div>
        <h2 className="icntitle">{iconTitle}</h2>
        <p>{iconText}</p>
    </Well>
);
