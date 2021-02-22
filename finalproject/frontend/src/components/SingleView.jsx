import React, { Component } from 'react'

import styled from 'styled-components'
import {MemeVoteCounter as Counter, MemeComment as Comment} from '.';

const Right = styled.div`
width: auto;
    margin-right: 0px;
    margin-left: auto;
    text-align: right;
`

const MemeImg = styled.img`
display: block;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  max-width: 500px;
`

const StatsTable = styled.table`
  margin: auto;
  width: 75%;
  padding: 10px;
  text-align: center;
`

class SingleView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const meme = this.props.meme;

        return (
            <div className="slide">
                <Right>
                    <label>{meme.name} // </label>

                </Right>
                <MemeImg src={meme.url} alt={meme.name}></MemeImg>
                <StatsTable>
                    <tbody>
                    <tr>
                        <td><p>{meme.stats.views} views</p></td>
                        <td><Counter upVotes={meme.stats.upvotes.length} downVotes={meme.stats.downvotes.length} stats_id={meme.stats_id}></Counter></td>{/*upVotes={meme.stats.upVotes} downVotes={meme.stats.upVotes}*/}
                        <td><p>{meme.creationDate}</p></td>
                    </tr>
                    </tbody>
                </StatsTable>
                <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>
            </div>
        )
    }
}

export default SingleView
