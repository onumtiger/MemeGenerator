import React, { Component } from 'react'
import api from '../api';

import { MemeVoteCounter as Counter, MemeComment as Comment } from '.';
import MemeStatisticsChart from './MemeStatisticsChart';

import '../style/SingleView.scss';

export default class SingleView extends Component {

    

    constructor(props) {
        super(props);
        this.state = {
            upvotes: [],
            downvotes: [],
            views: [],
            showStats: false
        }
        this.previousMemeId = null;
    }

    getDateString(inputDateString) {
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`;
    }

    getMemeStats = async () => {
        this.setState({
            showStats: false
        })
        let memeStats = [];
        const meme = this.props.meme;
        let response = await api.getStatsForMeme(meme._id);
        memeStats = response.data.data.days;

        var upvotes = [];
        var downvotes = [];
        var views = [];

        for (var i = 0; i < memeStats.length; i++) {
            upvotes.push(memeStats[i].upvotes)
            downvotes.push(memeStats[i].downvotes)
            views.push(memeStats[i].views)
        }

        this.setState({
            upvotes: upvotes,
            downvotes: downvotes,
            views: views,
            showStats: true
        })

        console.log(this.state.upvotes)
        console.log(this.state.downvotes)
        console.log(this.state.views)
    }

    //triggers a +1 view in db
    sendView(memeId){
        console.log("send view for id: ", memeId)
        api.postViewMeme(memeId).catch(err =>{
            console.log('Failed to post views: ',err)
        });
        this.props.meme.stats.views++
        
    }


    render() {
        const meme = this.props.meme;

        if (this.previousMemeId != meme._id) {
            this.previousMemeId = meme._id;
            this.getMemeStats();
        }
        
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
                            <td>
                                <Counter
                                    upVotes={meme.stats.upvotes.length}
                                    downVotes={meme.stats.downvotes.length}
                                    stats_id={meme.stats_id}>
                                </Counter>
                            </td>
                            <td><p>{this.getDateString(meme.creationDate)}</p></td>
                        </tr>
                    </tbody>
                </table>
                <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>
                {this.state.showStats && (<MemeStatisticsChart
                    upvotes={this.state.upvotes}
                    downvotes={this.state.downvotes}
                    views={this.state.views}
                >
                </MemeStatisticsChart>)}
            </div>
        )
    }
}
