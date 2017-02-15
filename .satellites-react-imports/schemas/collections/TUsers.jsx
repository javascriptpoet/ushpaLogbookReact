import TProfile,{PType as PProfile} from 'imports/schemas/TProfile';

const {
    T:{createClass,createTypeFor,createOptionsFor},
    t,
    _
}=require('imports/externals');


export default createClass({
    compose(){
        const seedType=t.struct({
            profile:createTypeFor(TProfile),
            selectUserType:t.enum(_.keys(actorFields))
        });
        const actorTypes= {
            teacher: seedType.extend({
                subject: t.enums(subjects)
            }),
            admin: seedType,
            student: seedType
        };
        const tElement={
            type:t.union(..._.values(actorTypes)),
            options:{
                items:[
                    {label:'teacher'},
                    {label:'admin'},
                    {label:'student'}
                ]
            }
        }
        tElement.type.dispatch = value => actorTypes[value.type]
        return tElement;
    }
});
export const PType=PProfile;