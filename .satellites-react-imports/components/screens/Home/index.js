import style from './style.import.css';
import Intro from './Intro';
import HowItWorks from './HowItWorks';
import Ipad from './Ipad';
import Final from './Final';

const {
    React:{createClass},
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
    reactiveRedux:{reactiveConnect},
    _,
}=require('imports/externals');

export default reactiveConnect({
    mapTrackersToProps:(state)=>{
        return {userTracker:state.userTracker}
    },
    ReactType:createClass({
        componentDidMount(){
            new WOW().init();
            skrollr.init({
                forceHeight: false,
                smoothScrolling: false
            }).refresh()
        },
        render(){
            const user=this.props.userTracker.get('user');
            return (
                <div className={style.layout}>
                    <div className='backgroundImg'/>
                    <Intro user={user}/>
                    <HowItWorks/>
                    <Ipad/>
                    <Final/>
                </div>
            )
        }
    })
});
