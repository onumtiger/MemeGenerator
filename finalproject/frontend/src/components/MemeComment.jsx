import React, { Component } from 'react';
import '../style/globalStyle.css';
import api from '../api';

export default class Comment extends Component {

    constructor(props) {
        super(props);
        

        this.state = {
        }
    }

    handlePost = async () => {
        const input = document.getElementById('commentInput').value;
        
        let refreshedComments = this.props.comments
        refreshedComments.push(input)
        this.state.comments = refreshedComments;

        // TODO change when login feature merged
        let user_id=0;
        let comment=input
        let meme_id = this.props.id

        console.log("user id", user_id);
        console.log("comment", comment)
        console.log("meme_id", meme_id)

        await api.postComment(user_id, meme_id, comment).catch(err =>{
            console.log('Failed to send comment: ',err);
        });

        document.getElementById('commentInput').value = '';
    }

    removeComment = (targetIndex) => {
        // setComments((prev) => {
        //     return prev.filter((comment, index) => index !== targetIndex);
        // });

        // setCommentCounter(prevCount => prevCount - 1);
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
                            {/* <div className="deleteIcon" onClick={() => removeComment(index)}>&times;</div> */}
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