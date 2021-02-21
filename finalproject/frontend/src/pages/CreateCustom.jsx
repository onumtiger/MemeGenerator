import React, { createRef } from 'react';
import {DrawTemplate, WYSIWYGEditor, TemplatesList, CreateTemplateSelection, UploadTemplate} from '../components';
import api from '../api';
import '../style/CreateCustom.scss';

export default class CreateCustom extends React.Component {
    constructor(props){
        super(props);

        this.editorRef = createRef();
        this.initialTemplate = "/templates/_dummy.png";

        this.state = {
            showTemplateSelection: false,
            showUploadTemplate: false,
            showDrawTemplate: false,
            showEditor: false,
            templateListData: {
                isLoading: true,
                templates: []
            }
        };
        
        //this binding for React event handlers
        [
            'letAddTemplate',
            'selectTemplate',
            'selectTemplateUpload',
            'selectTemplateCreation',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    letAddTemplate(e){
        this.setState({
            showTemplateSelection: true,
            showUploadTemplate: false,
            showDrawTemplate: false
        });
    }

    selectTemplateUpload(){
        this.setState({
            showTemplateSelection: false,
            showUploadTemplate: true,
        });
    }

    selectTemplateCreation(){
        this.setState({
            showTemplateSelection: false,
            showDrawTemplate: true
        });
    }

    selectTemplate(src){
        if (this.state.showEditor){ //don't rerender the editor, or we will lose the input!
            this.editorRef.current.setTemplateImage(src);
        }else{
            this.initialTemplate = src;
            this.setState({
                showEditor: true
            });
        }
        this.setState({
            showTemplateSelection: false,
            showUploadTemplate: false,
            showDrawTemplate: false
        });
    }

    loadTemplatesIntoList = async ()=>{
        this.setState({
            templateListData: {
                templates: [],
                isLoading: true
            }
        });
        let templatesArray = await api.getAllTemplates();
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
    }

    changeSelection(selectedElem){
        let prevSelection = document.querySelector('#template-container .selected');
        if (prevSelection) prevSelection.classList.remove('selected');
        if(selectedElem) selectedElem.classList.add('selected');
    }

    handlePublishedTemplate = async (templateID)=>{
        await this.loadTemplatesIntoList();
        let selectedElem = document.querySelector('#create-custom-page-wrapper #template_'+templateID);
        this.changeSelection(selectedElem);
        this.selectTemplate(selectedElem.src);
    }

    componentDidMount(){
        this.loadTemplatesIntoList();
    }

    render(){
        return (
            <div id="create-custom-page-wrapper">
                <h2>Custom Meme Creation</h2>
                <h3>First, choose a template:</h3>
                <TemplatesList data={this.state.templateListData} handleTemplateSelection={this.selectTemplate} handlePlusButtonClick={this.letAddTemplate} handleSelectionChange={this.changeSelection} />
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
                    <WYSIWYGEditor ref={this.editorRef} templateImagePath={this.initialTemplate} />
                }
            </div>
        );
    }
}