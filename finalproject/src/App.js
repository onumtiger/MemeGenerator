import React, {Component} from 'react'
import Form from './components/Form.js'
// import Meme from './components/Meme.js'
import Gallery from './components/Gallery.js'

export default class App extends Component {
    state = {
        captions: [],
        image: {
            boxCount: '',
            id: '',
            url: ''
        }
    }

    handleSubmit = (character) => {
        this.setState({characters: [...this.state.characters, character]})
    }

    handleTemplateImageSelection = (imageClicked) => {
        console.log("app.js", imageClicked)

        this.setState(prevState => {
            let image = Object.assign({}, prevState.image)
            image.id = imageClicked.id             
            image.boxCount = imageClicked.box_count               
            image.url = imageClicked.url                 
            return { image }
        })
        console.log("new state", this.state)
    }

    render() {  
      return (
        <div className="container">
            <Gallery handleTemplateImageSelection={this.handleTemplateImageSelection}/>
            <Form handleSubmit={this.handleSubmit}/>
            {/* <Meme /> */}
        </div>
      )
    }
}