import React from 'react';
import '../style/CanvasUploadButton.scss';
import api from '../api';

export default class CanvasUploadButton extends React.Component {
    constructor(props){
        super(props);

        this.buttonTexts = {
            default: this.props.defaultButtonText || 'Publish this Image',
            loading: 'Publishing...'
        };
        
        //this binding for React event handlers
        [
            'handlePublishButtonClick'
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    handlePublishButtonClick(e){
        e.target.innerText = this.buttonTexts.loading;
        
        this.props.canvasRef.current.toBlob((blob)=>{
            //toBlob returns a image/png per default, could change with mimeType param but especially with drawn images PNG seems just fine.
            
            const formData = this.props.assembleFormData();
            
            let imageFile = new File([blob], formData.get('name').toString()+'.png', {
                type: 'image/png'
            }); //for whatever reason, the File constructor needs the blob as part of an array and cannot deduce the filetype from the input blob
            formData.append('image', imageFile);
            
            api[this.props.apiFunctionName](formData).then((res)=>{
                if(res.data.success){
                    this.props.uploadSuccessCallback(res.data.id);
                }
                e.target.innerText = this.buttonTexts.default;
            });
        });
    }

    render(){
        return (
            <button type="button" id="publish-btn" onClick={this.handlePublishButtonClick}>{this.buttonTexts.default}</button>
        );
    }
}