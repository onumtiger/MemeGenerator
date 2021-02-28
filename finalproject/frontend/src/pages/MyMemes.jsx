import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { MemeVoteCounter } from '../components';
import api from '../api';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import createTokenProvider from '../api/createTokenProvider';
import '../style/MyMemes.scss';

/**
 * list of own memes (user)
 */
export default class MyMemes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            memes: [],
            isLoading: true,
            commentMessages: [],
            commentIds: [],
            commentDate: []
        };
    }

    /**
     * get the acutal date
     * @param {*} inputDateString 
     */
    getDateString(inputDateString) {
        let dateArray = inputDateString.split('/');
        let year = dateArray[0];
        let month = dateArray[1];
        let day = dateArray[2];
        return `${day}.${month}.${year}`
    }

    /**
     * get own memes
     */
    componentDidMount = async () => {
        try {
            let userId = createTokenProvider.userIdFromToken();
            let response = await api.getOwnMemes(userId);
            this.setState({
                memes: response.data.data,
                isLoading: false
            });
        } catch (err) {
            console.log('Failed to get memes: ', err);
        }
    }


    render() {
        let { memes, isLoading } = this.state;
        
        return (
            <div id="mymemes-page-wrapper">
                {isLoading ? (
                    <div id="mymemes-page-loader">
                        <Loader type="Grid" height={500} width={500} color="#7ab2e1" visible={true} />
                    </div>
                ) : (
                        <>
                            {!memes.length && <p id="mymemes-empty">Hmm, seems like you haven't created any Memes yet. Once you do, they will show up here! Yes, even your private and unlisted ones.</p>}
                            {memes.map(meme => (
                                <div className={`meme-wrapper visibility-${meme.visibility}`} key={'meme-wrapper-' + meme._id}>
                                    <div className="title-row">
                                        <span className="title">{meme.name}</span>
                                        {meme.visibility == 1 && (
                                            <img src="/ui/lock-unlisted.png" alt="unlisted meme" title="unlisted meme" />
                                        )}
                                        {meme.visibility == 0 && (
                                            <img src="/ui/lock-private.png" alt="private meme" title="private meme" />
                                        )}
                                    </div>
                                    <Link to={'/memes/view/' + meme._id}>
                                        <img className="meme-img" src={meme.url} alt={meme.name}></img>
                                    </Link>
                                    <table className="stats-table">
                                        <tbody>
                                            <tr>
                                                <td><p>{meme.stats.views} views</p></td>
                                                <td><p>{meme.comment_ids.length} comments</p></td>   
                                                <td><MemeVoteCounter meme={meme} /></td> 
                                                <td><p>{meme.user_name}</p></td>                                                       
                                                <td><p>{this.getDateString(meme.creationDate)}</p></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    

                                </div>
                            ))}
                        </>
                    )}
            </div>
        )
    }
}