//NOTE: does not support SSR
import RichTextEditor, {createEmptyValue} from 'react-rte';

const {
   React:{createClass,PropTypes}
}=require('imports/externals');
const defaultToolbarConfig = {
    // Optionally specify the groups to display (displayed in the order listed).
    display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
    INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
        {label: 'Italic', style: 'ITALIC'},
        {label: 'Underline', style: 'UNDERLINE'}
    ],
    BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'},
        {label: 'Heading Large', style: 'header-one'},
        {label: 'Heading Medium', style: 'header-two'},
        {label: 'Heading Small', style: 'header-three'}
    ],
    BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
    ]
};
export default createClass({
    propTypes:{
        onChange: PropTypes.func,
    },
    render(){
        let {toolbarConfig,value,...otherProps}=this.props;
        if(!value)value=createEmptyValue();
        console.log(value,createEmptyValue());
        return (
            <RichTextEditor
                {...otherProps} //note: onChange is passed thru props
                toolbarConfig={Object.assign(defaultToolbarConfig,toolbarConfig)}
                value={value}
            />
        );
    }
})