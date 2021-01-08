import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class MemesInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',
            url: '',
            captions: ["",""],
        }
    }

    handleChangeInputId = async event => {
        const id = event.target.value
        this.setState({ id })
    }

    handleChangeInputUrl = async event => {
        const url = event.target.value
        this.setState({ url })
    }

    handleChangeInputCaptions = async event => {
        const caption = event.target.value
        this.setState(state => { 
            let captions = [caption, state.captions[1]]

            return captions
        })
    }

    handleChangeInputCaptionsTwo = async event => {
        const caption = event.target.value
        this.setState(state => { 
            let captions = [state.captions[0], caption]

            return captions
        })
    }

    handleIncludeMeme = async () => {
        const { id, url, captions } = this.state
        const payload = { id, url, captions }

        await api.insertMeme(payload).then(res => {
            window.alert(`Meme inserted successfully`)
            this.setState({
                id: '',
                url: '',
                captions: ["",""],
            })
        })
    }

    render() {
        const { id, url, captions } = this.state
        return (
            <Wrapper>
                <Title>Create Meme</Title>

                <Label>ID: </Label>
                <InputText
                    type="text"
                    value={id}
                    onChange={this.handleChangeInputId}
                />

                <Label>Url: </Label>
                <InputText
                    type="text"
                    value={url}
                    onChange={this.handleChangeInputUrl}
                />

                <Label>Caption: </Label>
                <InputText
                    type="text"
                    value={captions[0]}
                    onChange={this.handleChangeInputCaptions}
                />

                <Label>Caption: </Label>
                <InputText
                    type="text"
                    value={captions[1]}
                    onChange={this.handleChangeInputCaptionsTwo}
                />      

                <Button onClick={this.handleIncludeMeme}>Add Meme</Button>
                <CancelButton href={'/memes/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default MemesInsert