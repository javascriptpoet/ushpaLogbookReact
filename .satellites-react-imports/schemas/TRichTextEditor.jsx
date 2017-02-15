let RichTextEditor;
if(Meteor.isClient) RichTextEditor=require('imports/components/RichTextEditor');
const {
    T:{createClass},
    t
}=require('imports/externals');

//export default null;
export default createClass ({
  /*  getPropTypes:()=>({
        className:t.String,
    }),*/
    compose: ({className,...otherProps})=>({
        type:t.String,
        options:{
            //does not support ssr
            template:Meteor.isServer?undefined:t.form.Form.templates.textbox.clone({
                // override just the input default implementation (labels, help, error will be preserved)
                renderInput: ({value,onChange}) => {
                    console.log(RichTextEditor);
                    return (
                        <div className={className}>
                            <RichTextEditor
                                {...otherProps}
                                onChange={onChange}
                                value={value}
                            />
                        </div>
                    );
                }
            })
        }
    })
})