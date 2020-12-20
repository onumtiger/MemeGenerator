import React, {Component} from 'react'

export default class Meme extends Component {
    render() {
        return (
            <img src={this.props.memeURL} id="meme" alt="generated meme"></img>
        )
    }
}