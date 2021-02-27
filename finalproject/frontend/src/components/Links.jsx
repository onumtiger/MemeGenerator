import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Links extends Component {
    render() {
        return (
            <React.Fragment>
                <Link to="/" className="navbar-brand">
                    <span style={{fontFamily: 'Impact'}}>OMM Meme App</span>
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

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Links