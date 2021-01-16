import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Collapse = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

const List = styled.div.attrs({
    className: 'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse',
})``

class Links extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    <span style={{fontFamily: 'Impact'}}>OMM Meme App</span>
                </Link>
                <Collapse>
                    <List>
                        <Item>
                            <Link to="/memes/list" className="nav-link">
                                List Memes
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/memes/create-via-api" className="nav-link">
                                Create Meme via ImgFlip
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/memes/create" className="nav-link">
                                Create Meme locally
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/memes/create-template" className="nav-link">
                                Draw a Template
                            </Link>
                        </Item>
                        <Item>
                            <Link to="/memes/uploadMeme" className="nav-link">
                                Upload a Meme
                            </Link>
                        </Item>

                    </List>
                </Collapse>
            </React.Fragment>
        )
    }
}

export default Links