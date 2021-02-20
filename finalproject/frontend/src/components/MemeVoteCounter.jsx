import React, { useState } from 'react';
import api from '../api';
import '../style/globalStyle.css';



export default function Counter(props) {

    //counter for upVotes
    const [upVote, setUpVote] = useState(props.upVotes);
    //setUpVote(prevCount => prevCount + props.upVotes);
    const incrementUpVotes = () => setUpVote(prevCount => prevCount + 1);

    //counter for downVotes
    const [downVote, setDownVote] = useState(props.downVotes);
    const incrementDownVotes = () => setDownVote(prevCount => prevCount + 1);


    return (
        <div>
            <button class="upVotes" onClick={incrementUpVotes}>↑ {upVote}</button>
            <button class="downVotes" onClick={incrementDownVotes}>↓ {downVote}</button>
        </div>
    );
}