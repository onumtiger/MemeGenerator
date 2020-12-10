import React, {Component} from 'react'
import {
  fetchMemes
} from '../functions/_index.js'

 export default class Gallery extends Component {

    selectImage = (event) => {
        console.log(event.target)
        this.props.handleSelection(event.target)
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
        {/* <img src={meme.url} alt={meme.name} width={200} height={200}/> */}
        <img src={meme.url} alt={meme.name} width={200} height={200} id={meme.id} boxcount={meme.box_count} onClick={this.selectImage}/>
      </li>
    })

    return <ul>{result}</ul>
  }
}