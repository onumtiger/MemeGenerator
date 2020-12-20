import React, {Component} from 'react'
/**
 * Display input fields and save entered captions in parent component
 */
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
        for (let i = 1; i < this.props.boxCount+1; i++) {
            inputs[0] = <h1>Add Captions</h1>
            inputs.push(<label htmlFor={i}>Caption:</label>)
            inputs.push(<input 
                type="text" 
                name={i}
                key = {i}
                value={this.state.captions[i]} 
                onChange={this.handleInput}
                />)
        }
        if (inputs.length > 0) {
            inputs.push(
                <input type="button" value={this.state.buttonText} onClick={this.handleSubmit} />
            )
        }
        

        return (
            <form>
                {inputs}
            </form>
        )
    }
}