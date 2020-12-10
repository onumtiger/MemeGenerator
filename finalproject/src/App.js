    import React, {Component} from 'react'
import Form from './components/Form.js'
// import Meme from './components/Meme.js'
import Gallery from './components/Gallery.js'

export default class App extends Component {
    state = {
        characters: [],
        image: {
            boxCount: '',
            id: '',
            src: ''
        }
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

    handleSelection = (imageClicked) => {
        let newState = {
            boxCount: imageClicked.boxcount,
            id: imageClicked.id,
            src: imageClicked.src
        }
        console.log(newState)

        // this.setState({...this.state.image, 
        //     boxCount: imageClicked.boxCount,
        //     id: imageClicked.id,
        //     src: imageClicked.src
        // })

        this.setState({
            image: newState
        })
        console.log(this.state)

    }
    render() {  
      return (
        <div className="container">
            <Gallery handleSelection={this.handleSelection}/>
            <Form handleSubmit={this.handleSubmit}/>
            {/* <Meme /> */}
        </div>
      )
    }
}