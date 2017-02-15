//this file defines all errors generated by this package
import {Meteor} from 'meteor/meteor' 

export const assErrors={
    missingRealCol:({symbolColName})=>new Meteor.Error(
        'AssSystemErr',
        'you seem to miss mapping symbol col ${symbolColName} to real col'
    ),
    connectorExists:({connectorName,realColName,symbolColName})=>new Meteor.Error(
        'AssSystemErr',
        'attempt to redefine link $(connectorName) from col ${realColName}(symbol:${symbolColName})'
    )
};