import React, { Component } from 'react';
import api from '../api';
import {VoteButtons} from '.';
import '../style/VoteCounter.scss';

export default class MemeVoteCounter extends Component {
    constructor(props) {
        super(props);

        //TODO actual userid...
        this.userId = 0;

        //this binding for React event handlers
        [
            'handleDownvote',
            'handleUpvote',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    handleDownvote(newValue){
        api.toggleDownvoteMeme(this.props.meme._id, this.userId, newValue).catch(err =>{
            console.log('Failed to send downvotes: ',err);
        });
        if(this.props.triggerMemeListUpdate) this.props.triggerMemeListUpdate();
    }

    handleUpvote(newValue){
        api.toggleUpvoteMeme(this.props.meme._id, this.userId, newValue).catch(err =>{
            console.log('Failed to send upvotes: ',err);
        });
        if(this.props.triggerMemeListUpdate) this.props.triggerMemeListUpdate();
    }

    render(){
        return (
            <VoteButtons stats={this.props.meme.stats} handleUpvote={this.handleUpvote} handleDownvote={this.handleDownvote} loggedIn={this.userId!=null} /> //TODO logged in logic
        );
    }
}