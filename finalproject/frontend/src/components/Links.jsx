import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import createTokenProvider from '../api/createTokenProvider';

class Links extends Component {
    activateRightPanel = () => {
        createTokenProvider.setToken(null)
    }

    render() {
        return (
            <React.Fragment>
                <Link to="/memes/view" /* className="navbar-brand" */ className="nav-link">
                    <span id="logo" /* style={{fontFamily: 'Impact'} */>memify</span>
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
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                            <Link to="/memes/view" className="nav-link" onClick={this.logout}>
                                Logout
                            </Link>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Links