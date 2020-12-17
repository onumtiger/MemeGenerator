import React, {Component} from 'react'

export default class Form extends Component {

    handleSubmit = () => {
        this.props.handleCaptionSubmit(this.state.captions)
    }

    handleInput = (event) => {
        this.setState(prevState => {
            let captions = prevState.captions
            captions[event.target.id] = event.target.value
            return { captions }
        }) 
    }

    state = {
        buttonText: 'Generate Meme',
        captions: [],
        inputs : 2
    }

    render() {
        return (
            <form>
                <label htmlFor="firstCaption">First caption:</label>
                <input
                    type="text"
                    name='firstCaption'
                    id ='0'
                    value={this.state.captions[0]} 
                    onChange={this.handleInput}
                    />
                <label htmlFor="secondCaption">Second caption:</label>
                <input
                    type="text"
                    name='secondCaption'
                    id ='1'
                    value={this.state.captions[1]} 
                    onChange={this.handleInput}
                    />
               <input type="button" value={this.state.buttonText} onClick={this.handleSubmit} />
            </form>
        )
    }
}