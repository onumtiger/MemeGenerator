import React, { useState } from 'react';
import '../style/globalStyle.css';

export default function Comment(props) {

    const [comments, setComments] = useState([]);
    const [commentCounter, setCommentCounter] = useState(0);

    const handlePost = () => {
        const input = document.getElementsByClassName('commentInput')[props.id].value
        setComments((prev) => {
            return [...prev, input];
        });

        setCommentCounter(prevCount => prevCount + 1);
        document.getElementsByClassName('commentInput')[props.id].value = '';
    }

    const removeComment = (targetIndex) => {
        setComments((prev) => {
            return prev.filter((comment, index) => index !== targetIndex);
        });

        setCommentCounter(prevCount => prevCount - 1);
    }

    const handleKeypress = e => {
        //triggers by pressing the enter key
        if (e.which == 13 || e.keyCode == 13) {
            handlePost();
        }
    };

    return (
        <div>
            <p className="commentNumber">{props.commentCount} comments</p>
            <div>
                {comments.map((comment, index) => (
                    <div key={index}>
                        <div className="userInfo"><label className="username">DerMemeKritiker</label> said:</div>
                        <label className="commentText">{comment}</label>
                        <div className="deleteIcon" onClick={() => removeComment(index)}>&times;</div>
                    </div>
                ))}
            </div>
            <div className="commentContainer">
                <input className="commentInput" placeholder="add a comment..." onKeyPress={handleKeypress}></input>
                <button className="postButton" onClick={handlePost}>Post</button>
            </div>
        </div >
    );
}