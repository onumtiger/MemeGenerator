import React, {Component} from 'react'

export default class Gallery extends Component {
    render() {
  
      const { characterData, removeCharacter } = this.props
      return (
        <table>
          <TableHeader />
          <TableBody characterData={ characterData } removeCharacter={ removeCharacter}/>
        </table>
      )
    }
  }