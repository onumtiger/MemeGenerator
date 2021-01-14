import React, {Component} from 'react'

/**
 * display generated meme
 */
export default class Meme extends Component {
    render() {
        return (
            <img src={this.props.memeURL} id="meme" alt="generated meme"></img>
        )
    }
}