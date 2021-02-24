import React from 'react';
import '../style/UploadTemplate.scss';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import api from '../api';

export default class UploadTemplate extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showPreviewImage: false,
            previewImageSrc: null,
            visibilityOptionsLoading: true,
            visibilityOptions: []
        }

        this.uploadImageAsURL = false;
        this.uploadImageFile = null;
        this.uploadImageURL = "";
        this.selectedVisibilityElem = null;
        
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
            'handleUploadSnapshotURLButtonClick',
            'handleVisibilityOptionCheck',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    handlePublishButtonClick(e){
        if(e.target.classList.contains('inactive')) return;
        const formData = new FormData();

        let enteredTitle = document.querySelector('#upload-template-table #in-title').value;
        formData.append('name', enteredTitle || 'Uploaded image');
        formData.append('userID', 0); //TODO get current userID
        if(!this.selectedVisibilityElem){
            document.querySelector('#upload-template-table #visibilityOption-wrapper').classList.add('invalid');
            return;
        }
        formData.append('visibility', this.selectedVisibilityElem.value);
        
        if(this.uploadImageAsURL){
            formData.append('imageURL', this.uploadImageURL);
        }else{
            formData.append('image', this.uploadImageFile);
        }
        
        e.target.textContent = this.publishButtonTexts.loading;
        api.insertTemplate(formData).then((res)=>{
            if(res.data.success){
                this.props.handlePublishing(res.data.id);
            }
            e.target.textContent = this.publishButtonTexts.default;
        }).catch(err =>{
            console.log('Failed to upload template: ',err);
            e.target.textContent = this.publishButtonTexts.default;
        });
    }

    handleVisibilityOptionCheck(e){
        if(e.target.checked){
            this.selectedVisibilityElem = e.target;
            document.querySelector('#upload-template-table #visibilityOption-wrapper').classList.remove('invalid');
        }
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
        document.querySelector('#upload-template-table #template-publish-btn').classList.remove('inactive');

        this.setState({
            showPreviewImage: true,
            previewImageSrc: URL.createObjectURL(imgFile)
        });
    }

    handleUploadFileURLButtonClick(e){
        let urlInput = document.querySelector('#upload-template-table #input-fileURL');
        //if the input doesn't resemble valid http(s) URL syntax, just render the input as invalid. Otherwise, remove the invalid mark
        if(urlInput.value.match(/^https?:\/\/.+\..+/i)){
            urlInput.classList.remove('invalid');
        }else{
            urlInput.classList.add('invalid');
            return;
        }
        //display loading message on button while fetching results
        e.target.textContent = this.uploadFileURLButtonTexts.loading;
        api.fetchWebImage(encodeURIComponent(urlInput.value)).then((res)=>{
            if(res.data.success){
                this.uploadImageURL = res.data.url;
                this.uploadImageAsURL = true;
                document.querySelector('#upload-template-table #template-publish-btn').classList.remove('inactive');
                this.setState({
                    showPreviewImage: true,
                    previewImageSrc: res.data.url
                });
            }
            e.target.textContent = this.uploadFileURLButtonTexts.default;
        }).catch(err =>{
            console.log('Failed to upload image file by URL: ',err);
            urlInput.classList.add('invalid');
            e.target.textContent = this.uploadFileURLButtonTexts.default;
        });
    }

    handleUploadSnapshotURLButtonClick(e){
        let urlInput = document.querySelector('#upload-template-table #input-snapshotURL');
        //if the input doesn't resemble valid http(s) URL syntax, just render the input as invalid. Otherwise, remove the invalid mark
        if(urlInput.value.match(/^https?:\/\/.+\..+/i)){
            urlInput.classList.remove('invalid');
        }else{
            urlInput.classList.add('invalid');
            return;
        }
        //display loading message on button while fetching results
        e.target.textContent = this.uploadSnapshotURLButtonTexts.loading;
        api.fetchWebSnapshot(encodeURIComponent(urlInput.value)).then((res)=>{
            if(res.data.success){
                this.uploadImageURL = res.data.url;
                this.uploadImageAsURL = true;
                this.setState({
                    showPreviewImage: true,
                    previewImageSrc: res.data.url
                });
            }
            e.target.textContent = this.uploadSnapshotURLButtonTexts.default;
        }).catch(err =>{
            console.log('Failed to snapshot website: ',err);
            urlInput.classList.add('invalid');
            e.target.textContent = this.uploadSnapshotURLButtonTexts.default;
        });
    }

    componentDidMount = async () => {
        //TODO insert actual userId
        api.getTemplateVisibilityOptions(0).then((response)=>{
            this.setState({
                visibilityOptions: response.data.data,
                visibilityOptionsLoading: false
            });
        }).catch(err =>{
            console.log('Failed to get visibility options: ',err);
        });

    }

    render(){
        let {showPreviewImage, previewImageSrc, visibilityOptionsLoading, visibilityOptions} = this.state;
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
                                    <legend>Upload an <abbr title="has to be one of the supported types: JPG / PNG / BMP / TIFF / static GIF">image</abbr> from the web</legend>
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
                                {showPreviewImage && 
                                    <img id="input-file-preview" src={previewImageSrc} />
                                }
                                <fieldset>
                                    <legend>Visibility</legend>
                                    {visibilityOptionsLoading ? (
                                        <div id="view-page-loader">
                                            <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                                        </div>
                                    ) : (
                                        <div id="visibilityOption-wrapper">
                                        {visibilityOptions.map((vo)=>(
                                            <p className="visibilityOption" key={'visibilityOption-'+vo.value}>
                                            <input type="radio" name="visibility" id={"visibility-"+vo.value} value={vo.value} onChange={this.handleVisibilityOptionCheck} />
                                            <label htmlFor={"visibility-"+vo.value}>{vo.name}</label>
                                            </p>
                                        ))}
                                        </div>
                                    )}
                                </fieldset>
                                <button type="button" id="template-publish-btn" onClick={this.handlePublishButtonClick} className="inactive">{this.publishButtonTexts.default}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
}