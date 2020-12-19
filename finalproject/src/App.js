import React, {Component} from 'react'
import Form from './components/Form.js'
// import Meme from './components/Meme.js'
import Gallery from './components/Gallery.js'
import { generateMeme } from './functions/_index.js'

export default class App extends Component {
    state = {
        captions: [],
        image: {
            boxCount: '',
            id: '',
            url: ''
        },
        meme: {
            height: '',
            id: '',
            name: '',
            url: '',
            width: ''
        }
    }

    handleTemplateImageSelection = (imageClicked) => {
        this.setState(prevState => {
            let image = Object.assign({}, prevState.image)
            image.id = imageClicked.id             
            image.boxCount = imageClicked.box_count               
            image.url = imageClicked.url                 
            return { image }
        })
    }

    handleCaptionSubmit = (submitInput) => {
        this.setState(() => {
            let captions = []
            for(let i = 0; i < submitInput.length-1; i++){
                captions[i] = submitInput[i+1]
            }
            return { captions }
        })

        setTimeout(() => {
            this.generateComponent()
        }, 5)
    }

    generateComponent = async () => {
        let generatedMeme = await generateMeme(this.state.image.id, this.state.captions)

        this.setState(prevState => {
            let meme = Object.assign({}, prevState.meme)

            meme.height = generatedMeme.height                 
            meme.id = generatedMeme.id             
            meme.name = generatedMeme.name               
            meme.url = generatedMeme.url                 
            meme.width = generatedMeme.width  

            return { meme }
        })

    }

    resetPage = () => {
        this.setState(() => {
            let captions = []
            let image = {
                boxCount: '',
                id: '',
                url: ''
            }

            return { captions, image }
        })
    }

    render() {  
      return (
        <div className="container">
            <Gallery handleTemplateImageSelection={this.handleTemplateImageSelection}/>
            <Form handleCaptionSubmit={this.handleCaptionSubmit} boxCount={this.state.image.boxCount}/>
            {/* <Meme /> */}
            <input type="button" value="reset" onClick={this.resetPage} />
        </div>
      )
    }
}