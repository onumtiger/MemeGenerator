import React, { Component } from 'react';
import api from '../api';

import { MemeVoteCounter as Counter, MemeComment as Comment } from '.';
import MemeStatisticsChart from './MemeStatisticsChart';

import '../style/SingleView.scss';

export default class SingleView extends Component {
    constructor(props) {
        super(props);

        //this binding for React event handlers
        [
            'handleShareURLClick',
            'handleDownloadClick',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
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

    handleShareURLClick(e){
        e.target.select();
        document.execCommand('copy');
    }

    handleDownloadClick(e){
        //normally, we could just download the file with the download attribute. However, the request proxying we use for all links to the static server content at the API URL does not seem to work for these requests and we can't pass the API URL directly because it is not from the same Origin as the frontend and that means the download attribute no longer works. So we take the long way around:
        
        //create virtual canvas element
        let canvas = document.createElement('canvas');

        //get the image and apply its dimensions to the canvas
        let img = document.querySelector('#single-view-wrapper #meme-img');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        //draw the image to the canvas
        let c = canvas.getContext('2d');
        c.drawImage(img, 0,0);

        //compute the dataURL and apply it to the anchor element
        let url = canvas.toDataURL();
        e.target.href = url;
    }

    getMemeStats = async () => {
        try{
            this.setState({
                showStats: false
            });
            
            const meme = this.props.meme;
            let response = await api.getStatsForMeme(meme._id);
            let memeStats = response.data.data.days;

            var upvotes = [];
            var downvotes = [];
            var views = [];

            for (var i = 0; i < memeStats.length; i++) {
                upvotes.push(memeStats[i].upvotes);
                downvotes.push(memeStats[i].downvotes);
                views.push(memeStats[i].views);
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
        }catch(err){
            console.log('Failed to get Stats: ',err);
        }
    }

    //triggers a +1 view in db
    sendView(memeId){
        console.log("send view for id: ", memeId);
        api.postViewMeme(memeId).catch(err =>{
            console.log('Failed to post views: ',err);
        });
        this.props.meme.stats.views++; //update in-memory meme object until we get updated data from the API
    }


    render() {
        const meme = this.props.meme;

        //check if we're displaying a new meme (as opposed to other re-renders without content changes)
        if (this.previousMemeId != meme._id) {
            this.previousMemeId = meme._id;
            this.getMemeStats(); //get detailed stats data for charts
            this.sendView(meme._id); // increment views, the check above prevents double counting
        }

        return (
            <div id="single-view-wrapper">
                <p id="meme-title">{meme.name}</p>
                <hr />
                <img id="meme-img" src={meme.url} alt={meme.name}></img>
                <table id="stats-table">
                    <tbody>
                        <tr>
                            <td><p>{meme.stats.views} views</p></td>
                            <td><Counter upVotes={meme.stats.upvotes.length} downVotes={meme.stats.downvotes.length}></Counter></td>
                            <td><p>{this.getDateString(meme.creationDate)}</p></td>
                        </tr>
                    </tbody>
                </table>
                <hr />
                <div id="share-options">
                    <p>
                        <a onClick={this.handleDownloadClick} href="#" download={meme.name} id="download-btn">Download this Meme</a>
                        or share the link to it on social media:
                    </p>
                    <input type="text" id="meme-url-input" title="Click to Copy" value={window.location.toString()} onClick={this.handleShareURLClick} readOnly />
                    <a href="https://www.facebook.com/" target="_blank" title="Go to Facebook" className="social-icon-link"><img src="/ui/social-fb.png" alt="Facebook" /></a>
                    <a href="https://twitter.com/" target="_blank" title="Go to Twitter" className="social-icon-link"><img src="/ui/social-tw.png" alt="Twitter" /></a>
                    <a href="https://www.instagram.com/" target="_blank" title="Go to Instagram" className="social-icon-link"><img src="/ui/social-ig.png" alt="Instagram" /></a>
                    <p id="legal">TWITTER, TWEET, RETWEET and the Twitter Bird logo are trademarks of Twitter Inc. or its affiliates. Facebook and Instagram trademark logos owned by Facebook and its affiliate companies.</p>
                </div>
                <hr />
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
