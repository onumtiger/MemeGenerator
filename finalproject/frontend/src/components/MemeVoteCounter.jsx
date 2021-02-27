import React, { Component } from 'react';
import api from '../api';
import '../style/VoteCounter.scss';

export default class MemeVoteCounter extends Component {
    constructor(props) {
        super(props);

        //TODO actual userid...
        this.userId = 0;

        this.prevMemeId = null;

        this.state = {
            upvotes: this.props.meme.stats.upvotes.length,
            downvotes: this.props.meme.stats.downvotes.length,
            isUpvoted: this.props.meme.stats.upvotes.includes(this.userId),
            isDownvoted: this.props.meme.stats.downvotes.includes(this.userId),
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
        //do nothing if not logged in
        if(!this.state.loggedIn) return;

        api.toggleUpvoteMeme(this.props.meme._id, this.userId, !this.state.isUpvoted).catch(err =>{
            console.log('Failed to send upvotes: ',err);
        });
        //update in-memory meme object until we get updated data from the API
        if(this.state.isUpvoted){ //it was upvoted, now we retract that vote
            let i = this.props.meme.stats.upvotes.indexOf(this.userId);
            if(i>-1) this.props.meme.stats.upvotes.splice(i, 1);
            
            this.setState((prevState)=>({
                upvotes: prevState.upvotes-1,
                isUpvoted: false
            }))
        }else{ //it wasn't upvoted, now it will be
            this.props.meme.stats.upvotes.push(this.userId);
            
            this.setState((prevState)=>({
                upvotes: prevState.upvotes+1,
                isUpvoted: true
            }))
        }
    }

    downvote(){
        //do nothing if not logged in
        if(!this.state.loggedIn) return;
        
        api.toggleDownvoteMeme(this.props.meme._id, this.userId, !this.state.isDownvoted).catch(err =>{
            console.log('Failed to send downvotes: ',err);
        });
        //update in-memory meme object until we get updated data from the API
        if(this.state.isDownvoted){ //it was downvoted, now we retract that vote
            let i = this.props.meme.stats.downvotes.indexOf(this.userId);
            if(i>-1) this.props.meme.stats.downvotes.splice(i, 1);
            
            this.setState((prevState)=>({
                downvotes: prevState.downvotes-1,
                isDownvoted: false
            }))
        }else{ //it wasn't downvoted, now it will be
            this.props.meme.stats.downvotes.push(this.userId);

            this.setState((prevState)=>({
                downvotes: prevState.downvotes+1,
                isDownvoted: true
            }))
        }
    }

    updateValues(){
        this.setState({
            upvotes: this.props.meme.stats.upvotes.length,
            downvotes: this.props.meme.stats.downvotes.length,
            isUpvoted: this.props.meme.stats.upvotes.includes(this.userId),
            isDownvoted: this.props.meme.stats.downvotes.includes(this.userId)
        });
    }

    render(){
        if(this.props.meme._id != this.prevMemeId){
            this.prevMemeId = this.props.meme._id;
            this.updateValues();
        }

        let {upvotes, downvotes, isUpvoted, isDownvoted, loggedIn} = this.state;

        return (
            <div className="vote-counter-wrapper">
                <button className={`votebutton upvotes${loggedIn ? (isUpvoted ? ' active' : '') : ' disabled'}`} onClick={this.upvote}>↑ {upvotes}</button>
                <button className={`votebutton downvotes${loggedIn ? (isDownvoted ? ' active' : '') : ' disabled'}`} onClick={this.downvote}>↓ {downvotes}</button>
            </div>
        );
    }
}