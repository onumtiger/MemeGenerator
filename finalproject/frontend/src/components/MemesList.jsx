import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MemeVoteCounter } from '.';
import '../style/MemesList.scss';

/**
 * MemeList: endless scroll, image & title, passive information (views, votes, comments), interaction (up/down vote, download, share)
 */
export default class MemesList extends Component {

    constructor(props) {
        super(props);
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
        return `${day}.${month}.${year}`
    }

    render() {
        const memes = this.props.memes;

        return (
            <div id="memes-list-wrapper">
                {/* filtering the view for public memes */}
                {memes.filter((meme) => (meme.visibility == 2)).map(meme => (
                    <div className="meme-wrapper" key={'meme-wrapper-' + meme._id}>
                        <div className="title-row">
                            <span>{meme.name}</span>
                        </div>
                        <Link to={'/memes/view/' + meme._id}>
                            <img className="meme-img" src={meme.url} alt={meme.name}></img>
                        </Link>
                        <table className="stats-table">
                            <tbody>
                                <tr>
                                    <td><p>{meme.stats.views} views</p></td>
                                    <td><p>{meme.user_name}</p></td>
                                    <td><MemeVoteCounter meme={meme} triggerMemeListUpdate={this.props.triggerMemeListUpdate} /></td>
                                    <td><p>{meme.comment_ids.length} comments</p></td>
                                    <td><p>{this.getDateString(meme.creationDate)}</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        )
    }
}
