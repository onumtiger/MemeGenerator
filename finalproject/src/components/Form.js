import React, {Component} from 'react'

export default class Form extends Component {

    handleChange = (event) => {
        const {name, value} = event.target

        this.setState({
            [name]: value
        })
    }

    submitForm = () => {
        console.log(this.state)
        if (this.state.firstCaption !== '' && this.state.secondCaption !== '') {
            this.props.handleSubmit(this.state)
            this.setState({
                firstCaption: '',
                secondCaption: '',
                thirdCaption: ''
            })
        }
    }

    initialState = {
        boxCount: 2,
        buttonText: 'Generate',
        firstCaption: '',
        secondCaption: '',
        thirdCaption: ''
    }

    state = this.initialState

    render() {
        const {boxCount, buttonText, firstCaption, secondCaption, thirdCaption} = this.state

        var inputs = [];
        if(boxCount > 2) {
            inputs.push(
                <label htmlFor="thirdCaption">Third caption:</label>
            )
            inputs.push(
                <input
                    type="text"
                    name='thirdCaption'
                    id ='thirdCaption'
                    value= {thirdCaption}
                    onChange={this.handleChange}
                    />
            );
        }

        return (
            <form>
                <label htmlFor="firstCaption">First caption:</label>
                <input
                    type="text"
                    name='firstCaption'
                    id ='firstCaption'
                    value= {firstCaption}
                    onChange={this.handleChange}
                    />
                <label htmlFor="secondCaption">Second caption:</label>
                <input
                    type="text"
                    name='secondCaption'
                    id ='secondCaption'
                    value= {secondCaption}
                    onChange={this.handleChange}
                    />
                {inputs}
                <input type="button" value={buttonText} onClick={this.submitForm} />
            </form>
        )
    }
}