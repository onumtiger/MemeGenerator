import React, { Component } from 'react';
import api from '../api';
import Read from '../speech/read'

import { MemeVoteCounter, MemeComment } from '.';
import MemeStatisticsChart from './MemeStatisticsChart';

import '../style/SingleView.scss';

export default class SingleView extends Component {

    
    

    constructor(props) {
        super(props);

        //this binding for React event handlers
        [
            'handleShareURLClick',
            'handleDownloadClick',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });

        this.state = {
            commentMessages: null,
            commentIds: null, 
            upvotes: [],
            downvotes: [],
            views: [],
            date: [],
            showStats: false
        }
        this.previousMemeId = null;
        //this.readButton = null;
    }

    componentDidMount(){
        let readButton = document.querySelector('.read-button');
        readButton.addEventListener('click', (e)=>{
            console.log("clicked")
            let templateDescription = this.props.meme.template_name
            let captions = ""
            for(let i=0; i<this.props.meme.captions.length; i++){
                captions = captions+". "+this.props.meme.captions[i];
            }
            let read = "Title. "+this.props.meme.name+". Image captions: "+captions+". Template description: "+templateDescription
            Read.readEnglish(read)
        });
    }

    getDateString(inputDateString) {
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`;
    }

    handleShareURLClick(e) {
        e.target.select();
        document.execCommand('copy');
    }

    handleDownloadClick(e) {
        //normally, we could just download the file with the download attribute. However, the request proxying we use for all links to the static server content at the API URL does not seem to work for these requests and we can't pass the API URL directly because it is not from the same Origin as the frontend and that means the download attribute no longer works. So we take the long way around:

        //create virtual canvas element
        let canvas = document.createElement('canvas');

        //get the image and apply its dimensions to the canvas
        let img = document.querySelector('#single-view-wrapper #meme-img');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        //draw the image to the canvas
        let c = canvas.getContext('2d');
        c.drawImage(img, 0, 0);

        //compute the dataURL and apply it to the anchor element
        let url = canvas.toDataURL();
        e.target.href = url;
    }

    /**
     * get comments for meme
     */
    getComments = async () => {
        const meme = this.props.meme;
        console.log("SEND MEME ID: ", meme._id)
        let response = await api.getCommentsByMemeId(meme._id);
        console.log("RESPONSE", response)
        
        let messages = response.data.data[0].message;
        let ids = response.data.data[0].user_id;
        console.log(messages)
        console.log(ids)
        this.setState({
            commentMessages: messages,
            commentIds: ids
        })
    }

    /**
     * get meme stats to display in the charts
     */
    getMemeStats = async () => {
        this.setState({
            showStats: false
        });

        //get the stats of the current meme
        const meme = this.props.meme;
        let response = await api.getStatsForMeme(meme._id);
        let memeStats = response.data.data.days;

        //create empty arrays to fill in later
        var upvotes = [];
        var downvotes = [];
        var views = [];
        var date = [];

        var x = memeStats.length - Math.min(memeStats.length, 14);
        //push all last 14 days values in the respective empty array
        for (var i = x; i < memeStats.length; i++) {
            console.log("index: ", i, memeStats.length)
            upvotes.push(memeStats[i].upvotes);
            downvotes.push(memeStats[i].downvotes);
            views.push(memeStats[i].views);
            date.push(memeStats[i].date)
        }

        //update the states with the new arrays and values
        this.setState({
            upvotes: upvotes,
            downvotes: downvotes,
            views: views,
            date: date,
            showStats: true
        })
    }

    //triggers a +1 view in db
    sendView(memeId) {
        console.log("send view for id: ", memeId);
        api.viewMeme(memeId).catch(err => {
            console.log('Failed to post views: ', err);
        });
        this.props.meme.stats.views++; //update in-memory meme object until we get updated data from the API
    }

    render() {
        const meme = this.props.meme;


        //check if we're displaying a new meme (as opposed to other re-renders without content changes)
        if (this.previousMemeId != meme._id) {
            this.previousMemeId = meme._id;
            this.getMemeStats(); //get detailed stats data for charts
            this.getComments(); // get comments
            this.sendView(meme._id); // increment views, the check above prevents double counting
        }

        return (
            <div id="single-view-wrapper">
                <p id="meme-title">{meme.name}</p>
                <button type="button" className="read-button" title="read caption">read title and captions</button>
                <hr />
                <img id="meme-img" src={meme.url} alt={meme.name}></img>
                <table id="stats-table">
                    <tbody>
                        <tr>
                            <td><p>{meme.stats.views} views</p></td>
                            <td><MemeVoteCounter meme={meme} /></td>
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
                <MemeComment id={meme._id} commentCount={meme.comment_ids.length} comments={this.state.commentMessages} />
                {this.state.showStats && (<MemeStatisticsChart
                    upvotes={this.state.upvotes}
                    downvotes={this.state.downvotes}
                    views={this.state.views}
                    date={this.state.date}
                    sumUpvotes={meme.stats.upvotes.length}
                    sumDownvotes={meme.stats.downvotes.length}
                    sumViews={meme.stats.views}
                    getAllOtherViews={this.props.getAllOtherViews}
                />)}
            </div>
        )
    }
}
