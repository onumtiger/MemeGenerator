import React from 'react';
import '../style/upload.css';

class UploadMeme extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="wrapper">
                <h1>Create a meme with your own image</h1>
                <label>Upload your own meme: </label>
                <div id="drop-area">
                    <input type="file" id="fileElem" name="sampleFile" multiple accept="image/*" />
                    <label className="button" htmlFor="fileElem">Choose a meme</label>
                </div>
            </div>
        );
    }
}

export default UploadMeme