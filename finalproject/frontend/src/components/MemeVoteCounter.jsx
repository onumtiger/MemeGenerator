import React, { useState } from 'react';
import '../style/globalStyle.css';

export default function Counter() {

    //counter for upVotes
    const [upVote, setUpVote] = useState(0);
    const incrementUpVotes = () => setUpVote(prevCount => prevCount + 1);

    //counter for downVotes
    const [downVote, setDownVote] = useState(0);
    const incrementDownVotes = () => setDownVote(prevCount => prevCount + 1);

    return (
        <div>
            <button class="upVotes" onClick={incrementUpVotes}>↑ {upVote}</button>
            <button class="downVotes" onClick={incrementDownVotes}>↓ {downVote}</button>
        </div>
    );
}