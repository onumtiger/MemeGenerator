import React, { Component } from 'react';
import api from '../api';
import {VoteButtons} from '.';
import '../style/VoteCounter.scss';

/**
 * voting for template
 */
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

    /**
     * handle downvote 
     * @param {Number} newValue -> votes
     */
    handleDownvote(newValue){
        api.toggleDownvoteTemplate(this.props.template._id, this.userId, newValue).then(()=>{
            this.props.triggerTemplateDetailsUpdate();
        }).catch(err =>{
            console.log('Failed to send downvotes: ',err);
        });
    }

    /**
     * handle upvote
     * @param {Number} newValue -> votes
     */
    handleUpvote(newValue){
        api.toggleUpvoteTemplate(this.props.template._id, this.userId, newValue).then(()=>{
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