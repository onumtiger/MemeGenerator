import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

import styled from 'styled-components';

import {MemeVoteCounter as Counter, MemeComment as Comment} from '.';

// ---- DOMI ---- // 
// endless scroll, image & title, passive information (views, votes, comments), interaction (up/down vote, download, share) //

const Wrapper = styled.div`
padding: 0 40px 40px 40px;
`

const Right = styled.div`
width: auto;
    margin-right: 0px;
    margin-left: auto;
    text-align: right;
`

const ActionButton = styled.button`
background-color: white; 
  border: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
`

const MemeImg = styled.img`
display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  max-width: 500px;
  
`

const StatsTable = styled.table`
  margin: auto;
  width: 65%;
  padding: 10px;
  text-align: center;
`

const CenterDiv = styled.div`
margin: auto;
  width: 45%;
  border-bottom: 2px solid grey;
  padding: 10px;
  text-align: center;
`

class MemesList extends Component {

    constructor(props) {
        super(props);
        let { path, url } = this.props.match;
        this.routePath = path;
        this.routeURL = url;
    }

    sendInfos = () => {
        console.log("send");
        api.executeImageCreation({
            xPositions: [10, 80, 200, 300, 400, 50], //each index is a caption xPosition
            yPositions: [10, 80, 200, 300, 400, 50], //each index is a caption yPosition (e.g. xPosition[0] & yPosition [0] is a point)
            texts: ["Heftig, das funktioniert ja ...", "text2", "text3", "text4", "text5", "text6"], // texts are mapped to index of position arrays
            textColor: '#ff0da0', // hex color of text
            imageset: true, // if there should be more then one image
            images: 3, // only used when imageset is true
            textsPerImage: 2 //only used when imageset is true
        });
    }

    render() {
        const memes = this.props.memes;
        
        console.log('TCL: memesList -> render -> memes', memes);

        return (
            <Wrapper>
                {/*Ignore this line below, change as you like if it is disturbing here, pls do not delete*/}
                <button onClick={this.sendInfos}>Domis api test button</button>
                {memes.map(meme => (
                    <CenterDiv>
                        <Right>
                            <label>{meme.name} // </label>
                            <ActionButton>↓</ActionButton>
                            <ActionButton>→</ActionButton>
                        </Right>
                        <Link to={this.routePath+'/'+meme._id}>
                            <MemeImg src={meme.url} alt={meme.name}></MemeImg>
                        </Link> 
                        <StatsTable>
                            <tbody>
                            <tr>   
                                <td><p>{meme.stats.views} views</p></td>
                                <td><Counter upVotes={meme.stats.upvotes.length} downVotes={meme.stats.downvotes.length} ></Counter></td>{/*upVotes={meme.stats.upVotes} downVotes={meme.stats.upVotes}*/}
                                <td><p>{meme.creationDate}</p></td>
                            </tr>
                            </tbody>
                        </StatsTable>
                        <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>
                    </CenterDiv>
                ))}
            </Wrapper>
        )
    }
}

export default MemesList
