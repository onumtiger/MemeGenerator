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

    const getDateString = (inputDateString) => {
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`
    }

    return (
        <div>
            <p className="commentNumber">{props.commentCount} comments</p>
            <div>
                {props.comments.map((comment, index) => (
                    <div key={index}>
                        <div className="commentInfo">
                            <div className="commenDate">
                                {getDateString(props.dates[index])}
                            </div>
                            <div className="userInfo"><label className="username">User_{props.userId[index]}</label> said:</div>
                        </div>
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