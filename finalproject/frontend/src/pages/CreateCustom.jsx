import React, { createRef } from 'react';
import {DrawTemplate, WYSIWYGEditor} from './index'; //TODO move to components
import {TemplatesList} from '../components/index';

export default class CreateCustom extends React.Component {
    constructor(props){
        super(props);

        this.editorRef = createRef();
        this.initialTemplate = "/templates/_dummy.png";

        this.state = {
            showDrawTemplate: false,
            showEditor: false
        };
        
        //this binding for React event handlers
        [
            'letCreateTemplate',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    letCreateTemplate(e){
        this.setState({showDrawTemplate: true});
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

    handlePublishedTemplate(templateID){
        let selectedElem = document.getElementById('template_'+templateID);
        selectedElem.classList.add('selected');
        this.selectTemplate(selectedElem.src);
    }

    render(){
        return (
            <div id="page-wrapper">
                <h2>Custom Meme Creation</h2>
                <h3>First, choose a template:</h3>
                <TemplatesList handleTemplateSelection={this.selectTemplate} handlePlusButtonClick={this.letCreateTemplate} />
                {this.state.showDrawTemplate && <DrawTemplate handlePublishing={this.handlePublishedTemplate} />}
                {this.state.showEditor && <WYSIWYGEditor ref={this.editorRef} templateImagePath={this.initialTemplate} />}
            </div>
        );
    }
}