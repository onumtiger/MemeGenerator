import React, {Component} from 'react'

export default class Meme extends Component {
    initialState = {
        source: ''
    }

    state = this.initialState

    render() {
        const {source} = this.state

        return (
            <img src={source} id="meme" alt="generated meme"></img>
        )
    }
}