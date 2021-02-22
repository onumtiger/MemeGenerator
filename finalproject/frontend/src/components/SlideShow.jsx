import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
import {SingleView} from '.';

const ActionButton = styled.button`
background-color: white; 
  border: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-weight: bold; 
  font-size: 16px;
`

const SlideButton = styled.button`
background-color: black; 
border-radius: 5px;
  border: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 30px;
  color: white;
`

const SlideShowTable = styled.table`
    vertical-align: middle;
`
const CenterDiv = styled.div`
margin: auto;
  width: 48%;
  padding: 10px;
  text-align: center;
`

class SlideShow extends Component {
    constructor(props) {
        super(props);

        //this binding for React event handlers
        [
            'getPrevMemeId',
            'getNextMemeId',
            'getRandomMemeId',
            'playDiashow',

        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    getPrevMemeId() {
        //slideIndex: count up when clicked forward, count down when clicked backwards
        let newIndex = this.currentMemeIndex -1;
        let numberOfMemes = this.props.memes.length;

        if (newIndex < 0) {
            newIndex = numberOfMemes - 1;   //if the sliderIndex is smaller than the first meme-index, set the index to the max-index to show the last meme
        }

        let newMemeId = this.props.memes[newIndex]._id;
        return newMemeId;
    }

    getNextMemeId() {
        //slideIndex: count up when clicked forward, count down when clicked backwards
        let newIndex = this.currentMemeIndex + 1;
        let numberOfMemes = this.props.memes.length;

        if (newIndex >= numberOfMemes) {
            newIndex = 0;   //if the index exceeds the max-index, set it back to 0 to show the first meme
        }

        let newMemeId = this.props.memes[newIndex]._id;
        return newMemeId;
    }

    playDiashow() {
        let playDiaButton = document.getElementById("playDia");
        let stopDiaButton = document.getElementById("stopDia");

        playDiaButton.style.display = "none";
        stopDiaButton.style.display = "inline-block";

        this.props.history.push(this.props.urlPath+'/'+this.getNextMemeId());

        const timeout = setTimeout(this.playDiashow, 2000);

        stopDiaButton.addEventListener('click', () => {
            playDiaButton.style.display = "inline-block";
            stopDiaButton.style.display = "none";
            clearTimeout(timeout);
        })
    }

    getRandomMemeId() {
        let {memes} = this.props;
        let randomIndex = Math.floor(Math.random() * memes.length);
        if(memes.length && randomIndex == this.currentMemeIndex){
            //if there are multiple memes in the array and we just randomly landed on the current one, get the next one
            randomIndex++;
            if(randomIndex >= memes.length) randomIndex = 0;
        }

        let newMemeId = this.props.memes[randomIndex]._id;
        return newMemeId;
    }

    render() {
        //every change to the meme list via filtering etc. will call render(), so we need to figure out what we can do with that list here

        if(!(this.props.memes.length)){
            //if the meme list is empty (because of filtering etc.), display "nothing found" image - TODO
            return <></>;
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

        return (
            <CenterDiv>
                <div className="slideshow">
                    <Link to={this.props.urlPath+'/'+this.getRandomMemeId()}>
                        <ActionButton>Shuffle ↔</ActionButton>
                    </Link>
                    <ActionButton id="playDia" onClick={this.playDiashow}>Diashow ►</ActionButton>
                    <ActionButton id="stopDia">Stop diashow &#x23f8;</ActionButton>

                    <SlideShowTable>
                        <tbody>
                        <tr>
                        <td>
                            <Link to={this.props.urlPath+'/'+this.getPrevMemeId()}>
                                <SlideButton>←</SlideButton>
                            </Link>
                        </td>
                        <td>
                            <SingleView meme={meme} />
                        </td>
                        <td>
                            <Link to={this.props.urlPath+'/'+this.getNextMemeId()}>
                                <SlideButton>→</SlideButton>
                            </Link>
                        </td>
                        </tr>
                        </tbody>
                    </SlideShowTable>
                </div>
            </CenterDiv>
        )
    }
}

export default SlideShow
