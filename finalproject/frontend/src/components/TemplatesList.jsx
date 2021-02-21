import React, { createRef } from 'react';
import '../style/TemplateList.scss';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class TemplatesList extends React.Component {
    constructor(props){
        super(props);

        //this binding for React event handlers
        [
            'handleTemplateClick',
            'handlePlusButtonClick'
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    handleTemplateClick(e){
        let src = e.target.src;
        this.props.handleSelectionChange(e.target);
        this.props.handleTemplateSelection(src);
    }

    handlePlusButtonClick(e){
        this.props.handleSelectionChange(e.target);
        this.props.handlePlusButtonClick();
    }

    render(){
        return (
            <>
                <div id="template-container">
                    {this.props.data.isLoading ? (
                        <div id="loader">
                            <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                        </div>
                    ) : (
                        this.props.data.templates.map((t)=>(
                            <img src={t.url} alt={t.name} title={t.name} id={'template_'+t._id} onClick={this.handleTemplateClick} />
                        ))
                    )}
                    <img id="template-plus" src="/ui/plus.png" alt="Add your own template" title="Add your own template" onClick={this.handlePlusButtonClick} />
                </div>
            </>
        );
    }
}