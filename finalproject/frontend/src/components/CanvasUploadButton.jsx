import React from 'react';
import '../style/CanvasUploadButton.scss';
import api from '../api';
import imageCompression from 'browser-image-compression';

/**
 * Button to upload created meme in canvas
 */
export default class CanvasUploadButton extends React.Component {
    constructor(props){
        super(props);

        this.buttonTexts = {
            default: this.props.defaultButtonText || 'Publish this Image',
            loading: 'Publishing...'
        };

        this.state = {
            fileSizeValue: 5000
        };
        
        //this binding for React event handlers
        [
            'handlePublishButtonClick',
            'handleFileSizeChange',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    /**
     * handling for publish button
     * @param {event} e 
     */
    handlePublishButtonClick(e){
        this.props.canvasRef.current.toBlob((blob)=>{
            //toBlob returns a image/png per default, could change with mimeType param but especially with drawn images PNG seems just fine.
            
            const formData = this.props.assembleFormData();
            if(!formData) return;
            
            let imageFile = new File([blob], formData.get('name').toString()+'.png', {
                type: 'image/png'
            }); //for whatever reason, the File constructor needs the blob as part of an array and cannot deduce the filetype from the input blob
            imageCompression(imageFile, {maxSizeMB: this.state.fileSizeValue/1000}).then((result)=>{
                //the browser-image-compression package returns a Blob, so let's wrap it back into a file
                let newFile = new File([result], formData.get('name').toString()+'.png', {
                    type: 'image/png'
                });
                formData.append('image', newFile);
            }).catch((err)=>{
                console.log('Failed to compress file: ',err);
                formData.append('image', imageFile);
            }).finally(()=>{
                e.target.innerText = this.buttonTexts.loading;
                api[this.props.apiFunctionName](formData).then((res)=>{
                    if(res.data.success){
                        this.props.uploadSuccessCallback(res.data.id);
                    }
                }).catch(err =>{
                    console.log('Failed to send Upload Meme: ',err);
                }).finally(()=>{
                    e.target.innerText = this.buttonTexts.default;
                });
            });
        });
    }

    /**
     * handles change of file size
     * @param {Event} e 
     */
    handleFileSizeChange(e){
        let val = e.target.value;
        this.setState({fileSizeValue: val});
    }

    render(){
        return (
            <div className="canvas-publish-wrapper">
                <label>
                    Maximum output file size for publishing:
                    <input className="filesize-input" type="range" min="10" max="10000" value={this.state.fileSizeValue} onInput={this.handleFileSizeChange} />
                    <span className="filesize-label">{this.state.fileSizeValue}</span> KB
                </label>
                <button type="button" className="canvas-publish-btn" onClick={this.handlePublishButtonClick}>{this.buttonTexts.default}</button>
            </div>
        );
    }
}