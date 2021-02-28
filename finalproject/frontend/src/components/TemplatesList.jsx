import React from 'react';
import '../style/TemplateList.scss';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

/**
 * template list
 */
export default class TemplatesList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showNavButtons: false
        };

        this.currentlySelectedIndex = 0;
        this.currentlySelectedTemplate = null;

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

    /**
     * handle template click
     * @param {Event} e 
     */
    handleTemplateClick(e) {
        let elem = e.target;
        let id = elem.dataset.templateid;

        this.currentlySelectedIndex = this.props.data.templates.findIndex((t) => (
            id == t._id
        ));
        this.currentlySelectedTemplate = this.props.data.templates.find((t) => (
            id == t._id
        ));

        this.props.handleSelectionChange(elem);
        this.props.handleTemplateSelection(this.currentlySelectedTemplate);
        this.setState({ showNavButtons: true });
    }

    /**
     * voice control uses the plus button
     */
    voiceUsesPlusButton() {
        this.handlePlusButtonClick();
    }

    /**
     * when the plus button is clicked. Create own template 
     * @param {Event} e 
     */
    handlePlusButtonClick(e) {
        this.props.handleSelectionChange(e.target);
        this.props.handlePlusButtonClick();
        this.setState({ showNavButtons: false });
    }

    /**
     * handle previous button click to get previous template
     * @param {Event} e 
     */
    handlePrevButtonClick(e) {
        this.currentlySelectedIndex--;
        if (this.currentlySelectedIndex < 0) this.currentlySelectedIndex = this.props.data.templates.length - 1;
        let newSelectedElem = document.querySelectorAll('#template-list-wrapper .templateImg')[this.currentlySelectedIndex];
        this.currentlySelectedTemplate = this.props.data.templates[this.currentlySelectedIndex];
        this.props.handleSelectionChange(newSelectedElem);
        this.props.handleTemplateSelection(this.currentlySelectedTemplate);
    }

    /**
     * handle next button click to get next template
     * @param {Event} e 
     */
    handleNextButtonClick(e) {
        this.currentlySelectedIndex++;
        if (this.currentlySelectedIndex >= this.props.data.templates.length) this.currentlySelectedIndex = 0;

        let newSelectedElem = document.querySelectorAll('#template-list-wrapper .templateImg')[this.currentlySelectedIndex];

        this.currentlySelectedTemplate = this.props.data.templates[this.currentlySelectedIndex];

        this.props.handleSelectionChange(newSelectedElem);
        this.props.handleTemplateSelection(this.currentlySelectedTemplate);
    }


    render() {
        return (
            <div id="template-list-wrapper">
                <button className="voice-control-button">enable voice control</button>
                <h3>First, choose a template
                {this.state.showNavButtons && (
                        <span id="navbutton-wrapper">
                            (
                            <button type="button" className="navButton previousButton" onClick={this.handlePrevButtonClick}>Previous</button>
                    /
                            <button type="button" className="navButton nextButton" onClick={this.handleNextButtonClick}>Next</button>
                    )
                        </span>
                    )}:
                </h3>

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
                    <img id="template-plus" className="template-plus" src="/ui/plus.png" alt="Add your own template" title="Add your own template" onClick={this.handlePlusButtonClick} />
                </div>
            </div>
        );
    }
}