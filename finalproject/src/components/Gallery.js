import React, {Component} from 'react'
import {
  fetchMemes
} from '../functions/_index.js'

 export default class Gallery extends Component {

    selectImage = (event) => {
      let clickedImage = this.state.memes.find(meme => meme.url === event.target.src)
      this.props.handleTemplateImageSelection(clickedImage)
    }

  state = {
    memes: [],
  }

  // Code is invoked after the component is mounted/inserted into the DOM tree.
  async componentDidMount() {
    const templateLength = 10
    let fetchedMemes = await fetchMemes(templateLength)
    this.setState({ memes: fetchedMemes })
  }

  render() {
    const result = this.state.memes.map((meme, index) => {
      return <li key={index}>
        <img src={meme.url} alt={meme.name} width={200} height={200} onClick={this.selectImage}/>
      </li>
    })

    return <div>
        <h1>Select an Image</h1>
        <ul>{result}</ul>
      </div>
  }
}