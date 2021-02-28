import React from 'react';
import { Link } from 'react-router-dom'
import '../style/CreateLanding.scss';
import { NavBar } from '../components';

/**
 * First screen when choosing "create meme" in navbar
 */
export default class Create extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <>
            <NavBar />
            <div id="create-page-wrapper">
                <h2>How Do You Want To Create Your Meme?</h2>
                <table id="main-table">
                    <tbody>
                        <tr>
                            <td>
                                <Link to="/memes/create/api" className="nav-link">
                                    <button type="button" id="btn-api">
                                        <big>Create Via API</big>
                                        <hr />
                                        <small>Choose among the hottest meme templates on Imgflip and enter your captions at predefined positions</small>
                                    </button>
                                </Link>
                            </td>
                            <td>
                                <Link to="/memes/create/custom" className="nav-link">
                                    <button type="button" id="btn-custom">
                                        <big>Custom Create</big>
                                        <hr />
                                        <small>Create your own template or pick one from our database, create custom captions wherever you want</small>
                                    </button>
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            </>
        );
    }
}