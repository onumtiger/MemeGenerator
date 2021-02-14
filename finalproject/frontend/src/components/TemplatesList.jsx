import React, { createRef } from 'react';

export default class TemplatesList extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div>
                <div onClick={this.props.handleTemplateClick}>TODO Templates</div>
                <div onClick={this.props.handlePlusButtonClick}>TODO Plus Button</div>
            </div>
        );
    }
}