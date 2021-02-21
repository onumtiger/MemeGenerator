import React, { createRef } from 'react';
import '../style/UploadTemplate.scss';
import api from '../api';

export default class UploadTemplate extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showPreviewImage: false,
            previewImageSrc: null
        }

        this.uploadImageAsURL = false;
        this.uploadImageFile = null;
        this.uploadImageURL = "";
        
        this.publishButtonTexts = {
            default: 'Publish and Use this Image',
            loading: 'Publishing...'
        };
        this.uploadFileURLButtonTexts = {
            default: 'Fetch this Image',
            loading: 'Fetching...'
        };
        this.uploadSnapshotURLButtonTexts = {
            default: 'Snapshot this Webpage',
            loading: 'Getting a good shot...'
        };

        //this binding for React event handlers
        [
            'handlePublishButtonClick',
            'handleLocalFileAddedViaButton',
            'handleDropZoneDrop',
            'handleDropZoneDragLeave',
            'handleDropZoneDragOver',
            'handleDropZoneDragEnter',
            'handleUploadFileURLButtonClick',
            'handleUploadSnapshotURLButtonClick'
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    handlePublishButtonClick(e){
        e.target.innerText = this.publishButtonTexts.loading;
        
        const formData = new FormData();

        let enteredTitle = document.querySelector('#upload-template-table #in-title').value;
        formData.append('name', enteredTitle || 'Uploaded image');
        formData.append('userID', 0); //TODO get current userID
        formData.append('visibility', 2); //TODO get visibility options from API, display as radiobuttons with numbers as value (public as default), send chosen value here
        
        if(this.uploadImageAsURL){
            formData.append('imageURL', this.uploadImageURL);
        }else{
            formData.append('image', this.uploadImageFile);
        }
        
        api.insertTemplate(formData).then((res)=>{
            if(res.data.success){
                this.props.handlePublishing(res.data.id);
            }
            e.target.innerText = this.publishButtonTexts.default;
        });
    }

    handleLocalFileAddedViaButton(e){
        if (e.target.files && e.target.files[0]) {
            let imgFile = e.target.files[0];
            this.processLocalFileInput(imgFile);
        }
    }

    setDropZoneHighlighting(toHighlight){
        let elem = document.querySelector('#upload-template-table .dropzone');
        
        if(toHighlight){
            elem.classList.add('dragentered');
        }else{
            elem.classList.remove('dragentered');
        }
    }

    handleDropZoneDragEnter(e){
        e.preventDefault();
        e.stopPropagation();
        this.setDropZoneHighlighting(true);
    }

    handleDropZoneDragOver(e){
        e.preventDefault();
        e.stopPropagation();
        this.setDropZoneHighlighting(true);
    }
    
    handleDropZoneDragLeave(e){
        e.preventDefault();
        e.stopPropagation();
        this.setDropZoneHighlighting(false);
    }

    handleDropZoneDrop(e){
        e.preventDefault();
        e.stopPropagation();
        this.setDropZoneHighlighting(false);

        let dataTransfer = e.nativeEvent.dataTransfer;
        if(dataTransfer && dataTransfer.files && dataTransfer.files[0]){
            let imgFile = e.nativeEvent.dataTransfer.files[0];
            this.processLocalFileInput(imgFile);
        }
    }

    processLocalFileInput(imgFile){
        this.uploadImageAsURL = false;
        this.uploadImageFile = imgFile;

        this.setState({
            showPreviewImage: true,
            previewImageSrc: URL.createObjectURL(imgFile)
        });
    }

    handleUploadFileURLButtonClick(e){
        let urlInput = document.querySelector('#upload-template-table #input-fileURL');
        //TODO validation
        e.target.innerText = this.uploadFileURLButtonTexts.loading;
        api.fetchWebImage({url: urlInput}).then((res)=>{
            if(res.data.success){
                this.uploadImageURL = res.data.url;
                this.uploadImageAsURL = true;
                this.setState({previewImageSrc: res.data.url});
            }
            e.target.innerText = this.uploadFileURLButtonTexts.default;
        });
    }

    handleUploadSnapshotURLButtonClick(e){
        let urlInput = document.querySelector('#upload-template-table #input-snapshotURL');
        //TODO validation
        e.target.innerText = this.uploadSnapshotURLButtonTexts.loading;
        api.fetchWebSnapshot({url: urlInput}).then((res)=>{
            if(res.data.success){
                this.uploadImageURL = res.data.url;
                this.uploadImageAsURL = true;
                this.setState({previewImageSrc: res.data.url});
            }
            e.target.innerText = this.uploadSnapshotURLButtonTexts.default;
        });
    }

    render(){
        return (
            <>
                <table id="upload-template-table">
                    <tbody>
                        <tr>
                            <td id="col-source">
                                <fieldset>
                                    <legend>Upload your own image</legend>
                                    <div className="dropzone"
                                    onDragEnter={this.handleDropZoneDragEnter}
                                    onDragOver={this.handleDropZoneDragOver}
                                    onDragLeave={this.handleDropZoneDragLeave}
                                    onDrop={this.handleDropZoneDrop}>
                                        <input type="file" accept="image/*" onChange={this.handleLocalFileAddedViaButton} id="input-file" />
				                        <label id="input-file-label" htmlFor="input-file">Click to select a local image...</label>
                                        <p>...or just drag and drop an image file here!</p>
                                    </div>
                                </fieldset>
                                <hr />
                                <fieldset>
                                    <legend>Upload an image from the web</legend>
                                    <input type="url" id="input-fileURL" placeholder="Enter a valid URL to an image on the web..." />
                                    <button type="button" id="input-fileURL-confirm" onClick={this.handleUploadFileURLButtonClick}>{this.uploadFileURLButtonTexts.default}</button>
                                </fieldset>
                                <hr />
                                <fieldset>
                                    <legend>Upload a screenshot of a webpage</legend>
                                    <input type="url" id="input-snapshotURL" placeholder="Enter a valid URL of a webpage to snapshot..." />
                                    <button type="button" id="input-snapshotURL-confirm" onClick={this.handleUploadSnapshotURLButtonClick}>{this.uploadSnapshotURLButtonTexts.default}</button>
                                </fieldset>
                            </td>
                            <td id="col-templatedata">
                                <input id="in-title" type="text" placeholder="Enter a name for your template..." />
                                {this.state.showPreviewImage && 
                                    <img id="input-file-preview" src={this.state.previewImageSrc} />
                                }
                                <button type="button" id="template-publish-btn" onClick={this.handlePublishButtonClick}>{this.publishButtonTexts.default}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}