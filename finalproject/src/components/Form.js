import React, {Component} from 'react'

export default class Form extends Component {

    handleChange = (event) => {
        const {name, value} = event.target

        this.setState({
            [name]: value
        })
    }

    clearInput = (event) => {
        if (this.state.firstCaption === 'Add caption' && this.state.secondCaption === 'Add caption'){
            this.setState(this.cleared)
        }
    }

    submitForm = () => {
        console.log(this.state)
        if (this.state.firstCaption !== '' && this.state.secondCaption !== '') {
            this.props.handleSubmit(this.state)
            this.setState(this.afterGeneration)
        }
        else{
            this.setState(this.initialState)
        }
    }

    cleared = {
        firstCaption: '',
        secondCaption: '',
        buttonText: 'Generate'
    }

    afterGeneration = {
        firstCaption: '',
        secondCaption: '',
        buttonText: 'Building...'
    }

    initialState = {
        firstCaption: 'Add caption',
        secondCaption: 'Add caption',
        buttonText: 'Generate'
    }

    state = this.initialState

    render() {
        const {firstCaption, secondCaption, buttonText} = this.state

        return (
            <form>
                <label htmlFor="firstCaption">First caption:</label>
                <input
                    type="text"
                    name="firstCaption"
                    id="firstCaption"
                    value={firstCaption}
                    onChange={this.handleChange}
                    onClick={this.clearInput}  />
                <label htmlFor="secondCaption">Last caption:</label>
                <input 
                    type="text"
                    name="secondCaption"
                    id="secondCaption"
                    value={secondCaption}
                    onChange={this.handleChange}
                    onClick={this.clearInput} />
                <input type="button" value={buttonText} onClick={this.submitForm} />
            </form>
        )
    }
}