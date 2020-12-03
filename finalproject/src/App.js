import React, {Component} from 'react'
import Table from './Table.js'
import Form from './components/Form.js'
import Meme from './components/Meme.js'
import Gallery from './components/Gallery.js'

export default class App extends Component {
    state = {
        characters: []
    }

    removeCharacter = (index) => {
        const {characters} = this.state

        this.setState({
            characters: characters.filter((character, i) =>{
                return i !== index
            })
        })
    }

    handleSubmit = (character) => {
        this.setState({characters: [...this.state.characters, character]})
    }
    render() {
      const  {characters } = this.state
  
      return (
        <div className="container">
            <Gallery onClick={this.selectImage}/>
            <Form handleSubmit={this.handleSubmit}/>
            <Meme />
        </div>
      )
    }
}