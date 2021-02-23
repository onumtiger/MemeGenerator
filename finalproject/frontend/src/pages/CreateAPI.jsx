import React, { Component } from 'react';
import api from '../api';

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import '../style/CreateAPI.scss';

class CreateAPI extends Component {
    constructor(props) {
        super(props);

        this.state = {
            templates: [],
            templatesLoading: true,
            currentTemplate: {
                id: '',
                url: '',
                name: '',
                box_count: 0
            },
            generatedMemeURL: null,
            visibilityOptionsLoading: true,
            visibilityOptions: []
        };
        
        this.generateButtonTexts = {
            default: 'Generate Meme',
            loading: 'Generating...'
        };
        this.publishButtonTexts = {
            default: 'Publish this Meme',
            loading: 'Publishing...'
        };
        this.selectedVisibilityElem = null;
        this.captions = [];
        
        //this binding for React event handlers
        [
            'handleTemplateClick',
            'handleGenerateButtonClick',
            'handleVisibilityOptionCheck',
            'handlePublishButtonClick',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    changeTemplateSelection(selectedElem){
        let prevSelection = document.querySelector('#create-api-page-wrapper #template-container .selected');
        if (prevSelection) prevSelection.classList.remove('selected');
        if(selectedElem) selectedElem.classList.add('selected');
    }

    handleTemplateClick(e){
        let elem = e.target;
        let template = this.state.templates.find((t)=>(t.url == elem.src));
        this.changeTemplateSelection(elem);
        this.setState({currentTemplate: {
            id: template.id,
            url: template.url,
            name: template.name,
            box_count: template.box_count
        }});
    }

    handleGenerateButtonClick = async (e) => {
        let params = {
            template_id: this.state.currentTemplate.id,
            username: "onumUni",
            password: "copquh-pywciC-kubho4"
        };
        let inputElems = document.querySelectorAll('#create-api-page-wrapper input');
        this.captions = [];
        for(let i=0; i<this.state.currentTemplate.box_count; i++){
            params['boxes['+i+'][text]'] = inputElems[i].value;
            this.captions.push(inputElems[i].value);
        }
        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');//boxes[0][text]
        e.target.textContent = this.generateButtonTexts.loading;
        let response = await fetch('https://api.imgflip.com/caption_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: queryString
        });
        let resJson = await response.json();
        e.target.textContent = this.generateButtonTexts.default;
        if(resJson.success){
            this.setState({
                generatedMemeURL: resJson.data.url
            });
        }
    }

    handleVisibilityOptionCheck(e){
        if(e.target.checked){
            this.selectedVisibilityElem = e.target;
            document.querySelector('#create-api-page-wrapper #visibilityOption-wrapper').classList.remove('invalid');
        }
    }

    handlePublishButtonClick(e){
        const formData = new FormData();

        let enteredTitle = document.querySelector('#create-api-page-wrapper #in-title').value;
        formData.append('name', enteredTitle || this.state.currentTemplate.name);
        formData.append('userID', 0); //TODO get current userID
        if(!this.selectedVisibilityElem){
            document.querySelector('#create-api-page-wrapper #visibilityOption-wrapper').classList.add('invalid');
            return;
        }
        formData.append('visibility', this.selectedVisibilityElem.value);
        formData.append('imageURL', this.state.generatedMemeURL);
        formData.append('captions', this.captions);
        
        e.target.textContent = this.publishButtonTexts.loading;
        api.insertMeme(formData).then((res)=>{
            if(res.data.success){
                //new meme ID now at res.data.id
            }
            e.target.textContent = this.publishButtonTexts.default;
        });
    }

    componentDidMount = async()=>{
        let response = await fetch('https://api.imgflip.com/get_memes');
        let resJson = await response.json();
        if(resJson.success){
            this.setState({
                templates: resJson.data.memes,
                templatesLoading: false
            });
        }

        //TODO insert actual userId
        response = await api.getTemplateVisibilityOptions(0);
        this.setState({
            visibilityOptions: response.data.data,
            visibilityOptionsLoading: false
        });
    }

    render() {
        const { templatesLoading, templates, currentTemplate, generatedMemeURL, visibilityOptionsLoading, visibilityOptions } = this.state;

        let captionInputs=[];
        for(let i=0; i<currentTemplate.box_count; i++){
            captionInputs.push(
                <>
                <label htmlFor={'caption_'+i}>Caption #{i}:</label>
                <input id={'caption_'+i} className="form-control" type="text" placeholder="Enter a Caption Text..." />
                </>
            );
        }

        return (
            <div className="form-group" id="create-api-page-wrapper">
                <h2>Create a Meme via the ImgFlip API</h2>

                <div id="template-container">
                    {templatesLoading ? (
                        <div id="loader">
                            <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                        </div>
                    ) : (
                        templates.map((t)=>(
                            <img src={t.url} alt={t.name} title={t.name} onClick={this.handleTemplateClick} />
                        ))
                    )}
                </div>

                {currentTemplate.url && !generatedMemeURL && (
                    <>
                    <img id="template-current" src={currentTemplate.url} alt={currentTemplate.name} title={currentTemplate.name} />
                
                    <div id="caption-inputs-wrapper">
                        {captionInputs}
                    </div>
                
                    <button type="button" id="generate-btn" onClick={this.handleGenerateButtonClick}>{this.generateButtonTexts.default}</button>
                    </>
                )}
                
                {generatedMemeURL && (
                    <>
                    <input id="in-title" type="text" placeholder={`Enter a name for your ${currentTemplate.name} meme...`} />
                    <img id="generated-img" src={generatedMemeURL} alt="Your generated Meme" title="Your generated Meme" />
                    
                    <fieldset>
                        <legend>Visibility</legend>
                        {visibilityOptionsLoading ? (
                            <div id="view-page-loader">
                                <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                            </div>
                        ) : (
                            <div id="visibilityOption-wrapper">
                            {visibilityOptions.map((vo)=>(
                                <p className="visibilityOption">
                                <input type="radio" name="visibility" id={"visibility-"+vo.value} value={vo.value} onChange={this.handleVisibilityOptionCheck} />
                                <label htmlFor={"visibility-"+vo.value}>{vo.name}</label>
                                </p>
                            ))}
                            </div>
                        )}
                    </fieldset>
                    <button type="button" id="publish-btn" onClick={this.handlePublishButtonClick}>{this.publishButtonTexts.default}</button>
                    </>
                )}
            </div>
        )
    }
}

export default CreateAPI