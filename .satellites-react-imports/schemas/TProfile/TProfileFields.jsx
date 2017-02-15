/*
the point of all this functions flying around is to reuse TTypes from library that are
not aware of local app, but more important, to keep code dry,the common template has to come from higher scope.
So, the missing options are passed by functions from a higher scope. Namely, the issue is
permissions to show for each field. Here, permission definitions are created but only to specify
the structure of their composition - each field in this fieldset will have its own permission under
fieldset namespace in the global permission object. The higher scope will set the actual permission
logic possibly interlinking permission values.
Same for customizing field templates conditioning them with permitions. it is done higher up and passed in in a func
 that is bound to the local object.
 The weird syntax manipulating arrays into objects is to dry up code. I loose track of thought behind details of long winded code.
 If i cant do it with a one-liner, time for another func wrapper till each one is a one liner.
The high goal here is to keep what belongs in one scope inside that scope (or file), not less and not more.
 */
import TFullName from 'imports/schemas/TFullName';
import TNotes from 'imports/schemas/TNotes';
import TRichTextEditor from 'imports/schemas/TRichTextEditor';

const {
    T:{createClass:createTClass,createOptionsFor,createTypeFor},
    t,
    _,
    permissionsManager:{createPermittedFieldType,createClass:createPClass,adminOnlyPermission},
    utils:{myList}
}=require('imports/externals');

const getTProfileFields=({fieldNames,fieldTTypes})=>{
    const buildScope=fieldNames.context({

    }).getValue(({index})=>({
        TPermittedField:createPermittedFieldType(fieldTTypes[index]),

    })).toObject()
    return createClass({
        Permissions:createPClass({
            compose({context:{createFieldPermissions}}) {
                return fieldNames.value(
                    createFieldPermissions(this)
                ).toObject()
            }
        }),
        compose: ({props:fieldTemplate})=>({
            type:t.struct(
                fieldNames.context(
                    fieldTTypes.list
                ).getValue(
                    ({context,listIndex})=>createTypeFor(context[listIndex])
                ).toObject()
            ),
            options:{
                fields:fieldNames.context(
                    fieldTTypes.list
                ).getValue(
                    ({context,listIndex})=>Object.assign(
                        createOptionsFor(context[listIndex]),
                        {template:fieldTemplate.bind(this)}
                    )
                ).toObject(),
            }
        })
    })
};
export default getTProfileFields({
    fieldTTypes: new ArgumentList([TFullName, TRichTextEditor, TNotes, TNotes]),
    fieldNames: new ArgumentList(['fullName','biography','notes','adminNotes' ]),
});

