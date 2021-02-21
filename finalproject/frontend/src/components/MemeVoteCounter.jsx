import React, { useState } from 'react';
import api from '../api';
import imageManipulation from '../api/imageManipulation'
import '../style/globalStyle.css';



export default function Counter(props) {

    //counter for upVotes
    const [upVote, setUpVote] = useState(props.upVotes);
    const incrementUpVotes = () => {
        if(upVote <= props.upVotes){
            setUpVote(prevCount => prevCount + 1);
            sendUpvotes()
        }
    }

    //counter for downVotes
    const [downVote, setDownVote] = useState(props.downVotes);
    const incrementDownVotes = () => {
        if(downVote <= props.downVotes){
            setDownVote(prevCount => prevCount + 1);
            sendDownvotes()
        }
    }

    function sendUpvotes(){
        //updates upvotes with user id (toUpdate) and according meme_id
        api.postUpvotesMeme(({toUpdate: 9}),(0))
    }

    function sendDownvotes(){
        //updates downvotes with user id (toUpdate) and according meme_id
        api.postDownvotesMeme(({toUpdate: 9}),(0))
    }

    return (
        <div>
            <button className="upVotes" onClick={incrementUpVotes}>↑ {upVote}</button>
            <button className="downVotes" onClick={incrementDownVotes}>↓ {downVote}</button>
        </div>
    );
}