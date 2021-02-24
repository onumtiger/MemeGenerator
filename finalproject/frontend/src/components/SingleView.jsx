import React, { Component } from 'react'
import api from '../api';

import {MemeVoteCounter as Counter, MemeComment as Comment} from '.';

import '../style/SingleView.scss';

export default class SingleView extends Component {
    constructor(props) {
        super(props);
    }

    getDateString(inputDateString){
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`;
    }

    componentDidMount(){
        const memeId = this.props.meme._id;
        api.postViewsMeme(memeId).catch(err =>{
            console.log('Failed to post views: ',err)
        });
    }


    componentDidUpdate(){
        const memeId = this.props.meme._id;
        api.postViewsMeme(memeId).catch(err =>{
            console.log('Failed to post views: ',err)
        });
    }

    render() {
        const meme = this.props.meme;

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
