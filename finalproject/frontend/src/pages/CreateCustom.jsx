import React, { createRef } from 'react';
import {DrawTemplate, WYSIWYGEditor} from './index'; //TODO move to components
import {TemplatesList} from '../components/index';
import api from '../api';

export default class CreateCustom extends React.Component {
    constructor(props){
        super(props);

        this.editorRef = createRef();
        this.initialTemplate = "/templates/_dummy.png";

        this.state = {
            showDrawTemplate: false,
            showEditor: false,
            templateListData: {
                isLoading: true,
                templates: []
            }
        };
        
        //this binding for React event handlers
        [
            'letCreateTemplate',
            'selectTemplate',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    letCreateTemplate(e){
        this.setState({showDrawTemplate: true, showEditor: false});
    }

    selectTemplate(src){
        if (this.state.showEditor){
            this.editorRef.current.setTemplateImage(src);
        }else{
            this.initialTemplate = src;
            this.setState({showEditor: true});
        }
        this.setState({showDrawTemplate: false});
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
        let selectedElem = document.getElementById('template_'+templateID);
        this.changeSelection(selectedElem);
        this.selectTemplate(selectedElem.src);
    }

    componentDidMount(){
        this.loadTemplatesIntoList();
    }

    render(){
        return (
            <div id="page-wrapper">
                <h2>Custom Meme Creation</h2>
                <h3>First, choose a template:</h3>
                <TemplatesList data={this.state.templateListData} handleTemplateSelection={this.selectTemplate} handlePlusButtonClick={this.letCreateTemplate} handleSelectionChange={this.changeSelection} />
                {this.state.showDrawTemplate && <DrawTemplate handlePublishing={this.handlePublishedTemplate} />}
                {this.state.showEditor && <WYSIWYGEditor ref={this.editorRef} templateImagePath={this.initialTemplate} />}
            </div>
        );
    }
}