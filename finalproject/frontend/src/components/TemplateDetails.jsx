import React from "react";

import {TemplateBarChart, TemplateVoteCounter} from '.';
import api from '../api';
import '../style/TemplateDetails.scss';

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

export default class TemplateDetails extends React.Component {
    constructor(props) {
        super(props);

        this.prevTemplate= null;

        this.state = {
            isLoading: true,
            showStats: false,
            templateStats: {
                upvotes: [],
                downvotes: [],
                uses: [],
                date: []
            },
        };
        //this binding for React event handlers
        [
            'updateTemplateStats',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }
    
    updateTemplateStats = async () => {
        try{
            let templateID = this.props.template._id;
            this.setState({isLoading: true});
            let response = await api.getStatsForTemplate(templateID).catch((err)=>{
                throw new Error(err);
            });
            let templateStats = response.data.data;
            let days = templateStats.days;
    
            var upvotes = [];
            var downvotes = [];
            var uses = [];
            var date = [];
    
            var x = days.length - Math.min(days.length, 14);
            //push all last 14 days values in the respective empty array
            for (var i = x; i < days.length; i++) {
                upvotes.push(days[i].upvotes)
                downvotes.push(days[i].downvotes)
                uses.push(days[i].uses)
                date.push(days[i].date)
            }
            this.setState({
                templateStats: {upvotes, downvotes, uses, date},
                isLoading: false,
                showStats: true
            });
        }catch(err){         
            console.log('Failed to get Stats: ',err);
            this.setState({
                isLoading: false,
                showStats: false
            });
        }
    }

    componentDidMount(){
        this.updateTemplateStats();
    }

    componentDidUpdate(){
        if(this.props.template != this.prevTemplate){
            this.prevTemplate = this.props.template;
            this.updateTemplateStats();
        }
    }

    render() {
        return (
            <>
            <div id="template-details-wrapper">
                <div id="template-preview">
                    <img src={this.props.template.url} />
                </div>
                <div className="details">
                    <div id="toprow">
                        <h5>{this.props.template.name}</h5>
                        <TemplateVoteCounter template={this.props.template} triggerTemplateDetailsUpdate={this.updateTemplateStats} />
                    </div>
                    <p>Used {this.props.template.stats.uses} times to create a meme</p>
                    <div className="chart">
                        {this.state.isLoading ? (
                            <div id="loader">
                                <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                            </div>
                        ) : ( this.state.showStats &&
                            <TemplateBarChart
                                upvotes={this.state.templateStats.upvotes}
                                downvotes={this.state.templateStats.downvotes}
                                uses={this.state.templateStats.uses}
                                date={this.state.templateStats.date}
                            />
                        )}
                        <button type="button" id="confirm-button" onClick={this.props.confirmTemplate}>Use this Template</button>
                    </div>
                </div>
            </div>
            </>
        );
    }
}
