import ReactSummernote from 'imports/components/Summernote';
//import 'react-summernote/dist/react-summernote.css'; // import styles

const {
    T:{createClass},
    t
}=require('imports/externals');

//export default null;
export default createClass ({
    compose: ({props:{summernoteOptions={},className}})=>({
        type:t.String,
        options:{
            //unfortunately, react-summernote does not support ssr
            template:Meteor.isServer?undefined:t.form.Form.templates.textbox.clone({
                // override just the input default implementation (labels, help, error will be preserved)
                renderInput: ({value,onChange}) => {
                    onsole.log(ReactSummernote);
                    return (
                        <div className={className}>
                            <ReactSummernote
                                value={value}
                                options={Object.assign({
                                    height: 350,
                                    dialogsInBody: true,
                                    toolbar: [
                                        ['style', ['style']],
                                        ['font', ['bold', 'underline', 'clear']],
                                        ['fontname', ['fontname']],
                                        ['para', ['ul', 'ol', 'paragraph']],
                                        ['table', ['table']],
                                        ['insert', ['link', 'picture', 'video']],
                                        ['view', ['fullscreen', 'codeview']]
                                    ]
                                },summernoteOptions)}
                                onChange={onChange}
                            />
                        </div>
                    );
                }
            })
        }
    })
})