import React from 'react';
import '../style/CanvasDownloadButton.scss';

/**
 * download button for canvas
 */
export default class CanvasDownloadButton extends React.Component {
    render() {
        return (
            <a className="canvas-download-anchor" download={this.props.placeholderFileName}>
                <button type="button" className="canvas-download-btn" onClick={this.props.onButtonClick}>Download Image</button>
            </a>
        );
    }
}