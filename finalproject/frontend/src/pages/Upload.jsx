import React from 'react';
import '../style/upload.css';
import DragAndDrop from '../components/DragAndDrop'
import MemeTemplates from '../components/MemeTemplates'


class UploadMeme extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            // dragging: false
        };

        this.onImageChange = this.onImageChange.bind(this);
        // this.submitFile = this.submitFile.bind(this);
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
                image: URL.createObjectURL(img)
            });
            console.log(this.state.image )
        }
    }

    render() {
        return (
            <div className="wrapper">
                <h2>Upload a meme and add it to your template</h2>
                <label>Upload your own meme: </label>

                <div id="drop-area">
                    <div><img id="output" src={this.state.image} /></div>
                    <input type="file" id="fileElem" multiple accept="image/*" onChange={this.onImageChange} />
                    <label className="button" htmlFor="fileElem">Choose a meme</label>
                </div>
                <button id="uploadButtonFile" type="submit" onClick={this.submitFile}>Upload File</button>

                <div>
                    <label>Template memes:</label>
                    <div id="uploadedTemplates">
                        <MemeTemplates />
                        {/* display the images from templates folder */}
                    </div>
                </div>
            </div>
        );
    }
}

export default UploadMeme