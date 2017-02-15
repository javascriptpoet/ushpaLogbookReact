import AvatarEditor from 'react-avatar-editor';

const {
    React:{createClass,createElement,PropTypes},
}=require('imports/externals');

export default createClass({
    propTypes:{
        onChange:PropTypes.function
    },
    getInitialState(){
        return {}
    },
    onImageChange(){
        this.props.onChange(this.refs.editor.getImage())
    },
    onFileLoad(evt){
        const reader = new FileReader();
        reader.onload = (evt)=>{
            this.setState({fileURL:evt.target.result})
        };
        reader.readAsDataURL(evt.target.files[0]);
    },
    render(){
        const {onChange,...otherProps}=this.props;
        return (
            <div>
                <AvatarEditor
                    width={250}
                    height={250}
                    border={50}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={2}
                    {...otherProps}
                    image={this.state.fileURL}
                    onImageChange={this.onImageChange}
                    ref='editor'
                />
                <input type='file' onChange={this.onFileLoad}/>
            </div>
        )
    }
});