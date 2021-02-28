import React, { Component } from 'react';
import api from '../api';
import {VoteButtons} from '.';
import '../style/VoteCounter.scss';

export default class TemplateVoteCounter extends Component {
    constructor(props) {
        super(props);

        //this binding for React event handlers
        [
            'handleDownvote',
            'handleUpvote',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    handleDownvote(newValue, userId){
        api.toggleDownvoteTemplate(this.props.template._id, userId, newValue).then(()=>{
            this.props.triggerTemplateDetailsUpdate();
        }).catch(err =>{
            console.log('Failed to send downvotes: ',err);
        });
    }

    handleUpvote(newValue, userId){
        api.toggleUpvoteTemplate(this.props.template._id, userId, newValue).then(()=>{
            this.props.triggerTemplateDetailsUpdate();
        }).catch(err =>{
            console.log('Failed to send upvotes: ',err);
        });
    }

    render(){
        return (
            <VoteButtons stats={this.props.template.stats} handleUpvote={this.handleUpvote} handleDownvote={this.handleDownvote} />
        );
    }
}