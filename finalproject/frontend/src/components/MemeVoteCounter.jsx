import React, { useState } from 'react';
import api from '../api';
import '../style/globalStyle.css';



export default function Counter(props) {

    //counter for upVotes
    const [upVote, setUpVote] = useState(props.upVotes);
    const incrementUpVotes = () => setUpVote(prevCount => prevCount + 1);

    //counter for downVotes
    const [downVote, setDownVote] = useState(props.downVotes);
    const incrementDownVotes = () => setDownVote(prevCount => prevCount + 1);

    function updateCounterIntoDB(){
        console.log("1. Trying hard to update")
        api.patchMeme((
            {
            _id: 0, 
            toUpdate: {stats: {upvotes: [300]}},
        }), 
        (0)
        )
    }


    return (
        <div>
            <button className="upVotes" onClick={incrementUpVotes, updateCounterIntoDB}>↑ {upVote}</button>
            <button className="downVotes" onClick={incrementDownVotes}>↓ {downVote}</button>
        </div>
    );
}