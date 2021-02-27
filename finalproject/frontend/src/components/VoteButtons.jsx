import React, { Component } from 'react';
import '../style/VoteCounter.scss';

export default class VoteButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            upvotes: this.props.stats.upvotes.length,
            downvotes: this.props.stats.downvotes.length,
            isUpvoted: this.props.stats.upvotes.includes(this.userId),
            isDownvoted: this.props.stats.downvotes.includes(this.userId),
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
        if(!this.props.loggedIn) return;

        //update in-memory object until we get updated data from the API
        if(this.state.isUpvoted){ //it was upvoted, now we retract that vote
            let i = this.props.stats.upvotes.indexOf(this.userId);
            if(i>-1) this.props.stats.upvotes.splice(i, 1);
            
            this.setState((prevState)=>({
                upvotes: prevState.upvotes-1,
                isUpvoted: false
            }))
            this.props.handleUpvote(false);
        }else{ //it wasn't upvoted, now it will be
            this.props.stats.upvotes.push(this.userId);
            
            this.setState((prevState)=>({
                upvotes: prevState.upvotes+1,
                isUpvoted: true
            }))
            this.props.handleUpvote(true);
        }
    }

    downvote(){
        //do nothing if not logged in
        if(!this.props.loggedIn) return;

        //update in-memory object until we get updated data from the API
        if(this.state.isDownvoted){ //it was downvoted, now we retract that vote
            let i = this.props.stats.downvotes.indexOf(this.userId);
            if(i>-1) this.props.stats.downvotes.splice(i, 1);
            
            this.setState((prevState)=>({
                downvotes: prevState.downvotes-1,
                isDownvoted: false
            }))
            this.props.handleDownvote(false);
        }else{ //it wasn't downvoted, now it will be
            this.props.stats.downvotes.push(this.userId);

            this.setState((prevState)=>({
                downvotes: prevState.downvotes+1,
                isDownvoted: true
            }))
            this.props.handleDownvote(true);
        }
    }

    // updateValues(){
    //     this.setState({
    //         upvotes: this.props.meme.stats.upvotes.length,
    //         downvotes: this.props.meme.stats.downvotes.length,
    //         isUpvoted: this.props.meme.stats.upvotes.includes(this.userId),
    //         isDownvoted: this.props.meme.stats.downvotes.includes(this.userId)
    //     });
    // }

    render(){
        // this.updateValues();

        let {upvotes, downvotes, isUpvoted, isDownvoted} = this.state;
        let {loggedIn} = this.props;

        return (
            <div className="vote-counter-wrapper">
                <button className={`votebutton upvotes${loggedIn ? (isUpvoted ? ' active' : '') : ' disabled'}`} onClick={this.upvote}>↑ {upvotes}</button>
                <button className={`votebutton downvotes${loggedIn ? (isDownvoted ? ' active' : '') : ' disabled'}`} onClick={this.downvote}>↓ {downvotes}</button>
            </div>
        );
    }
}