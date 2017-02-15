/**
 * @module associations.assLink
 * @description
 * module defines a number of builtin link classes
 * they are organized in a namespacing struct to keep the names sane
 * these classes can be used to create predefined link systems with a range of behaviours allowing third party contributions
 * a link is just a two collection type system of 'to' and 'from' symbolic names
 */

import {_} from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
import {defineAssSystem} from './assSystem.js';
import {filtr} from 'filtr';

/**
 * @exports Link {object}
 * a structure namespacing all builtin link classes
 */
export const Links={
    /**
     * @property sym {object}
     * a family of symmetrical links: relationships are reciprocal from both sides
     */
    sym:new class {
        constructor(){
            const self=this;
            
            /**
             * @property oneSided
             * link class defining a symmetrical relationship with connectors installed only to from node
             * both accessor and mutator connectors are installed
             * accessor method allows joining from and to col
             * mutator connectors allow adding and removing associations between collections
             */
            this.oneSided=defineAssSystem({
                //define func is called by the class constructor with itself as arg.
                //the params listed below are what should be supplied to the constructor when instantiating
                define: function ({
                    /**
                     * names of the stubs poking from 'from' node
                     */
                    connectorNames:{
                        query:queryName='',
                        add:addName='add',
                        remove:removeName='remove'
                    },

                    /**
                     * custom permissions for ass records
                     */
                    assPermissions,

                    /**
                     * ass collection to be used. if not supplied, a new one is created.
                     */
                    assCol
                }) {
                    const system = argument[0];
                    const {colMap}=system;
                    const {to:toColRealName, from:fromColRealName}=_.invert(colMap);


                    //a func called from either add or remove link connector with context of connector func -
                    //prev result of promise chain
                    function mutateAss({
                        //indicates add or remove
                        mutatorName,
                        where={},
                    }) {
                        //we will find any redords in the join result passed to us from the prev promise chain
                        //that been touched by the from collection and dump from col ids into an array.
                        //these will be the docs being associated/removed from the 'from' side
                        const ids = {
                            from: _.map(this, doc=>doc['${fromColRealName}#_id'])
                        };
                        const realColName = {
                            from: fromColRealName,
                            to: toColRealName
                        };

                        //now, we will wait for the related docs from the 'to' col selected by where selector
                        const relSel = (typeof where === 'object') ? where : {_id: {$in: Array.of(where)}}; //if not object, a list of ids
                        Mongo.Collection.get('toColRealName').p_find(relSel).then((relCur)=> {
                            //got related docs and got from ids.
                            //generate list of related ids
                            ids.to = relCur.map(doc=>doc._id);

                            //this func will upsert ass docs in the ass col either in forward or reverse dir.
                            //every from id will be related to all to ids
                            //NOTE: this is a symmetrical link, so, each association is reciprocated in opposite dir -
                            //recorded by two docs
                            const mutateOneSide = ({toSide, fromSide})=> {
                                //each from doc will be associated with each to doc and vis a vis
                                _.each(ids[fromSide], fromId=> {
                                    //got one of from ids.
                                    _.each(ids[toSide], toId=> {
                                        //got one of to ids
                                        const selMod = {
                                            from: {
                                                colName: realColName[fromSide],
                                                id: fromId
                                            },
                                            to: {
                                                colName: realColName[toSide],
                                                id: toId
                                            },
                                        };
                                        //record/remove relationship before ids ran off
                                        assCol[mutatorName](
                                            selMod,
                                            (mutatorName === 'upsert') ? selMod : undefined
                                        );
                                    })
                                })
                            };

                            //time to record some friendships in the ass col.
                            //all good symmetrical relationships should reciprocate
                            mutateOneSide({
                                toSide: 'to',
                                fromSide: 'from'
                            });
                            mutateOneSide({
                                toSide: 'from',
                                fromSide: 'to'
                            });

                            //return to the next promise chain member what we got from the prev one
                            return this;
                        })
                    };

                    //create ass collection for this link.
                    //each link has its own ass collection
                    system.assCol = system.assCol || MyCollection({
                        name: '${fromColRealName}${queryName}${toColRealName}',
                        assPermissions
                    });

                    //TODO move join generating code to assCollection into a method
                    //instantiate 'from' symbolic col node and install a link to 'to' symbolic col node
                    //this link will define a number method stubs on just from node
                    //these stubs will allow to to join to collection with from collection thru an index collection
                    //and modify recorded associations in the index collection
                    this.newCol({colName: 'from'}).link({
                        toColName: 'to',
                        info:{assCol},
                        name: '${queryName}${toColRealName}',
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

                                        //if orphan, we will let it be and back off. no extending or replacing
                                        if (!inputAssDocs.length) return memo.push(inputDoc);

                                        //replace the old root in the input set with its brood of himself extended by his relatives, one
                                        //extended doc for each related doc
                                        //so, for each ass record related to the current input doc
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
                    });


                    //install mutator links from 'from' side
                    //each mutator mutates symmetrically - same op in both directions
                    //each mutator returns the same join agregate it received from the promise chain
                    _.each(
                        [
                            {
                                linkName: addName,
                                mutatorName: 'upsert'
                            },
                            {
                                linkName: removeName,
                                mutatorName:'remove'
                            }
                        ],
                        ({linkName, mutatorName})=> {
                            this.from.link({
                                toColName: 'to',
                                info:{assCol},
                                name: '${linkName}${name}${toColRealName}',
                                connector: function ({
                                    /**
                                     * {object} || {docId}
                                     * mongo selector to selected docs in opposite side col to relate to
                                     */
                                    where={},
                                }) {
                                    return mutateAss.call(this, {mutatorName: mutatorName, where})
                                }
                            });
                        }
                    );
                }
            });
            const connectorNamesDef={
                query:'',
                add:'add',
                remove:'remove'
            };
            
            /**
             * @property twoSided
             * link class defining a symmetrical relationship with connectors installed to both nodes
             * connectors are as for oneSided link
             */
            this.twoSided=defineAssSystem({
                define: function ({
                    /**
                     * names of stubs that stick both sides, bind reverse and forward ones
                     */
                    connectorNames:{
                        fromTo:fromToNames=connectorNamesDef,
                        toFrom=connectorNamesDef,
                    }={
                        fromTo:connectorNamesDef,
                        toFrom:connectorNamesDef,
                    },
                    colMap,
                    assCol
                }) {
                    const {to:toColRealName,from:fromColRealName}=_.invert(colMap);

                    //we will build a system of two symmetrical one sided links -
                    //one fromTo link and another toFrom link in opposite direction
                    //that will install a complete set of stubs in to and from nodes but each stub can
                    //have its own custom name
                    //both links are on the same assCol
                    this.from.link({
                        toColName: 'to',
                        connectorNames: connectorNames.fromTo,
                        connector: self.oneSided,
                        assCol
                    });
                    
                    //to make sure both links are on the same assCol, we'll extract assCol of the previous link
                    //and pass it to the next one
                    this.to.link({
                        toColName: 'from',
                        connectorNames: connectorNames.toFrom,
                        connector: self.oneSided,
                        assCol:this.from.linksInfo['${fromToNames.query}${toColRealName}'].assCol
                    });
                }
            });
        }
    }
}


