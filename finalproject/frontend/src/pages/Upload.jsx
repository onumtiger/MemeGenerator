import React from 'react';
import '../style/upload.css';
import DragAndDrop from '../components/DragAndDrop'


class UploadMeme extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            id: '',
            name: ''
        };

        this.onImageChange = this.onImageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
                image: URL.createObjectURL(img)
            });
            console.log(this.state.image)
        }
    }

    getUploadConfig() {
        const container = document.getElementById('uploadContainer');
        const id = container.querySelector('#id').value;
        const name = container.querySelector('#name').value;
        return { id: id, name: name }
    }

    handleSubmit() {
        const container = document.getElementById('uploadContainer');
        const file = container.querySelector('input[type="file"]').files[0];

        const { id, name } = this.getUploadConfig();

        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', name)

        // --- the REQUEST which is used for FILE UPLOAD ---
        fetch(`http://localhost:3001/api/templates/`, {
            method: 'POST',
            mode: 'cors',
            body: formData
        }).then(res => {
            console.log(res);
        })
    }

    render() {
        return (
            <div className="wrapper" >
                <div class="center">
                    <h2>Upload a meme and add it to your templates</h2>
                    <form id="uploadContainer" onSubmit={this.handleSubmit} encType='multipart/form-data'>
                        <label>Upload your own meme: </label>
                        <div id="drop-area">
                            <div><img id="output" src={this.state.image} width="480"/></div>
                            <input type="file" id="fileElem" multiple accept="image/*" onChange={this.onImageChange} />
                            <label className="button" htmlFor="fileElem">Choose a meme</label>
                        </div>
                        <table>
                            <tr>
                                <td><label for="id">ID</label></td>
                                <td><input id="id" type="text" /></td>
                            </tr>
                            <tr>
                                <td><label for="name">Name</label></td>
                                <td><input id="name" type="text" /></td>
                            </tr>
                        </table>
                        <button id="uploadButtonFile" type="button" onClick={this.handleSubmit}>Upload File</button>
                    </form>
                </div>
            </div>
        );
    }
}

export default UploadMeme