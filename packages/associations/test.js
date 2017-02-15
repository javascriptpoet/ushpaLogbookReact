/**
 * @module associations.assLink
 * @description
 * module defines an AssLink class that is used to create custom links while building the system at define time.
 * this class and its extended derrivatives are, basically, definitions of types of links encapsulating an unlimited
 * range of behaviours.
 * This structure allows for libraries of custom link types contributed by third parties.
 * a link is just a two collection type system of 'to' and 'from' symbolic names
 */

import {_} from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {MyCollection} from 'meteor/jsPoet:mygadgets'
import {filtr} from 'filtr';
/**
 * @exports AssLink {class}
 * a simple one way connector link
 */


const system=argument[0];
const {colMap}=system;
const {to:toColRealName,from:fromColRealName}=_.invert(colMap);

//create ass collection for this link.
//each link has its own ass collection
system.assCol=system.assCol || MyCollection({
        name:'${fromColRealName}${name}${invColMap[to]}',
        mutatorDef,
        lookupDef
    });

//instantiate 'from' symbol col node and set a link method to 'to' symbol col node
//this, also, istantiate to node.
//the new method of 'from' node will allow to join 'to' and 'from' docs via assCol as index
this.newCol({colName:'from'}).link({
    toColName: 'to',
    name: '${name}${toColRealName}',
    connector: function ({
        /**
         * mongo selector to filter related docs in opposite side col
         */
        where={},
        /**
         * mongo fields specifier for opposite side col
         */
        fields={},
        /**
         * options for finding related docs
         */
        relatedOptions={},
        assMutatorDef,
        assLookupDef
    }) {
        //this is result of previous promise chain member
        //it is an array of docs - the join agregate of records from each traversed relationship
        //each record has just the specified fields from each related col and bredcrums of doc ids
        //back to the origin of the chain. the field names are modified by col name prefix for namespacing.
        //e.g. traversing schools->teachers->students might produce following record in results array:
        //{'schools#id','schools#name','teachers#_id','teachers#name','students#_id','students#name'}

        //create selector for assCol to pick ids of related docs
        const assSel = {
            $and: [
                {'from.colName': fromColRealName},
                {'from.id': {$in: _.map(this, (doc)=>doc['${fromColRealName}#id'])}}
            ]
        };

        //wait for ass records
        return assCol.p_find(assSel).then((assCur)=> {
            //find related docs and merge them into the join aggregate result of the promise chain
            //this is done by recreating the input array of from docs. each doc is iether left alone or replaced with a set
            //of recs, each is the boc extended by docs related to it in 'from' col, if any
            const assDocs = assCur.fetch();

            //build selector to find related docs by the array of ids pullud from assCol
            const relSel = {
                $and: [
                    {_id: {$in: _.map(assDocs, (doc)=>doc.to.id)}},
                    where
                ]
            };

            //find related docs in 'to' col
            Mongo.Collection.get('toColRealName').p_find(relSel).then((relCur)=> {
                //merge them into join by cross referencing related docs against ass docs
                const relDocs = relCur.fetch();

                //if you think the code below is confusing, it was more so writing it. Any improvements are welcome.
                //we building output array of docs
                //for each input doc
                return _.reduce(this, (memo, inputDoc, inputIndex)=> {
                    //find ass records related just to that input doc by its id and col name
                    const inputAssDocs = filtr({
                        'from.id': {$eq: inputDoc._id},
                        'from.colName': {$eq: fromColName}
                    }).test(assDocs);

                    //if orphan, we will let be and back off. no extending or replacing
                    if (!inputAssDocs.length) return memo.push(inputDoc);

                    //replace the old root in the input set with its brood of himself extended by his relatives, one
                    //extended doc for each related doc
                    //so, for each ass record related to the cureent input doc
                    return _.reduce(inputAssDocs, (memo, inputAssDoc)=> {
                        //use to.id to find related doc in the set fished out of 'to' col,
                        const inputRelDoc = filtr({
                            '_id': {$eq: inputAssDoc.to.id}
                        }).test(relDocs)[0];

                        //extend the guilty input doc with the current related doc and push it into the result pit.
                        return memo.push(_.extend(
                            inputDoc,
                            //the last chicken ala reduce in the nest
                            //this one adds suffixex to the keys of the related doc for namecpasing purposes
                            _.reduce(inputRelDoc, (memo, value, key)=> {
                                return _.extend(memo, {'${toColName}#${key}': value})
                            }, {})
                        ));
                    }, memo)
                }, [])
            })
        });
    }
})

export const AssLink=defineSystem({
    //define func is called by the class constructor with itself as arg.
    //the params listed below are what should be supplied to the constructor when instantiating
    define:function({
        /**
         * name of the link.
         * used in naming from-to method
         */
        name,

        /**
         * custom permissions to mutate ass records
         */
        mutatorDef,

        /**
         * custom permissions to lookup ass records
         */
        lookupDef,

        /**
         * ass collection to be used. if not supplied, a new one is created.
         */
        assCol
    }){




        //   })
    } //define
}); //defineSystem

/**
 * @exports AssSymLink {AssSystem}
 * this is a symmetrical link - evry associations is reciprocal,e.g. student is assigned to teacher as well
 * as teacher has this student assigned. a boy loves girl might not be reciprocated that easy.
 * the parameters below are for the constructor and only specific to this class. the base class AssLink takes additional params
 * that can/must be supplied as well
 */
export const AssSymLink=defineSystem({
    baseAssClass: AssLink,
    define: function ({
        /**
         * name of the link.
         * used in naming from-to method
         */
        name,
        /**
         * name of the link in reverse dir.
         * used in naming to-from method
         */
        revName=name,
    }) {
        const system=argument[0];
        const {colMap,assCol}=system;
        const {to:toColRealName,from:fromColRealName}=_.invert(colMap);

        //the base class already built one of our links from 'from' to 'to' node
        //lets build the link of same type in opposite dir
        this.to.link({
            toColName: 'from',
            name: '${revName}${fromColRealName}',
            connector: AssLink,

            //base system assCol is passed so this link does not create anothe one
            //both links are via the same ass col.
            assCol:assCol
        });
    }
})

