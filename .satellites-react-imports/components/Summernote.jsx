/*
has issues with jquiry and versions. total mess, not ssr ready, breaks mui
 */
import React, { Component } from 'react';
import 'react-summernote/dist/react-summernote.css'; // import styles
const ReactSummernote=Meteor.isClient?require('react-summernote'):null;


class RichTextEditor extends Component {
    onChange(content) {
        console.log('onChange', content);
    }

    render() {
        return (
            <ReactSummernote
                value="Default value"
                options={{
                    lang: 'ru-RU',
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
                }}
                onChange={this.onChange}
            />
        );
    }
}

export default Meteor.isClient?RichTextEditor:null;