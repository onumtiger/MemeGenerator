import React, { Component } from 'react';
import '../style/globalStyle.css';

export default class Comment extends Component {

    constructor(props) {
        super(props);
    }

    handlePost = async () => {
        const input = document.getElementById('commentInput').value;

        let message = input;

        await this.props.postComment(message);

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
                <p className="commentNumber">{this.props.comments.length} comments</p>
                <div>
                    {this.props.comments.map((comment, index) => (
                        <div key={index}>
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
                <div className="commentContainer">
                    <input id="commentInput" placeholder="add a comment..." onKeyPress={this.handleKeypress}></input>
                    <button className="postButton" onClick={this.handlePost}>Post</button>
                </div>
            </div >
        );
    }
}