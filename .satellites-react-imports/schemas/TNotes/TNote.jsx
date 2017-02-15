import TRichTextEditor from 'imports/schemas/TRichTextEditor';

const {
    T:{createClass,createOptionsFor,createTypeFor},
    t
}=require('imports/externals');

export default createClass ({
    compose: ({editorProps})=> ({
        type:createTypeFor(TRichTextEditor),
        options:createOptionsFor(TRichTextEditor,editorProps),
    })
})