import React, { createRef } from 'react';
import {DrawTemplate, WYSIWYGEditor} from './index'; //TODO move to components
import {TemplatesList} from '../components/index';

export default class CreateCustom extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            showDrawTemplate: false
        };
        
        //this binding for React event handlers
        [
            'letCreateTemplate',
            'selectTemplate'
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    letCreateTemplate(e){
        this.setState({showDrawTemplate: true});
    }

    selectTemplate(e){
        this.setState({showDrawTemplate: false});
        //TODO
    }

    render(){
        return (
            <div id="page-wrapper">
                <h2>Custom Meme Creation</h2>
                <h3>First, choose a template:</h3>
                <TemplatesList handleTemplateClick={this.selectTemplate} handlePlusButtonClick={this.letCreateTemplate} />
                {this.state.showDrawTemplate && <DrawTemplate />}
                <WYSIWYGEditor templateImagePath="/templates/_dummy.png" />
            </div>
        );
    }
}