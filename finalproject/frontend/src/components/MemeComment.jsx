import React, { Component } from 'react';
import '../style/MemeComment.scss';
import createTokenProvider from '../api/createTokenProvider';

export default class Comment extends Component {

    constructor(props) {
        super(props);
        this.userId = createTokenProvider.userIdFromToken();
        this.loggedIn = createTokenProvider.isLoggedIn();
    }

    handlePost = async () => {
        if(!this.loggedIn) return;

        const input = document.getElementById('commentInput').value;

        let message = input;

        await this.props.postComment(message);

        document.getElementById('commentInput').value = '';
    }

    handleKeypress = e => {
        if(!this.loggedIn) return;
        //triggers by pressing the enter key
        if (e.which == 13 || e.keyCode == 13) {
            this.handlePost();
        }
    };

    getDateString = (inputDateString) => {
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`
    }

    render() {
        return (
            <div id="comments-wrapper">
                <p className="commentNumber">{this.props.comments.length} comments</p>
                <div id="existing-comments-container">
                    {this.props.comments.map((comment, index) => (
                        <div key={index} className="commentContainer">
                            <div className="commentInfo">
                                <div className="commentDate">
                                    {this.getDateString(comment.creationDate)}
                                </div>
                                <div className="userInfo"><label className="username">{comment.user_name}</label>:</div>
                            </div>
                            <label className="commentText">{comment.message}</label>
                        </div>
                    ))}
                </div>
                <div className="postContainer">
                    <input id="commentInput" disabled={!this.loggedIn} placeholder={this.loggedIn ? 'Add a comment...' : 'You have to log in to post comments'} onKeyPress={this.handleKeypress}></input>
                    <button id="postButton" onClick={this.handlePost} className={this.loggedIn ? '' : 'disabled'} title={this.loggedIn ? 'Post your comment' : 'You have to log in to post comments'}>Post</button>
                </div>
            </div >
        );
    }
}