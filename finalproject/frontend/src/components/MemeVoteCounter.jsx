import React, { useState } from 'react';
import api from '../api';
import '../style/globalStyle.css';



export default function Counter(props) { 

    //counter for upVotes
    const [upVote, setUpVote] = useState(props.upVotes);
    const incrementUpVotes = () => {
        if(upVote <= props.upVotes){
            
                //TODO: check if user id already in one of the memes vote list and only apply if not so
                setUpVote(prevCount => prevCount + 1);
                sendUpvotes()
            
        }
    }

    //counter for downVotes
    const [downVote, setDownVote] = useState(props.downVotes);
    const incrementDownVotes = () => {
        if(downVote <= props.downVotes){
            
                //TODO: check if user id already in one of the memes vote list and only apply if not so
                setDownVote(prevCount => prevCount + 1);
                sendDownvotes()
            
        }
    }

    function sendUpvotes(){
        //updates upvotes with user id (toUpdate) and according meme_id
        api.postUpvotesMeme(({toUpdate: 9}),(0)).catch(err =>{
            console.log('Failed to send upvotes: ',err)
        });
    }

    function sendDownvotes(){
        //updates downvotes with user id (toUpdate) and according meme_id
        api.postDownvotesMeme(({toUpdate: 9}),(0)).catch(err =>{
            console.log('Failed to send downvotes: ',err)
        });
    }

    return (
        <div>
            <button className="upVotes" onClick={incrementUpVotes}>↑ {upVote}</button>
            <button className="downVotes" onClick={incrementDownVotes}>↓ {downVote}</button>
        </div>
    );
}