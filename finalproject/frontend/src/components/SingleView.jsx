import React, { Component } from 'react'
import api from '../api';

import { MemeVoteCounter as Counter, MemeComment as Comment } from '.';
import MemeStatisticsChart from './MemeStatisticsChart';

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

    getDateString(inputDateString) {
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`;
    }

    componentDidMount = async () => {
        const memeId = this.props.meme._id;
        api.postViewsMeme(memeId).catch(err => {
            console.log('Failed to post views: ', err)
        });

        const meme = this.props.meme;
        const memeStats = this.state;
        let response = await api.getStatsForMeme(meme._id);
        this.state.memeStats = response.data.data;
        this.state.days = this.state.memeStats.days;

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
        const memeId = this.props.meme._id;
        api.postViewsMeme(memeId).catch(err => {
            console.log('Failed to post views: ', err)
        });

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
                            </td>
                            <td><p>{this.getDateString(meme.creationDate)}</p></td>
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
