import React, { Component } from 'react';
import api from '../api';
import '../style/VoteCounter.scss';

export default class MemeVoteCounter extends Component {
    constructor(props) {
        super(props);

        //TODO actual userid...
        this.userId = 0;

        this.state = {
            upvotes: this.props.meme.stats.upvotes.length,
            downvotes: this.props.meme.stats.downvotes.length,
            isUpvoted: this.props.meme.stats.upvotes.includes(userId),
            isDownvoted: this.props.meme.stats.upvotes.includes(userId),
            loggedIn: this.userId!=null //TODO adapt to login logic (check for ID -1 / ...)
        };

        //this binding for React event handlers
        [
            'upvote',
            'downvote',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    upvote(){
        //do nothing if already upvoted
        if(this.state.isUpvoted || !this.state.loggedIn) return;

        api.upvoteMeme(this.props.meme._id, this.userId).catch(err =>{
            console.log('Failed to send upvotes: ',err);
        });
        //update in-memory meme object until we get updated data from the API
        this.props.meme.stats.upvotes.push(this.userId);
        this.setState((prevState)=>({
            upvotes: prevState.upvotes+1,
            isUpvoted: true
        }))
    }

    downvote(){
        //do nothing if already downvoted
        if(this.state.isDownvoted || !this.state.loggedIn) return;
        
        api.upvoteMeme(this.props.meme._id, this.userId).catch(err =>{
            console.log('Failed to send downvotes: ',err);
        });
        //update in-memory meme object until we get updated data from the API
        this.props.meme.stats.downvotes.push(this.userId);
        this.setState((prevState)=>({
            downvotes: prevState.downvotes+1,
            isDownvoted: true
        }))
    }

    render(){
        let {upvotes, downvotes, isUpvoted, isDownvoted, loggedIn} = this.state;

        return (
            <div className="vote-counter-wrapper">
                <button className={`votebutton upvotes${loggedIn ? (isUpvoted ? ' active' : '') : ' disabled'}`} onClick={this.upvote}>↑ {upvotes}</button>
                <button className={`votebutton downvotes${loggedIn ? (isDownvoted ? ' active' : '') : ' disabled'}`} onClick={this.downvote}>↓ {downvotes}</button>
            </div>
        );
    }
}