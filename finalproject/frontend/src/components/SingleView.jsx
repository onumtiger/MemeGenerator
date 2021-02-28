import React, { Component } from 'react';
import api from '../api';
import Read from '../speech/read'
import { MemeVoteCounter, MemeComment } from '.';
import MemeStatisticsChart from './MemeStatisticsChart';
import '../style/SingleView.scss';

/**
 * SingleView: displaying one meme and its information; integrated in SlideShow
 */
export default class SingleView extends Component {
    constructor(props) {
        super(props);

        //this binding for React event handlers
        [
            'handleShareURLClick',
            'handleDownloadClick',
            'updateSingleView',
            'postComment',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });

        this.state = {
            upvotes: [],
            downvotes: [],
            views: [],
            date: [],
            showStats: false,
            comments: []
        }
        this.previousMemeId = null;
    }

    /**
     * handles read button click
     */
    componentDidMount() {
        let readButton = document.querySelector('.read-button');
        readButton.addEventListener('click', (e) => {
            console.log("clicked")
            let templateDescription = this.props.meme.template_name
            let captions = ""
            for (let i = 0; i < this.props.meme.captions.length; i++) {
                captions = captions + ". " + this.props.meme.captions[i];
            }
            let read = "Title. " + this.props.meme.name + ". Image captions: " + captions + ". Template description: " + templateDescription
            Read.readEnglish(read)
        });
    }

    /**
     * displays the date (yyyy/mm/dd) as another notation
     * @param {String} inputDateString - date String
     * @returns {String} - date in the format: dd.mm.yyy
     */
    getDateString(inputDateString) {
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`;
    }

    /**
     * share url after click
     * @param {Event} e 
     */
    handleShareURLClick(e) {
        e.target.select();
        document.execCommand('copy');
    }

    /**
     * handles download button
     * @param {Event} e 
     */
    handleDownloadClick(e) {
        //normally, we could just download the file with the download attribute. However, the request proxying we use for all links to the static server content at the API URL does not seem to work for these requests and we can't pass the API URL directly because it is not from the same Origin as the frontend and that means the download attribute no longer works. So we take the long way around:

        try { //try/catch because this will fail if the image does not come from our server but e.g. from ImgFlip
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
        } catch (err) {
            console.log('Failed to download image - it is probably external: ' + err);
        }
    }

    /**
     * get comments for meme
     */
    getComments = async () => {
        try {
            const meme = this.props.meme;
            let response = await api.getCommentsByMemeId(meme._id).catch((err) => {
                throw new Error(err);
            });

            let comments = response.data.data;

            this.setState({
                comments
            })
        } catch (err) {
            console.log("Failed to get Comments: ", err);
        }
    }

    /**
     * post the comment
     * @param {String} message - input message
     */
    postComment = async (message) => {
        try {
            //TODO userID
            await api.postComment(0, this.props.meme._id, message).then((res) => {
                this.props.meme.comment_ids.push(res.data.comment_id);
                this.props.triggerMemeListUpdate();
            });
            //update comment-section
            await this.getComments();
        } catch (err) {
            console.log('Failed to send comment: ', err);
        }
    }

    /**
     * get meme stats to display in the charts
     */
    getMemeStats = async () => {
        try {
            this.setState({
                showStats: false
            });

            //get the stats of the current meme
            const meme = this.props.meme;
            let response = await api.getStatsForMeme(meme._id).catch((err) => {
                throw new Error(err);
            });
            let memeStats = response.data.data.days;

            //create empty arrays to fill in later
            var upvotes = [];
            var downvotes = [];
            var views = [];
            var date = [];

            var x = memeStats.length - Math.min(memeStats.length, 14);
            //push all last 14 values (days) in the respective empty array
            for (var i = x; i < memeStats.length; i++) {
                upvotes.push(memeStats[i].upvotes);
                downvotes.push(memeStats[i].downvotes);
                views.push(memeStats[i].views);
                date.push(memeStats[i].date);
            }

            //update the states with the new arrays and values
            this.setState({
                upvotes: upvotes,
                downvotes: downvotes,
                views: views,
                date: date,
                showStats: true
            })
        } catch (err) {
            console.log("Failed to get Meme Stats: ", err);
        }
    }

    /**
     * sends view for given meme-id; triggers a +1 view in db
     * @param {Number} memeId 
     */
    sendView(memeId) {
        console.log("send view for id: ", memeId);
        this.props.meme.stats.views++; //update in-memory meme object until we get updated data from the API
        return api.viewMeme(memeId).catch(err => {
            console.log('Failed to post views: ', err);
        });
    }

    /**
     * updates the single view (memes and stats)
     */
    updateSingleView() {
        this.getMemeStats();
        this.props.triggerMemeListUpdate();
    }

    render() {
        const meme = this.props.meme;

        //check if we're displaying a new meme (as opposed to other re-renders without content changes)
        if (this.previousMemeId != meme._id) {
            this.previousMemeId = meme._id;
            this.sendView(meme._id).then(() => { // increment views, the check above prevents double counting
                this.getMemeStats(); //get detailed stats data for charts
            });
            this.getComments(); // get comments
            this.props.triggerMemeListUpdate(); //take updated views into account for sorting and slideshow order
        }

        return (
            <div id="single-view-wrapper">
                <hr />
                <div className="title-row">
                    <span id="meme-title">{meme.name}</span>
                    {meme.visibility == 1 && (
                        <img src="/ui/lock-unlisted.png" alt="unlisted meme" title="unlisted meme" />
                    )}
                    {meme.visibility == 0 && (
                        <img src="/ui/lock-private.png" alt="private meme" title="private meme" />
                    )}
                    <button type="button" className="read-button" id="read-button" title="read caption">read aloud</button>
                </div>
                <hr />
                <img id="meme-img" src={meme.url} alt={meme.name}></img>
                <table id="stats-table">
                    <tbody>
                        <tr>
                            <td><p>{meme.stats.views} views</p></td>
                            <td><p>{meme.user_name}</p></td>
                            <td><MemeVoteCounter meme={meme} triggerMemeListUpdate={this.updateSingleView} /></td>
                            <td><p>{meme.comment_ids.length} comments</p></td>
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
                <MemeComment
                    id={meme._id}
                    comments={this.state.comments}
                    postComment={this.postComment}

                />
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
