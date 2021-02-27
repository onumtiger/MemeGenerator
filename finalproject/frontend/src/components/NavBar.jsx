import React, { Component } from 'react'
import styled from 'styled-components'

import Links from './Links'

const Container = styled.div.attrs({
    className: 'container',
})``

const Nav = styled.nav.attrs({
    //className: 'navbar navbar-expand-lg navbar-dark bg-dark',
    className: 'navbar navbar-expand-lg',
})`
    
    
    border-radius: 12px;
`

class NavBar extends Component {
    render() {
        return (
            <Container>
                <Nav>
                    <Links />
                </Nav>
                <hr />
            </Container>
        )
    }
}

export default NavBar