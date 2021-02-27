import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {SingleView} from '.';

import '../style/SlideShow.scss';

export default class SlideShow extends Component {
    constructor(props) {
        super(props);

        this.diashowButtonTexts={
            default: 'Play Diashow \u25B6',
            playing: 'Stop diashow \u23F8'
        };
        this.diashowButtonTimeout = null;

        //this binding for React event handlers
        [
            'getPrevMemeId',
            'getNextMemeId',
            'getRandomMemeId',
            'handleDiashowButtonClick',
            'playDiashow',
            'checkForDisabledButton',

        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    getPrevMemeId(prevFrom = this.currentMemeIndex) {
        //slideIndex: count up when clicked forward, count down when clicked backwards
        let newIndex = prevFrom - 1;
        let numberOfMemes = this.props.memes.length;

        if (newIndex < 0) {
            newIndex = numberOfMemes - 1;   //if the sliderIndex is smaller than the first meme-index, set the index to the max-index to show the last meme
        }

        let newMeme = this.props.memes[newIndex];
        //don't link to non-public memes. If there is no other public meme, link back to the current image
        if(newMeme.visibility != 2){
            if(this.props.memes.some((m)=>(m.visibility==2))){
                return this.getPrevMemeId(newIndex);
            }else{
                return this.currentMemeIndex;
            }
        }else{
            return newMeme._id;
        }
    }

    getNextMemeId(nextFrom = this.currentMemeIndex) {
        //slideIndex: count up when clicked forward, count down when clicked backwards
        let newIndex = nextFrom + 1;
        let numberOfMemes = this.props.memes.length;

        if (newIndex >= numberOfMemes) {
            newIndex = 0;   //if the index exceeds the max-index, set it back to 0 to show the first meme
        }

        let newMeme = this.props.memes[newIndex];
        //don't link to non-public memes. If there is no other public meme, link back to the current image
        if(newMeme.visibility != 2){
            if(this.props.memes.some((m)=>(m.visibility==2))){
                return this.getNextMemeId(newIndex);
            }else{
                return this.currentMemeIndex;
            }
        }else{
            return newMeme._id;
        }
    }

    handleDiashowButtonClick(e){
        let button = e.target;
        if(this.diashowButtonTimeout){
            clearTimeout(this.diashowButtonTimeout);
            this.diashowButtonTimeout = null;
            button.textContent = this.diashowButtonTexts.default;
            for(const elem of document.querySelectorAll('#slideshow-wrapper .disable-during-diashow')){
                elem.classList.remove('inactive');
            }
        }else{
            this.playDiashow();
            button.textContent = this.diashowButtonTexts.playing;
            for(const elem of document.querySelectorAll('#slideshow-wrapper .disable-during-diashow')){
                elem.classList.add('inactive');
            }
        }
    }

    playDiashow() {
        //this will adhere to the current sorting, including a random order. With this approach, you are guaranteed to get no repetitions in the slideshow until you have iterated over every other meme.
        this.props.history.push(this.props.urlPath+'/'+this.getNextMemeId());
        this.diashowButtonTimeout = setTimeout(this.playDiashow, 2000);
    }

    getRandomMemeId(otherThan = this.currentMemeIndex) {
        let {memes} = this.props;
        let randomIndex = Math.floor(Math.random() * memes.length);
        if(memes.length && randomIndex == otherThan){
            //if there are multiple memes in the array and we just randomly landed on the current one, get the next one
            randomIndex++;
            if(randomIndex >= memes.length) randomIndex = 0;
        }
        
        let newMeme = this.props.memes[randomIndex];
        //don't link to non-public memes. If there is no other public meme, link back to the current image
        if(newMeme.visibility != 2){
            if(this.props.memes.some((m)=>(m.visibility==2))){
                return this.getRandomMemeId(randomIndex);
            }else{
                return this.currentMemeIndex;
            }
        }else{
            return newMeme._id;
        }
    }

    checkForDisabledButton(e){
        if(e.target.classList.contains('inactive')){
            e.preventDefault();
            e.stopPropagation();
            return;
        }
    }

    render() {
        //every change to the meme list via filtering etc. will call render(), so we need to figure out what we can do with that list here

        if(!(this.props.memes.length)){
            //if the meme list is empty (because of filtering etc.), display "nothing found" message
            return (<div id="slideshow-wrapper">
                <p id="slideshow-empty">Sorry, no Meme matched your selection :(</p>
            </div>);
        }

        let { memeId } = this.props.match.params;
        this.currentMemeIndex = this.props.memes.findIndex(meme => meme._id == memeId);

        if(this.props.wasMemeListJustUpdated()){
            //if we just updated the meme list via filter etc (as opposed to the initial rendering after clicking on a meme in MemesList), check if the currently viewed meme is still among the filtered meme list. If not, go to the beginning of the filtered memelist.
            if(this.currentMemeIndex == -1){
                let firstMemeId = this.props.memes[0]._id;
                this.props.history.push(this.props.urlPath+'/'+firstMemeId);
                return <></>;
            }
        }

        //at this point, we have a valid meme to display, matching the requested ID from the URL
        const meme = this.props.memes[this.currentMemeIndex];

        
        if(!meme){
            //if the requested meme is not among the loaded ones ( = we're trying to access an invalid ID or a private meme from another user), display error message:
            return (<div id="slideshow-wrapper">
                <p id="slideshow-empty">Sorry, this Meme either does not exist or it is set to private :(</p>
            </div>);
        }

        return (
            <div id="slideshow-wrapper">
                <div id="slideshow-toprow">
                    <Link to={this.props.urlPath}>
                        <button type="button" className="actionButton disable-during-diashow" onClick={this.checkForDisabledButton}>&#9204; Back to List</button>
                    </Link>
                    <Link to={this.props.urlPath+'/'+this.getRandomMemeId()}>
                        <button type="button" className="actionButton disable-during-diashow" onClick={this.checkForDisabledButton}>Shuffle &harr;</button>
                    </Link>
                    <button type="button" className="actionButton" id="playDia" onClick={this.handleDiashowButtonClick}>{this.diashowButtonTexts.default}</button>
                </div>

                <table id="slideshow-table">
                    <tbody>
                    <tr>
                    <td className="button-column">
                        <Link to={this.props.urlPath+'/'+this.getPrevMemeId()}>
                            <button type="button" className="slideButton leftBtn disable-during-diashow" onClick={this.checkForDisabledButton}>←</button>
                        </Link>
                    </td>
                    <td>
                        <SingleView meme={meme} getAllOtherViews={this.props.getAllOtherViews} triggerMemeListUpdate={this.props.triggerMemeListUpdate} />
                    </td>
                    <td className="button-column">
                        <Link to={this.props.urlPath+'/'+this.getNextMemeId()}>
                            <button type="button" className="slideButton rightBtn disable-during-diashow" onClick={this.checkForDisabledButton}>→</button>
                        </Link>
                    </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}
