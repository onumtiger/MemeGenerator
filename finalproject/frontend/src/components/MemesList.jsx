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
                {memes.map(meme => (
                    <div className="meme-wrapper" key={'meme-wrapper-'+meme._id}>
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
