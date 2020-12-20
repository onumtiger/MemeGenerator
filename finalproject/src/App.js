import React, {Component} from 'react'
import Form from './components/Form.js'
import Meme from './components/Meme.js'
import Gallery from './components/Gallery.js'
import { 
    addClass,
    generateMeme,
    removeClass
} from './functions/_index.js'

export default class App extends Component {
    state = {
        captions: [],
        image: {
            boxCount: '',
            id: '',
            url: ''
        },
        meme: {
            url: '',
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
            
            meme.url = generatedMeme.url                 

            return { meme }
        })

        removeClass("memeContainer", "hidden")
        addClass("galleryContainer", "hidden")
        addClass("formContainer", "hidden")
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

        addClass("memeContainer", "hidden")
        removeClass("galleryContainer", "hidden")
        removeClass("formContainer", "hidden")
    }

    render() {  
      return (
        <div className="container">
            <div id="galleryContainer">
                <Gallery handleTemplateImageSelection={this.handleTemplateImageSelection}/>
            </div>
            <div id="formContainer">
            <Form id="captionsInput" handleCaptionSubmit={this.handleCaptionSubmit} boxCount={this.state.image.boxCount}/>
            </div>
            <div id="memeContainer" class="hidden">
                <Meme memeURL={this.state.meme.url}/>
            </div>
            <input type="button" value="reset" onClick={this.resetPage} />
        </div>
      )
    }
}