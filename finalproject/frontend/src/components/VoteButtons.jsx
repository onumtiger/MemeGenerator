import React, { Component } from 'react';
import '../style/VoteCounter.scss';
import createTokenProvider from '../api/createTokenProvider';

export default class VoteButtons extends Component {
    constructor(props) {
        super(props);

        this.userId = createTokenProvider.userIdFromToken();
        this.loggedIn = createTokenProvider.isLoggedIn();

        this.values = this.getValues();

        //this binding for React event handlers
        [
            'upvote',
            'downvote',
            'forceUpdate',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    upvote(){
        //do nothing if not logged in
        if(!this.loggedIn) return;

        //update in-memory object until we get updated data from the API
        if(this.values.isUpvoted){ //it was upvoted, now we retract that vote
            let i = this.props.stats.upvotes.indexOf(this.userId);
            if(i>-1) this.props.stats.upvotes.splice(i, 1);
            
            this.values = this.getValues();

            this.props.handleUpvote(false, this.userId);
        }else{ //it wasn't upvoted, now it will be
            this.props.stats.upvotes.push(this.userId);
            
            this.values = this.getValues();

            this.props.handleUpvote(true, this.userId);
        }

        this.forceUpdate();
    }

    downvote(){
        //do nothing if not logged in
        if(!this.loggedIn) return;

        //update in-memory object until we get updated data from the API
        if(this.values.isDownvoted){ //it was downvoted, now we retract that vote
            let i = this.props.stats.downvotes.indexOf(this.userId);
            if(i>-1) this.props.stats.downvotes.splice(i, 1);
            
            this.values = this.getValues();

            this.props.handleDownvote(false, this.userId);
        }else{ //it wasn't downvoted, now it will be
            this.props.stats.downvotes.push(this.userId);

            this.values = this.getValues();

            this.props.handleDownvote(true, this.userId);
        }

        this.forceUpdate();
    }

    getValues(){
        return{
            upvotes: this.props.stats.upvotes.length,
            downvotes: this.props.stats.downvotes.length,
            isUpvoted: this.props.stats.upvotes.includes(this.userId),
            isDownvoted: this.props.stats.downvotes.includes(this.userId)
        };
    }

    render(){
        let {upvotes, downvotes, isUpvoted, isDownvoted} = this.getValues();

        return (
            <div className="vote-counter-wrapper">
                <button className={`votebutton upvotes${this.loggedIn ? (isUpvoted ? ' active' : '') : ' disabled'}`} onClick={this.upvote}>↑ {upvotes}</button>
                <button className={`votebutton downvotes${this.loggedIn ? (isDownvoted ? ' active' : '') : ' disabled'}`} onClick={this.downvote}>↓ {downvotes}</button>
            </div>
        );
    }
}