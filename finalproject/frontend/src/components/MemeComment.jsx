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
            <p class="commentNumber">{props.commentCount} comments</p>
            <div>
                {comments.map((comment, index) => (
                    <div key={index}>
                        <div class="userInfo"><label class="username">DerMemeKritiker</label> said:</div>
                        <label class="commentText">{comment}</label>
                        <div class="deleteIcon" onClick={() => removeComment(index)}>&times;</div>
                    </div>
                ))}
            </div>
            <div class="commentContainer">
                <input class="commentInput" placeholder="add a comment..." onKeyPress={handleKeypress}></input>
                <button class="postButton" onClick={handlePost}>Post</button>
            </div>
        </div >
    );
}