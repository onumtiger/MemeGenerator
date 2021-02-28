import React, { Component } from 'react';
import api from '../api';
import { VoteButtons } from '.';
import '../style/VoteCounter.scss';

/**
 * handling for vote-buttons
 */
export default class MemeVoteCounter extends Component {
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
     * handles downvote
     * @param {Boolean} newValue - true = vote or false = de-vote
     * @param {Number} userId - current userId
     */
    handleDownvote(newValue, userId) {
        api.toggleDownvoteMeme(this.props.meme._id, userId, newValue).then(() => {
            if (this.props.triggerMemeListUpdate) this.props.triggerMemeListUpdate();
        }).catch(err => {
            console.log('Failed to send downvotes: ', err);
        });
    }

    /**
     * handles upvote
     * @param {Boolean} newValue - true = vote or false = de-vote
     * @param {Number} userId - current userId
     */
    handleUpvote(newValue, userId) {
        api.toggleUpvoteMeme(this.props.meme._id, userId, newValue).then(() => {
            if (this.props.triggerMemeListUpdate) this.props.triggerMemeListUpdate();
        }).catch(err => {
            console.log('Failed to send upvotes: ', err);
        });
    }

    render() {
        return (
            <VoteButtons stats={this.props.meme.stats} handleUpvote={this.handleUpvote} handleDownvote={this.handleDownvote} />
        );
    }
}