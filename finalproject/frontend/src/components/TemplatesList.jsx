import React from 'react';
import '../style/TemplateList.scss';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import api from '../api';
import TemplateStatisticsChart from './TemplateStatisticsChart';

export default class TemplatesList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showNavButtons: false,
            templateStats: [],
            upvotes: [],
            downvotes: [],
            uses: [],
            days: []
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

        this.currentlySelectedIndex = this.props.data.templates.findIndex((t) => (
            elem.id == 'template_' + t._id
        ));

        this.props.handleSelectionChange(elem);
        this.props.handleTemplateSelection(src);
        this.setState({ showNavButtons: true });
    }

    handlePlusButtonClick(e) {
        this.props.handleSelectionChange(e.target);
        this.props.handlePlusButtonClick();
    }

    handlePrevButtonClick(e) {
        this.currentlySelectedIndex--;
        if (this.currentlySelectedIndex < 0) this.currentlySelectedIndex = this.props.data.templates.length - 1;

        let newSelectedElem = document.querySelectorAll('#template-list-wrapper .templateImg')[this.currentlySelectedIndex];
        this.props.handleSelectionChange(newSelectedElem);
        this.props.handleTemplateSelection(newSelectedElem.src);
    }

    handleNextButtonClick(e) {
        this.currentlySelectedIndex++;
        if (this.currentlySelectedIndex >= this.props.data.templates.length) this.currentlySelectedIndex = 0;

        let newSelectedElem = document.querySelectorAll('#template-list-wrapper .templateImg')[this.currentlySelectedIndex];
        this.props.handleSelectionChange(newSelectedElem);
        this.props.handleTemplateSelection(newSelectedElem.src);
    }

    componentDidMount = async () => {
        const templateStats = this.state;
        let response = await api.getStatsForTemplate(0);
        this.state.templateStats = response.data.data;
        this.state.days = this.state.templateStats.days;

        // console.log(this.props.data.templates[0]._id)

        for (var i = 0; i < templateStats.days.length; i++) {
            this.state.upvotes.push(templateStats.days[i].upvotes)
            this.state.downvotes.push(templateStats.days[i].downvotes)
            this.state.uses.push(templateStats.days[i].uses)
        }
        console.log(this.state.upvotes)
        console.log(this.state.downvotes)
        console.log(this.state.uses)
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
                <div id="template-container">
                    {this.props.data.isLoading ? (
                        <div id="loader">
                            <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                        </div>
                    ) : (
                            this.props.data.templates.map((t) => (
                                <img src={t.url} alt={t.name} title={t.name} id={'template_' + t._id} key={'template_' + t._id} className="templateImg" onClick={this.handleTemplateClick} />
                            ))
                        )}
                    <img id="template-plus" src="/ui/plus.png" alt="Add your own template" title="Add your own template" onClick={this.handlePlusButtonClick} />
                </div>
                <TemplateStatisticsChart
                    upvotes={this.state.upvotes}
                    downvotes={this.state.downvotes}
                    uses={this.state.uses}
                >
                </TemplateStatisticsChart>
            </div>
        );
    }
}