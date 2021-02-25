import React, { Component } from 'react';
import api from '../api';

import {MemeVoteCounter as Counter, MemeComment as Comment} from '.';

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
    }

    getDateString(inputDateString){
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
                <p id="meme-title">{meme.name}</p>
                <hr />
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
                <hr />
                <div id="share-options">
                    <p>
                    <a onClick={this.handleDownloadClick} href="#" download={meme.name} id="download-btn">Download this Meme</a>
                    or share the link to it on social media:</p>
                    <input type="text" id="meme-url-input" title="Click to Copy" value={window.location.toString()} onClick={this.handleShareURLClick} />
                    <a href="https://www.facebook.com/" target="_blank" title="Go to Facebook" className="social-icon-link"><img src="/ui/social-fb.png" alt="Facebook" /></a>
                    <a href="https://twitter.com/" target="_blank" title="Go to Twitter" className="social-icon-link"><img src="/ui/social-tw.png" alt="Twitter" /></a>
                    <a href="https://www.instagram.com/" target="_blank" title="Go to Instagram" className="social-icon-link"><img src="/ui/social-ig.png" alt="Instagram" /></a>
                    <p id="legal">TWITTER, TWEET, RETWEET and the Twitter Bird logo are trademarks of Twitter Inc. or its affiliates. Facebook and Instagram trademark logos owned by Facebook and its affiliate companies.</p>
                </div>
                <hr />
                <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>
            </div>
        )
    }
}
