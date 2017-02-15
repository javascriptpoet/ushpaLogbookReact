import TNotes from '/imports/schemas/TNotes';
import TAvatar from '/imports/schemas/TAvatar';
import TProfileFields from './TProfileFields';

const styles=require('./styles.imports.scss');
const {
    t,
    T:{createClass,createElement},
    rubix:{
        Grid,
        Row,
        Col
    }
}=require('imports/externals');
const profileTemplate=({inputs:{avatar, profileFields}})=>{
    const cols={
        avatar:avatarToSide?{xs:12,sm:3}:{xs:12},
        profileFields:avatarToSide?{xs:12,sm:9}:{xs:12}
    }
    return (
        <Grid className={styles.tProfile}>
            <Row>
                <Col {...cols.avatar}>
                    {avatar}
                </Col>
                <Col {...cols.profileFields}>
                    {profileFields}
                </Col>
            </Row>
        </Grid>
    );
};

export default createClass({
    typeName:'profile',
    getPropTypes(){
        return t.struct({
            avatarToSide:t.maybe(t.Boolean),
            className:t.maybe(t.String)
        })
    },
    compose({props:{
        avatarToSide,
        className,
        ...otherProps
    }}){
        return {
            type:t.struct({
                avatar:createElement(TAvatar,otherProps).type,
                profileFields:createElement(TProfileFields).type
            }),
            options:{
                template: profileTemplate,
                fields: {
                    avatar: createElement(TAvatar,{
                        ...this.props,
                        className:'avatar'
                    }).options,
                    profileFields: createElement(TProfileFields,{
                        ...this.props,
                        className:'profileFields'
                    }).options
                }
            }
        }
    }
});

