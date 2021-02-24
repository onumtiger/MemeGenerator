import React, { Component } from 'react'
import api from '../api';

import {MemeVoteCounter as Counter, MemeComment as Comment} from '.';

import '../style/SingleView.scss';

export default class SingleView extends Component {

    

    constructor(props) {
        super(props);
        this.previousMemeId = null
    }

    getDateString(inputDateString){
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`;
    }

    

    //triggers a +1 view in db
    sendView(memeId){
        console.log("send view for id: ", memeId)
        api.postViewMeme(memeId).catch(err =>{
            console.log('Failed to post views: ',err)
        });
    }


    render() {
        const meme = this.props.meme;

        //prevents double counting 
        if(!(this.previousMemeId == meme._id) && (this.previousMemeId != null)){
            console.log("old previousMemeId: ", this.previousMemeId)
            console.log("current meme._id: ", meme._id)
            this.previousMemeId = meme._id
            console.log("new previousMemeId: ", this.previousMemeId)
            this.sendView(meme._id)
        } else if (this.previousMemeId == null){
            console.log("first send!")
            console.log("previousMemeId: ", this.previousMemeId)
            this.previousMemeId = meme._id
            this.sendView(meme._id)
        }

        return (
            <div id="single-view-wrapper">
                <div id="meme-title">
                    <span>{meme.name} // </span>
                </div>
                <img id="meme-img" src={meme.url} alt={meme.name}></img>
                <table id="stats-table">
                    <tbody>
                    <tr>
                        <td><p>{meme.stats.views} views</p></td>
                        <td><Counter upVotes={meme.stats.upvotes.length} downVotes={meme.stats.downvotes.length} stats_id={meme.stats_id}></Counter></td>
                        <td><p>{this.getDateString(meme.creationDate)}</p></td>
                    </tr>
                    </tbody>
                </table>
                <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>
            </div>
        )
    }
}
