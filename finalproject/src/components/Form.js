import React, {Component} from 'react'

export default class Form extends Component {

    handleSubmit = () => {
        this.props.handleCaptionSubmit(this.state.captions)
    }

    handleInput = (event) => {
        this.setState(prevState => {
            let captions = prevState.captions
            captions[event.target.name] = event.target.value
            return { captions }
        }) 
    }

    state = {
        buttonText: 'Generate Meme',
        captions: [],
    }

    render() {
        let inputs = [];
        for (let i = 0; i < this.props.boxCount; i++) {
            inputs.push(<label htmlFor={i}>First caption:</label>)
            inputs.push(<input 
                type="text" 
                name={i}
                key = {i}
                value={this.state.captions[i]} 
                onChange={this.handleInput}
                />)
        }

        return (
            <form>
                {inputs}
                <input type="button" value={this.state.buttonText} onClick={this.handleSubmit} />
            </form>
        )
    }
}