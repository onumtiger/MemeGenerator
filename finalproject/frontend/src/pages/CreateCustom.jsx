import React, { createRef } from 'react';
import {DrawTemplate, WYSIWYGEditor, TemplatesList, CreateTemplateSelection, UploadTemplate, TemplateDetails, DraftList} from '../components';
import api from '../api';
import '../style/CreateCustom.scss';
import Main from '../speech/main';
import createTokenProvider from '../api/createTokenProvider';
import { NavBar } from '../components';

/**
 * Custom creation of a meme by choosing template, using draft ...
 */
export default class CreateCustom extends React.Component {

    constructor(props){
        super(props);
        this.voiceControl = false;
        this.captionBoxInput = null;
        this.textBoxInput = null; 
        this.editorRef = createRef();
        this.initialTemplateSrc = "";
        this.initialTemplateId = -1;

        this.state = {
            showTemplateSelection: false,
            showUploadTemplate: false,
            showDrawTemplate: false,
            showEditor: false,
            templateListData: {
                isLoading: true,
                templates: []
            },
            showTemplateDetails: false,
            selectedTemplate: null,
            selectedDraft: null
        };
        
        //this binding for React event handlers
        [
            'letAddTemplate',
            'selectTemplate',
            'selectTemplateUpload',
            'selectTemplateCreation',
            'handleDraftSelection',
            'handleVoiceInput',
            'confirmTemplate',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    /**
     * handle template selection
     * @param {Event} e 
     */
    letAddTemplate(e){
        this.setState({
            showTemplateSelection: true,
            showUploadTemplate: false,
            showDrawTemplate: false,
            showTemplateDetails: false
        });
    }

    /**
     * "upload" selected
     */
    selectTemplateUpload(){
        this.setState({
            showTemplateSelection: false,
            showUploadTemplate: true,
            showTemplateDetails: false
        });
    }

    /**
     * create template
     */
    selectTemplateCreation(){
        this.setState({
            showTemplateSelection: false,
            showDrawTemplate: true,
            showTemplateDetails: false
        });
    }

    /**
     * selecte a specific template
     * @param {TemplateDBEntry} template - template (database)
     */
    selectTemplate(template){
        this.setState({
            showTemplateSelection: false,
            showUploadTemplate: false,
            showDrawTemplate: false,
            showTemplateDetails: true,
            selectedTemplate: template
        });
    }

    /**
     * confirm the template
     */
    confirmTemplate() {
        let src = this.state.selectedTemplate.url;
        let id = this.state.selectedTemplate._id;

        this.initialTemplateSrc = src;
        this.initialTemplateId = id;
        if (this.state.showEditor){ //don't rerender the editor, or we will lose the input!
            this.editorRef.current.setTemplateImage(src, id);
        }else{
            this.setState({
                showEditor: true
            });
        }
        this.setState({
            selectedDraft: null,
            showTemplateDetails: false
        });
    }

    /**
     * handles the draft selection from user
     * @param {DraftDBEntry} draft - a draft (database)
     */
    handleDraftSelection(draft){
        this.changeSelection(null);
        this.setState({
            showEditor: false, 
            selectedDraft: null
        });
        let draftTemplate = this.state.templateListData.templates.find((t)=>(t._id == draft.template_id));
        if(draftTemplate){
            this.initialTemplateSrc = draftTemplate.url;
            this.initialTemplateId = draft.template_id;
            this.setState({
                selectedDraft: draft,
                showTemplateDetails: false,
                showEditor: true
            });
        }
    }

    /**
     * load the stored templates into the template list
     */
    loadTemplatesIntoList = async ()=>{
        this.setState({
            templateListData: {
                templates: [],
                isLoading: true
            }
        });
        try{
            let userId = createTokenProvider.userIdFromToken();
            let templatesArray = await api.getAllTemplates(userId);
            if (templatesArray.data.success){
                this.setState({
                    templateListData: {
                        templates: templatesArray.data.data,
                        isLoading: false
                    }
                });
            }else{
                console.log('Templates could not be loaded!', templatesArray.data);
            }
        }catch(err){
            console.log('Failed to load templates: ',err);
        }
    }

    /**
     * selection changes made?
     * @param {*} selectedElem 
     */
    changeSelection(selectedElem){
        let prevSelection = document.querySelector('#template-container .selected');
        if (prevSelection) prevSelection.classList.remove('selected');
        if(selectedElem) selectedElem.classList.add('selected');
    }

    /**
     * handles publishing of template
     * @param {Number} templateID 
     */
    handlePublishedTemplate = async (templateID)=>{
        await this.loadTemplatesIntoList();
        let selectedElem = document.querySelector('#create-custom-page-wrapper #template_'+templateID);
        let selectedTemplate = this.state.templateListData.templates.find((t)=>(t._id == templateID));
        this.changeSelection(selectedElem);
        this.selectTemplate(selectedTemplate);
    }

    /**
     * handles voice status from main.js (speech) 
     * @param {String} status which action has to be executed?
     * @param {String} parameter for entered titles or captions
     */
    handleVoiceInput(status, parameter){

        // get used objects
        let plusButton = document.querySelector('.template-plus');
        let prevButton = document.querySelector('.previousButton');
        let nextButton = document.querySelector('.nextButton');
        let template = document.querySelectorAll('.templateImg');
        let draft = document.querySelector('.draft');
        let titleBox = document.querySelector('.in-title');
        let privateButton = document.querySelector('#wysiwyg-wrapper #visibilityOption-wrapper #visibility-0');
        let unlistedButton = document.querySelector('#wysiwyg-wrapper #visibilityOption-wrapper #visibility-1');
        let publicButton = document.querySelector('#wysiwyg-wrapper #visibilityOption-wrapper #visibility-2');
        let draftSaveButton = document.querySelector('.draft-save-button');
        let downloadButton = document.querySelector('.canvas-download-btn');
        let publishButton = document.querySelector('.canvas-publish-btn');
        let createOwnTemplate = document.querySelector('.create-own-template');
        let externalImage = document.querySelector('.external-image');
        let useTemplateButton = document.querySelector('.use-template');

       
        // REACT ACCORDING TO STATUS
            switch (status){
            case "create_new_template":
                plusButton.click();
                window.scrollTo(0,document.body.scrollHeight);
            break;
            case "template_choose":
                template[parameter].click();
                window.scrollTo(0,document.body.scrollHeight);
            break;
            case "next_template":
                nextButton.click();
                window.scrollTo(0,document.body.scrollHeight);
            break;
            case "previous_template":
                prevButton.click()
                window.scrollTo(0,document.body.scrollHeight);
            break;
            case "draft":
                draft.click()
                window.scrollTo(0,document.body.scrollHeight);
            break;
            case "create_own_template":
                createOwnTemplate.click()
                window.scrollTo(0,document.body.scrollHeight);
            break;
            case "external_image":
                externalImage.click()  
            break;
            case "enter_title":
                titleBox.value = parameter
            break;
            case "caption_active":
                let {newTextBox, captionInput} = this.editorRef.current.addCaption(0, 0, "");
                this.textBoxInput = newTextBox
                this.captionBoxInput = captionInput
            break;
            case "enter_caption":
                this.captionBoxInput.value = parameter
                this.textBoxInput.updateText(parameter)
                this.editorRef.current.repaint(true)
            break;
            case "set_public":
                publicButton.click()
            break;
            case "set_unlisted":
                unlistedButton.click()
            break;
            case "set_private":
                privateButton.click()
            break;
            case "download":
                downloadButton.click()
            break;
            case "publish":
                publishButton.click()
            break;
            case "save_draft":
                draftSaveButton.click()
            break;
            case "up":
                window.scrollTo(0,0);
            break;
            case "down":
                window.scrollTo(0,document.body.scrollHeight);
            break;
            case "use_template":
                useTemplateButton.click()
                window.scrollTo(0,document.body.scrollHeight);
            break;
            default:
            break; 
            }         
    }

    /**
     * Mainly used for speech recognition, contains click handler for enable button
     */
    componentDidMount(){
        this.loadTemplatesIntoList();

        // Voice button handler calls methods accordingly
        let voiceControlButton = document.querySelector('.voice-control-button');
        voiceControlButton.addEventListener('click', (e)=>{
            if(!this.voiceControl){
                this.voiceControl = true;          
                Main.activateFullVoiceControl(voiceControlButton, this.handleVoiceInput);  
            }else{
                this.voiceControl = false;
                Main.stopSpeechRecognition();                    
        }});
    }

    render(){
        return (
            <>
            <NavBar />
            <div id="create-custom-page-wrapper">
                <h2>Custom Meme Creation</h2>
                <TemplatesList data={this.state.templateListData} handleTemplateSelection={this.selectTemplate} handlePlusButtonClick={this.letAddTemplate} handleSelectionChange={this.changeSelection} />
                <DraftList handleDraftSelection={this.handleDraftSelection} />
                {this.state.showTemplateDetails && 
                    <TemplateDetails template={this.state.selectedTemplate} confirmTemplate={this.confirmTemplate} />
                }
                {this.state.showTemplateSelection &&
                    <CreateTemplateSelection handleUploadButtonClick={this.selectTemplateUpload} handleCreateButtonClick={this.selectTemplateCreation} />
                }
                {this.state.showUploadTemplate &&
                    <UploadTemplate handlePublishing={this.handlePublishedTemplate} />
                }
                {this.state.showDrawTemplate &&
                    <DrawTemplate handlePublishing={this.handlePublishedTemplate} />
                }
                {this.state.showEditor &&
                    <WYSIWYGEditor ref={this.editorRef} templateImagePath={this.initialTemplateSrc} templateImageId={this.initialTemplateId} draft={this.state.selectedDraft} history={this.props.history} />
                }
            </div>
            </>
        );
    }
}