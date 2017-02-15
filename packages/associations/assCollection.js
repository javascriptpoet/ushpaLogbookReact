import { Mongo } from 'meteor/mongo';
import {_} from 'meteor/underscore';
import {MyCollection,lookupMethod,mutatorMethod} from 'meteor/jspoet:mygadgets'
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

/*
* ass schema:
* {
*   assName: string,
*   from:{colName:string,id: record id},
*   to:{colName:string,id: record id}
* }
* the ass does not care ... about from and to.
* it is up to you to structure one or two way associations by the way the data is inserted and retreived
* */

export class AssCollection extends MyCollection {
    /**
     * a place to encapsulate a particular relationship.
     * each relationship (between two collection records) is recorded in the underlying ass collection.
     * the ass records are enforced by schema.
     * @param 
     * args {object}
     *  name {string} - ass name.
     *  mutatorDef {object} - params used for all mutator methods. see mutatorMethod.
     *  lookupDef {object}  - params used for all lookup methods. see lookupMethod
     */
    constructor(args){        
        super(args);

        //an ass schema is attached to the collection for validation
        this.attachSchema(new SimpleSchema({
            from: {
                type: Object,
            },
            'from.colName': {
                type: String,
                label:'collection name'
            },
            'from.id': {
                type: String,
                label:'record id'
            },
            to: {
                type: Object,
            },
            'to.colName': {
                type: String,
                label:'collection name'
            },
            'to.id': {
                type: String,
                label:'record id'
            },
        }));

        /**
         * looks up the records in the ass collection that match the args and returns a dictionary
         * of cursors from related collections
         * this is a promise giver func.
         * @param args {object}
         *  relateeRecs {object} - a dictionary of cursors/array of records from each collection of interest
         *      if array is used, records must contain an _id field
         *  where {object} - a dictionary of mongo selectors keyd by collection name to filter returned cursors
         *  relatedFrom {string} 'to' | 'from' - specifies dir of relationship, e.g. 'to' means input selects
         *      from side and related records on the from side are returned. if not supplied, a symmetrical
         *      relationship is assumed where each dir producers same results.
         *
         */
        this.p_getRelated=(args)=> {
            //the reason await is not use is performance.
            const {relatedFromRecs={}, where={}, relatedFrom='from'}=args;
            const relatedTo = (relatedFrom === 'from' ? 'to' : 'from');
            const relatedToIds = {};

            //make selector to pick reords out of ass collection
            //the incoming input is a dictionary of cursors or rec arrays keyed by col name
            const colSelectors = _.map(relatedFromRecs, (colRecs)=> {
                let {colName, recs} = colRecs;
                //records can be a cursor or an array of records
                if (recs instanceof Mongo.Collection.Cursor) recs = recs.fetch();
                const ids = _.map(recs, (rec)=>rec._id);
                return {$and: [{'${relatedTo}.colName': colName}, {'${relatedTo}.id': {$in: ids}}]};
            });

            return this.p_find({$or: colSelectors}).//get ass records
            then((assCur)=> { //find related records
                return assCur.forEach(assDoc=> {
                    //then, process ass records to organize related record ids in a colName keyed dictionary
                    const colName = assDoc[relatedTo].colName;
                    _.defaults(relatedToIds, {colName: colName, ids: []});
                    relatedToIds[colName].ids.push(assDoc[relatedTo].id);
                });
            }).then((relatedToIds)=> {
                /*
                 receives {
                 relatedColName:[idsOfRelatedColName]
                 ...
                 }
                 returns
                 a promise to find all related col recs as {
                 relatedColName:cursor of idsOfRelatedColName
                 ...
                 }
                 */
                return promise.all(_.reduce(relatedToIds, (memo, ids, colName)=> {
                    memo.push(Mongo.Collection.get(colName).p_find({
                        $and: [
                            {_id: {$in: ids}},
                            where ? where[colName] : {}
                        ]
                    }));
                    return memo;
                }, []));
            }).catch((e)=> {
                throw e
            })
        }
    };
};


