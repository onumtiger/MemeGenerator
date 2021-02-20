import React, { useState } from 'react';
import api from '../api';
import '../style/globalStyle.css';



export default function Counter(props) {

    //counter for upVotes
    const [upVote, setUpVote] = useState(0);
    const incrementUpVotes = () => setUpVote(prevCount => prevCount + 1);

    //counter for downVotes
    const [downVote, setDownVote] = useState(0);
    const incrementDownVotes = () => setDownVote(prevCount => prevCount + 1);

    const updateDataBase = async () => {
        api.updateStatsById()
    }
    

    return (
        <div>
            <button class="upVotes" onClick={incrementUpVotes, updateDataBase}>↑ {props.upVotes}</button>
            <button class="downVotes" onClick={incrementDownVotes, updateDataBase}>↓ {props.downVotes}</button>
        </div>
    );
}