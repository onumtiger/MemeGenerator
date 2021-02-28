import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import '../style/NavBar.scss';

import createTokenProvider from '../api/createTokenProvider';

/**
 * Navigationbar - includes Links for each page
 */
class NavBar extends Component {
    logout = () => {
        createTokenProvider.setToken(null);
        window.location.reload();
    }

    render() {
        return (
            <div id="navbar-wrapper" className="container" >
                <div id="navlinks" className="navbar navbar-expand-lg">
                    <Link to="/memes/view" className="nav-link navbar-brand">
                        <span id="logo">memify</span>
                    </Link>
                    <div className="navbar-collapse">
                        <div className="navbar-nav mr-auto">
                            <div className="navbar-collapse">
                                <Link to="/memes/view" className="nav-link">
                                    View Memes
                                </Link>
                            </div>
                            <div className="navbar-collapse">
                                <Link to="/memes/create" className="nav-link">
                                    Create Meme
                                </Link>
                            </div>
                            <div className="navbar-collapse">
                                <Link to="/memes/own" className="nav-link">
                                    My Memes
                                </Link>
                            </div>
                            <div className="navbar-collapse">
                                {createTokenProvider.isLoggedIn() ? (
                                    <Link to="/memes/view" className="nav-link" onClick={this.logout}>
                                        Logout
                                    </Link>
                                ) : (
                                    <Link to="/login" className="nav-link">
                                        Login
                                    </Link>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar