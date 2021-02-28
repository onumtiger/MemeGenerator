import React, { Component } from 'react'
import Links from './Links'
import '../style/NavBar.scss';

/**
 * Navigationbar - includes Links for each page
 */
class NavBar extends Component {
    render() {
        return (
            <div id="navbar-wrapper" className="container" >
                <div id="navlinks" className="navbar navbar-expand-lg">
                    <Links />
                </div>
            </div>
        )
    }
}

export default NavBar