import React, { createRef } from 'react';
import CanvasDownloadButton from '../components/CanvasDownloadButton';
import '../style/DrawTemplate.scss';
import api from '../api';

export default class DrawTemplate extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = createRef();
        this.drawing = false;
        this.strokeWidth = 3;
        this.strokeColor = {
            R: 0,
            G: 0,
            B: 0
        };
        this.canvasBackgroundColor = "white";
        this.snappedImage = null;
        this.camButtonTexts = {
            default: 'Insert Webcam Photo',
            streaming: 'Use this Picture'
        };
        this.clearButtonTexts = {
            default: 'Clear Drawing',
            bgToClear: 'Clear Canvas'
        };
        this.publishButtonTexts = {
            default: 'Publish and Use this Image',
            loading: 'Publishing...'
        };
        this.lastPos = {x: -1, y: -1};
        [
            'handleCanvasMouseDown',
            'handleCanvasMouseUp',
            'handlePageMouseUp',
            'handleCanvasMouseMove',
            'handlePageMouseMove',
            'handleStrokeWidthInput',
            'handleStrokeColorRInput',
            'handleStrokeColorGInput',
            'handleStrokeColorBInput',
            'handleDownloadButtonClick',
            'handleClearButtonClick',
            'handleCamButtonClick',
            'handlePublishButtonClick'
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    setCanvasReferences(){
        this.cElem = this.canvasRef.current;
        this.cContext = this.canvasRef.current.getContext('2d');
    }

    setCanvasDimensions() {
        let availSpace = document.getElementById('canvas-column').offsetWidth;
        //account for canvas border
        availSpace -= 2;
        this.cElem.width = availSpace;
        this.cElem.height = parseInt(availSpace * (9/16)); //set a 16:9 aspect ratio to accommodate most webcams
    }

    setCanvasBackgroundColor(color) {
        this.cContext.fillStyle = color;
        this.cContext.fillRect(0, 0, this.cElem.width, this.cElem.height);
    }

    setCanvasBackgroundImage(img){
        this.clearCanvas();
        this.cContext.drawImage(img, 0, 0, this.cElem.width, this.cElem.height);
    }

    clearCanvas(){
        this.cContext.clearRect(0, 0, this.cElem.width, this.cElem.height);
    }

    handleCanvasMouseDown(e){
        e = e.nativeEvent; //React events don't have offsetX/Y

        this.drawing = true;
        this.lastPos = {x: e.offsetX, y: e.offsetY};

        //if we have previously snapped a webcam image and cleared the drawing, the clear button would now clear the entire canvas onClick. Since we now start drawing again, revert the button back to clearing only the drawing first.
        if(this.snappedImage){
            let clearBtn = document.getElementById('clear-btn');
            if(clearBtn.innerText == this.clearButtonTexts.bgToClear){
                clearBtn.innerText = this.clearButtonTexts.default;
            }
        }
    }

    handleCanvasMouseUp(e){
        e = e.nativeEvent; //React events don't have offsetX/Y

        this.drawing = false;
    }

    handlePageMouseUp(e){
        if(this.drawing) this.drawing = false;
    }

    handleCanvasMouseMove(e){
        e.stopPropagation(); //don't let the event bubble up to #page-wrapper, that one should only get non-canvas events.
        e = e.nativeEvent; //React events don't have offsetX/Y

        if(this.drawing){
            if(this.leftCanvas){
                this.leftCanvas = false;
            }else{
                this.cContext.lineWidth = this.strokeWidth;
                this.cContext.strokeStyle = `rgb(${this.strokeColor.R},${this.strokeColor.G},${this.strokeColor.B}`;
                this.cContext.beginPath();
                this.cContext.moveTo(this.lastPos.x, this.lastPos.y);
                this.cContext.lineTo(e.offsetX, e.offsetY);
                this.cContext.closePath();
                this.cContext.stroke();

                //Sometimes, if you're drawing too slow, the canvas doesn't recognize the direction and draws the line in the wrong orientation, which gets more noticeable with increasing line thickness. So let's be safe and add a more paint-like circle on top.
                this.cContext.fillStyle = `rgb(${this.strokeColor.R},${this.strokeColor.G},${this.strokeColor.B}`;
                this.cContext.beginPath();
                this.cContext.arc(e.offsetX, e.offsetY, parseInt(this.strokeWidth/2), 0, 2*Math.PI)
                this.cContext.fill();
            }
            this.lastPos = {x: e.offsetX, y: e.offsetY};
        }
    }

    handlePageMouseMove(e){
        e = e.nativeEvent; //React events don't have offsetX/Y
        
        if(this.drawing){
            this.leftCanvas = true; // triggers that on the next mouseMove inside canvas, lastPos will be updated first thing before any new line will be drawn. This means that the canvas won't try to connect the last in-canvas point with the first in-canvas point after re-entry. Instead, the stroke will just end wherever the mouse left the canvas and start again wherever it re-enters.
        }
    }

    handleStrokeWidthInput(e){
        let input = e.target.value;
        this.strokeWidth = input;
        document.getElementById('label-strokeWidth').textContent = input;
    }

    handleStrokeColorRInput(e){
        let input = e.target.value;
        this.strokeColor.R = input;
        document.getElementById('label-strokeColorR').textContent = input;
    }

    handleStrokeColorGInput(e){
        let input = e.target.value;
        this.strokeColor.G = input;
        document.getElementById('label-strokeColorG').textContent = input;
    }

    handleStrokeColorBInput(e){
        let input = e.target.value;
        this.strokeColor.B = input;
        document.getElementById('label-strokeColorB').textContent = input;
    }

    handleDownloadButtonClick(e){
        //get the current canvas image
        let url = this.cElem.toDataURL('image/png');
        
        //download it
        let a = document.getElementById('download-anchor');
        a.href = url;
    }

    handleClearButtonClick(e){
        if(this.snappedImage && e.target.innerText == this.clearButtonTexts.default){
            this.setCanvasBackgroundImage(this.snappedImage);
            e.target.innerText = this.clearButtonTexts.bgToClear;
        }else{
            this.setCanvasBackgroundColor(this.canvasBackgroundColor);
            if(this.snappedImage){
                this.snappedImage = null;
                e.target.innerText = this.clearButtonTexts.default;
            }
        }
    }

    handleCamButtonClick(e){
        let button = e.target;
        let vid = document.getElementById('webcam-input');

        if(vid.classList.contains('active')){ //snap a picture on click
            //draw the current image on the canvas
            this.setCanvasBackgroundImage(vid);
            
            //store the snapped image for later use
            this.snappedImage = new Image();
            this.snappedImage.src = this.cElem.toDataURL('image/png');

            //reset the button
            button.innerText = this.camButtonTexts.default;

            //hide the video
            vid.classList.remove('active');

            //stop the webcam stream
            vid.srcObject.getTracks().forEach((track)=>{
                track.stop();
            });
        }else{ //setup the webcam stream on click
            let permissionRequest = { audio: false, video: {width: 1280, height: 720, aspectRatio: 16/9} };
            if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)){ //if these are falsy, the browser does not support webcam input
                alert('Your browser does not support webcam input! :/');
                button.disabled = true;
                return;
            }
            navigator.mediaDevices.getUserMedia(permissionRequest)
                .then((stream)=>{ //webcam access is granted
                    //change the button to snap the current picture
                    button.innerText = this.camButtonTexts.streaming;

                    //let the video be as big as the canvas to take its exact place in the page layout
                    vid.width = this.cElem.width;
                    vid.height = this.cElem.height;

                    //clear the canvas as the video aspect ratio is probably different from the canvas and thus will not occlude all of it
                    this.clearCanvas();

                    //insert the webcam stream into the video
                    vid.srcObject = stream;
                    // vid.onloadeddata = ()=>{vid.play()}; //obsolete with autoPlay JSX property

                    //show the video
                    vid.classList.add('active');
                })
                .catch((err) => { //no webcam access (no camera / no permission / ...)
                    console.log(err);
                    alert('Failed to access your webcam! You can find more information on this error in your browser console.')
                });
        }
    }

    handlePublishButtonClick(e){
        e.target.innerText = this.publishButtonTexts.loading;
        
        this.cElem.toBlob((blob)=>{
            //toBlob returns a image/png per default, could change with mimeType param
            
            const formData = new FormData();
            
            let imageFile = new File([blob], 'dra:w|n/T?!emplate.png', {
                type: 'image/png'
            }); //for whatever reason, the File constructor needs the blob as part of an array and cannot deduce the filetype from the input blob, but ok... //TODO let user choose filename via text input, parse and remove bad characters
            formData.append('image', imageFile);
            formData.append('name', 'my drawn template'); //TODO let user choose name
            formData.append('userID', 0); //TODO get current userID
            formData.append('visibility', 2); //TODO get visibility options from API, display as radiobuttons with numbers as value (public as default), send chosen value here
            
            api.insertTemplate(formData).then((res)=>{
                if(res.data.success){
                    this.props.handlePublishing(res.data.id);
                }
                e.target.innerText = this.publishButtonTexts.default;
            });
        }); 
    }

    componentDidMount(){
        this.setCanvasReferences();
        this.setCanvasDimensions();

        //make the background white instead of transparent (to be removed once we're drawing on top of images)
        this.setCanvasBackgroundColor(this.canvasBackgroundColor);
    }

    componentDidUpdate(){
        this.setCanvasReferences();
    }

    render(){
        return (
            <div id="page-wrapper" onMouseMove={this.handlePageMouseMove} onMouseUp={this.handlePageMouseUp}>
                <h2>Draw Your Own Template!</h2>
                <table id="main-table">
                    <tbody>
                        <tr>
                            <td id="canvas-column">
                                <video id="webcam-input" width="1" autoPlay muted />
                                <canvas
                                    width="1"
                                    height="800"
                                    ref={this.canvasRef}
                                    onMouseDown={this.handleCanvasMouseDown}
                                    onMouseUp={this.handleCanvasMouseUp}
                                    onMouseMove={this.handleCanvasMouseMove}
                                />
                            </td>
                            <td id="options-column">
                                <label>
                                    <span className="option-desc">Stroke Width:</span><br />
                                    <input type="range" name="strokeWidth" min="1" max="20" defaultValue={this.strokeWidth} step="1" onInput={this.handleStrokeWidthInput} />
                                    <span id="label-strokeWidth">{this.strokeWidth}</span>
                                </label>
                                <hr />
                                <span className="option-desc">Stroke Color:</span><br />
                                <label>
                                    <span className="option-desc">
                                        <abbr title="Red color value (0-255)">R</abbr>:
                                    </span>
                                    <input type="range" name="strokeColorR" min="0" max="255" defaultValue={this.strokeColor.R} step="1" onInput={this.handleStrokeColorRInput} />
                                    <span id="label-strokeColorR">{this.strokeColor.R}</span>
                                </label><br />
                                <label>
                                    <span className="option-desc">
                                        <abbr title="Green color value (0-255)">G</abbr>:
                                    </span>
                                    <input type="range" name="strokeColorG" min="0" max="255" defaultValue={this.strokeColor.G} step="1" onInput={this.handleStrokeColorGInput} />
                                    <span id="label-strokeColorG">{this.strokeColor.G}</span>
                                </label><br />
                                <label>
                                    <span className="option-desc">
                                        <abbr title="Blue color value (0-255)">B</abbr>:
                                    </span>
                                    <input type="range" name="strokeColorB" min="0" max="255" defaultValue={this.strokeColor.B} step="1" onInput={this.handleStrokeColorBInput} />
                                    <span id="label-strokeColorB">{this.strokeColor.B}</span>
                                </label>
                                <hr />
                                <button type="button" id="camera-btn" onClick={this.handleCamButtonClick}>{this.camButtonTexts.default}</button>
                                <button type="button" id="clear-btn" onClick={this.handleClearButtonClick}>{this.clearButtonTexts.default}</button>
                                <CanvasDownloadButton placeholderFileName="Your Work of Art.png" onButtonClick={this.handleDownloadButtonClick} />
                                <button type="button" id="publish-btn" onClick={this.handlePublishButtonClick}>{this.publishButtonTexts.default}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}