import React from 'react';
import '../style/CanvasDownloadButton.scss';

export default class CanvasDownloadButton extends React.Component {
    render(){
        return (
            <a id="download-anchor" download={this.props.placeholderFileName}>
                <button type="button" id="download-btn" onClick={this.props.onButtonClick}>Download Image</button>
            </a>
        );
    }
}