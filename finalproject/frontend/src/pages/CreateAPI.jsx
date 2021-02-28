import React, { Component } from 'react';
import api from '../api';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../style/CreateAPI.scss';
import createTokenProvider from '../api/createTokenProvider';
import { NavBar } from '../components';

/**
 * create via API
 */
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
            loading_template: 'Publishing Template...',
            loading_meme: 'Publishing Meme...'
        };
        this.selectedVisibilityElem = null;
        this.captions = [];

        //this binding for React event handlers
        [
            'handleTemplateClick',
            'handleGenerateButtonClick',
            'handleVisibilityOptionCheck',
            'handlePublishButtonClick',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    /**
     * change selected template
     * @param {EventTarget} selectedElem - target
     */
    changeTemplateSelection(selectedElem) {
        let prevSelection = document.querySelector('#create-api-page-wrapper #template-container .selected');
        if (prevSelection) prevSelection.classList.remove('selected');
        if (selectedElem) selectedElem.classList.add('selected');
    }

    /**
     * handles template click
     * @param {Event} e 
     */
    handleTemplateClick(e) {
        let elem = e.target;
        let template = this.state.templates.find((t) => (t.url == elem.src));
        this.changeTemplateSelection(elem);
        this.setState({
            currentTemplate: {
                id: template.id,
                url: template.url,
                name: template.name,
                box_count: template.box_count
            }
        });
    }

    /**
     * handles "generate" button
     * @param {Event} e 
     */
    handleGenerateButtonClick = async (e) => {
        let params = {
            template_id: this.state.currentTemplate.id,
            username: "onumUni",
            password: "copquh-pywciC-kubho4"
        };
        let inputElems = document.querySelectorAll('#create-api-page-wrapper input');
        this.captions = [];
        for (let i = 0; i < this.state.currentTemplate.box_count; i++) {
            params['boxes[' + i + '][text]'] = inputElems[i].value;
            this.captions.push(inputElems[i].value);
        }
        let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');

        e.target.textContent = this.generateButtonTexts.loading;
        try {
            let response = await fetch('https://api.imgflip.com/caption_image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: queryString
            });
            let resJson = await response.json();
            e.target.textContent = this.generateButtonTexts.default;
            if (resJson.success) {
                this.setState({
                    generatedMemeURL: resJson.data.url
                });
            }
        } catch (err) {
            console.log('Failed to generate meme: ', err);
            e.target.textContent = this.generateButtonTexts.default;
        }
    }

    /**
     * handles visibility
     * @param {Event} e 
     */
    handleVisibilityOptionCheck(e) {
        if (e.target.checked) {
            this.selectedVisibilityElem = e.target;
            document.querySelector('#create-api-page-wrapper #visibilityOption-wrapper').classList.remove('invalid');
        }
    }

    /**
     * handles publishing
     * @param {Event} e 
     */
    handlePublishButtonClick = async (e) => {
        //collect all necessary data and check if anything is missing
        const formData = new FormData();

        //check for a given meme title
        let titleInput = document.querySelector('#create-api-page-wrapper #in-title');
        let enteredTitle = titleInput.value;
        if (!enteredTitle) {
            titleInput.classList.add('invalid');
            return;
        } else {
            titleInput.classList.remove('invalid');
        }

        //we have a title, let's add it
        formData.append('name', enteredTitle);

        //add userID
        let userId = createTokenProvider.userIdFromToken();
        formData.append('userID', userId);

        //check for a selected visibility
        if (!this.selectedVisibilityElem) {
            document.querySelector('#create-api-page-wrapper #visibilityOption-wrapper').classList.add('invalid');
            return;
        }

        //we have a visibility value, let's add it
        formData.append('visibility', this.selectedVisibilityElem.value);

        //add meme image URL and caption texts
        formData.append('imageURL', this.state.generatedMemeURL);
        formData.append('captions', this.captions);

        //all data seems to be there, we have to upload the template first though. So let's assemble the data for that:
        let templateParams = {
            imageURL: this.state.currentTemplate.url,
            name: this.state.currentTemplate.name,
            userID: userId,
            visibility: 2 //public template
        };

        let templateID;

        //upload the template
        e.target.textContent = this.publishButtonTexts.loading_template;
        try {
            let response = await api.insertTemplate(templateParams);
            templateID = response.data.id;
        } catch (err) {
            console.log('Failed to publish template: ', err);
            e.target.textContent = this.publishButtonTexts.default;
            return;
        }

        //append the new templateID to the formData
        formData.append('templateID', templateID);

        //upload the meme
        e.target.textContent = this.publishButtonTexts.loading_meme;
        try {
            let response = await api.insertMeme(formData);
            let memeID = response.data.id;
            this.props.history.push('/memes/view/' + memeID);
        } catch (err) {
            console.log('Failed to publish meme: ', err);
        }
        e.target.textContent = this.publishButtonTexts.default;
    }

    /**
     * gets memes from imgflip API
     */
    componentDidMount = async () => {
        try {
            let response = await fetch('https://api.imgflip.com/get_memes');
            let resJson = await response.json();
            if (resJson.success) {
                this.setState({
                    templates: resJson.data.memes,
                    templatesLoading: false
                });
            }
        } catch (err) {
            console.log('Failed to get templates from ImgFlip: ', err);
        }

        try {
            let userId = createTokenProvider.userIdFromToken();
            let response = await api.getMemeVisibilityOptions(userId);
            this.setState({
                visibilityOptions: response.data.data,
                visibilityOptionsLoading: false
            });
        } catch (err) {
            console.log('Failed to get visibility options: ', err);
        }
    }

    render() {
        const { templatesLoading, templates, currentTemplate, generatedMemeURL, visibilityOptionsLoading, visibilityOptions } = this.state;

        let captionInputs = [];
        for (let i = 0; i < currentTemplate.box_count; i++) {
            captionInputs.push(
                <>
                    <label htmlFor={'caption_' + i}>Caption #{i}:</label>
                    <input id={'caption_' + i} className="form-control" type="text" placeholder="Enter a Caption Text..." />
                </>
            );
        }

        return (
            <>
            <NavBar />
            <div className="form-group" id="create-api-page-wrapper">
                <h2>Create a Meme via the ImgFlip API</h2>

                <div id="template-container">
                    {templatesLoading ? (
                        <div id="loader">
                            <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                        </div>
                    ) : (
                            templates.map((t) => (
                                <img src={t.url} alt={t.name} title={t.name} onClick={this.handleTemplateClick} key={'template-' + t.id} />
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
                                        {visibilityOptions.map((vo) => (
                                            <p className="visibilityOption" key={'visibilityOption-' + vo.value}>
                                                <input type="radio" name="visibility" id={"visibility-" + vo.value} value={vo.value} onChange={this.handleVisibilityOptionCheck} />
                                                <label htmlFor={"visibility-" + vo.value}>{vo.name}</label>
                                            </p>
                                        ))}
                                    </div>
                                )}
                        </fieldset>
                        <button type="button" id="publish-btn" onClick={this.handlePublishButtonClick}>{this.publishButtonTexts.default}</button>
                    </>
                )}
            </div>
            </>
        )
    }
}

export default CreateAPI