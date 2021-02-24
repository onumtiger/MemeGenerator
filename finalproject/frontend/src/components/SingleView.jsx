import React, { Component } from 'react'

import { MemeVoteCounter as Counter, MemeComment as Comment } from '.';
import MemeStatisticsChart from './MemeStatisticsChart';
import api from '../api';

import '../style/SingleView.scss';

export default class SingleView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memeStats: [],
            upvotes: [],
            downvotes: [],
            views: [],
            days: []
        }
    }

    componentDidMount = async () => {
        const meme = this.props.meme;
        const memeStats = this.state;
        let response = await api.getStatsForMeme(meme._id);
        this.state.memeStats = response.data.data;
        // this.setState({
        //     memeStats: response.data.data
        // // });
        // console.log("memestats: ", response);
        // console.log("memestats votes: ", this.state.memeStats);
        // // console.log("memestats votes: ", memeStats);

        // // for(var i; i<memeStats.length; i++) {
        // //     if(memeStats[i]._id==meme._id) {
        // //         for(var j; j<memeStats[i].days.length; j++)
        // //         this.state.upvotes = memeStats[i].days[j].upvotes;
        // //         // this.setState({
        // //         //     upvotes: memeStats[i].days[j].upvotes
        // //         // })
        // //         console.log("memestats upvotes: ", this.state.upvotes);
        // //     }
        // // }
        // console.log("memestats upvotes i=3: ", this.state.memeStats.days[3].upvotes);
        // // console.log("memestats upvotes i=3: ", memeStats[0].days[3].upvotes);

        // // for(var i; i<this.state.memeStats.length; i++) {
        // //     if(this.state.memeStats[i]._id==meme._id) {
        // for (var j; j < this.state.memeStats.days.length; j++) {
        //     // this.state.upvotes = this.state.memeStats.days[j].upvotes;
        //     this.setState({
        //         upvotes: memeStats.days[j].upvotes
        //     })
        // }
        // //     }
        // // }
        // console.log("memestats upvotes: ", this.state.upvotes);
        // console.log(meme._id)
        // let upvotesTest =[];
        // // for(var i=0; i<12; i++){
        //     upvotesTest = this.state.memeStats.days
        // // }
        //     // console.log(Object.values(upvotesTest))
        //     console.log("upvote array: ", upvotesTest)

        this.state.days = this.state.memeStats.days

        for (var i = 0; i < memeStats.days.length; i++) {
            this.state.upvotes.push(memeStats.days[i].upvotes)
            this.state.downvotes.push(memeStats.days[i].downvotes)
            this.state.views.push(memeStats.days[i].views)
        }
        console.log(this.state.upvotes)
        console.log(this.state.downvotes)
        console.log(this.state.views)
    }

    componentDidUpdate() {
        const memeStats = this.state;
        this.state.upvotes = [];
        this.state.downvotes = [];
        this.state.views = [];

        for (var i = 0; i < memeStats.days.length; i++) {
            this.state.upvotes.push(memeStats.days[i].upvotes)
            this.state.downvotes.push(memeStats.days[i].downvotes)
            this.state.views.push(memeStats.days[i].views)
        }
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
                            <td>
                                <Counter
                                    upVotes={meme.stats.upvotes.length}
                                    downVotes={meme.stats.downvotes.length}
                                    stats_id={meme.stats_id}>
                                </Counter>
                            </td>{/*upVotes={meme.stats.upVotes} downVotes={meme.stats.upVotes}*/}
                            <td><p>{meme.creationDate}</p></td>
                        </tr>
                    </tbody>
                </table>
                <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>
                <MemeStatisticsChart
                    upvotes={this.state.upvotes}
                    downvotes={this.state.downvotes}
                    views={this.state.views}
                >
                </MemeStatisticsChart>
            </div>
        )
    }
}
