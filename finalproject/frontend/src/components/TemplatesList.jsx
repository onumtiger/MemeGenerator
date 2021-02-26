import React from 'react';
import '../style/TemplateList.scss';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Main from '../speech/main';

export default class TemplatesList extends React.Component {
    constructor(props) {
        super(props);
        this.voiceControl = false;
        this.state = {
            showNavButtons: false
        };

        this.currentlySelectedIndex = 0;
        

        //this binding for React event handlers
        [
            'handleTemplateClick',
            'handlePlusButtonClick',
            'handlePrevButtonClick',
            'handleNextButtonClick'
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    handleTemplateClick(e) {
        let elem = e.target;
        let src = elem.src;
        let id = elem.dataset.templateid;

        this.currentlySelectedIndex = this.props.data.templates.findIndex((t) => (
            id == t._id
        ));

        this.props.handleSelectionChange(elem);
        this.props.handleTemplateSelection(src, id);
        this.setState({ showNavButtons: true });
    }


    voiceUsesPlusButton() {
        console.log("plus button voice")
        this.handlePlusButtonClick();
    }

    handlePlusButtonClick(e) {
        console.log("plus button clicked")
        this.props.handleSelectionChange(e.target);
        this.props.handlePlusButtonClick();
    }

    handlePrevButtonClick(e) {
        this.currentlySelectedIndex--;
        if (this.currentlySelectedIndex < 0) this.currentlySelectedIndex = this.props.data.templates.length - 1;

        let newSelectedElem = document.querySelectorAll('#template-list-wrapper .templateImg')[this.currentlySelectedIndex];
        this.props.handleSelectionChange(newSelectedElem);
        this.props.handleTemplateSelection(newSelectedElem.src, newSelectedElem.dataset.templateid);
    }

    handleNextButtonClick(e) {
        this.currentlySelectedIndex++;
        if (this.currentlySelectedIndex >= this.props.data.templates.length) this.currentlySelectedIndex = 0;

        let newSelectedElem = document.querySelectorAll('#template-list-wrapper .templateImg')[this.currentlySelectedIndex];
        this.props.handleSelectionChange(newSelectedElem);
        this.props.handleTemplateSelection(newSelectedElem.src, newSelectedElem.dataset.templateid);
    }

    componentDidMount(){
        let voiceControlButton = document.querySelector('.voice-control-button');
        voiceControlButton.addEventListener('click', (e)=>{
            if(!this.voiceControl){
                this.voiceControl = true;
                voiceControlButton.innerHTML = "... recording - click to disable "
                voiceControlButton.style.backgroundColor = "red"
                console.log("voice control clicked");
                Main.activateFullVoiceControl(voiceControlButton, this.voiceUsesPlusButton, this);  
            }else{
                this.voiceControl = false;
                console.log("voice control disabled");
                voiceControlButton.innerHTML = "enable voice control"
                voiceControlButton.style.backgroundColor = "initial"        
        }});
    }

    render() {
        return (
            <div id="template-list-wrapper">
                
                <h3>First, choose a template
                {this.state.showNavButtons && (
                        <span id="navbutton-wrapper">
                            (
                            <button type="button" className="navButton" onClick={this.handlePrevButtonClick}>Previous</button>
                    /
                            <button type="button" className="navButton" onClick={this.handleNextButtonClick}>Next</button>
                    )
                        </span>
                    )}:
                </h3>
                <button class="voice-control-button">enable voice control</button>
                <div id="template-container">
                    {this.props.data.isLoading ? (
                        <div id="loader">
                            <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                        </div>
                    ) : (
                            this.props.data.templates.map((t) => (
                                <img src={t.url} alt={t.name} title={t.name} id={'template_' + t._id} key={'template_' + t._id} data-templateid={t._id} className="templateImg" onClick={this.handleTemplateClick} />
                            ))
                        )}
                    <img id="template-plus" src="/ui/plus.png" alt="Add your own template" title="Add your own template" onClick={this.handlePlusButtonClick} />
                </div>
            </div>
        );
    }
}