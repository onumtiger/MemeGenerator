import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

import {MemeVoteCounter as Counter, MemeComment as Comment} from '.';

import '../style/MemesList.scss';


// ---- DOMI ---- // 
// endless scroll, image & title, passive information (views, votes, comments), interaction (up/down vote, download, share) //

export default class MemesList extends Component {

    constructor(props) {
        super(props);
        let { path, url } = this.props.match;
        this.routePath = path;
        this.routeURL = url;
    }

    sendInfos = async () => {
        console.log("send");
        let response = await api.executeImageCreation({ 
            imageURL: 'https://wow.zamimg.com/uploads/blog/images/20516-afterlives-ardenweald-4k-desktop-wallpapers.jpg', //image URL
            xPositions: [10, 80, 200, 300, 400, 50], //each index is a caption xPosition
            yPositions: [10, 80, 200, 300, 400, 50], //each index is a caption yPosition (e.g. xPosition[0] & yPosition [0] is a point)
            texts: ["text1", "text2", "text3", "text4", "text5", "text6"], // texts are mapped to index of position arrays
            textColor: '#ff0da0', // hex color of text
            imageset: true, // if there should be more then one image
            images: 2, // only used when imageset is true
            textsPerImage: 2 //only used when imageset is true
        });
       
    }

    getDateString(inputDateString){
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`
    }

    render() {
        const memes = this.props.memes;
        
        console.log('TCL: memesList -> render -> memes', memes);

        return (
            <div id="memes-list-wrapper">
                {/*Ignore this line below, change as you like if it is disturbing here, pls do not delete*/}
                <button onClick={this.sendInfos}>Domis api test button</button>
                {memes.map(meme => (
                    <div className="meme-wrapper">
                        <div className="title-row">
                            <span>{meme.name} // </span>
                            <button type="button" className="actionButton">↓</button>
                            <button type="button" className="actionButton">→</button>
                        </div>
                        <Link to={this.routePath+'/'+meme._id}>
                            <img className="meme-img" src={meme.url} alt={meme.name}></img>
                        </Link>
                        <table className="stats-table">
                            <tbody>
                            <tr>   
                                <td><p>{meme.stats.views} views</p></td>
                                <td><Counter upVotes={meme.stats.upvotes.length} downVotes={meme.stats.downvotes.length} ></Counter></td>
                                <td><p>{this.getDateString(meme.creationDate)}</p></td>
                            </tr>
                            </tbody>
                        </table>
                        <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>
                    </div>
                ))}
            </div>
        )
    }
}
