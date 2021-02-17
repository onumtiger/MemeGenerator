import React, { useState } from 'react';
import '../style/globalStyle.css';

export default function Comment() {

    const [comments, setComments] = useState([]);
    const [commentCounter, setCommentCounter] = useState(0);

    const handlePost = () => {
        const input = document.getElementById('commentContainer').querySelector('#commentInput').value
        setComments((prev) => {
            return [input, ...prev];
        });

        setCommentCounter(prevCount => prevCount + 1);
        document.getElementById('commentInput').value='';
    }

    const removeComment = (targetIndex) => {
        setComments((prev) => {
            return prev.filter((comment, index) => index !== targetIndex);
        });

        setCommentCounter(prevCount => prevCount - 1);
    }

    return (
        <div>
            <p>{commentCounter} comments</p>
            <ul>
                {comments.map((comment, index) => (
                    <li onClick={() => removeComment(index)} key={index}>
                        {comment}
                        <div class="deleteIcon">&times;</div>
                    </li>
                ))}
            </ul>
            <div id="commentContainer">
                <input id="commentInput" placeholder="add a comment..."></input>
                <button onClick={handlePost}>Post</button>
            </div>
        </div >
    );
}