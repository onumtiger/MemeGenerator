import React, { Component } from 'react';
import '../style/globalStyle.css';
import api from '../api';

export default class Comment extends Component {

    constructor(props) {
        super(props);
    }

    handlePost = async () => {
        const input = document.getElementById('commentInput').value;

        // TODO change when login feature merged
        let user_id = 0;
        let meme_id = this.props.id;
        let message = input;

        await api.postComment(user_id, meme_id, message).catch(err => {
            console.log('Failed to send comment: ', err);
        });

        this.props.getComments();

        document.getElementById('commentInput').value = '';
    }

    handleKeypress = e => {
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
            <div>
                <p className="commentNumber">{this.props.commentCount} comments</p>
                <div>
                    {this.props.comments.map((comment, index) => (
                        <div key={index}>
                            <div className="commentInfo">
                                <div className="commenDate">
                                    {this.getDateString(this.props.dates[index])}
                                </div>
                                <div className="userInfo"><label className="username">User_{this.props.userId[index]}</label>:</div>
                            </div>
                            <label className="commentText">{comment}</label>
                        </div>
                    ))}
                </div>
                <div className="commentContainer">
                    <input id="commentInput" placeholder="add a comment..." onKeyPress={this.handleKeypress}></input>
                    <button className="postButton" onClick={this.handlePost}>Post</button>
                </div>
            </div >
        );
    }
}