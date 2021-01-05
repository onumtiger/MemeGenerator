import React, { createRef } from 'react';
import CanvasDownloadButton from './CanvasDownloadButton';
import './drawtemplate.scss';

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
            'handleClearButtonClick'
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    setCanvasReferences(){
        this.cElem = this.canvasRef.current;
        this.cContext = this.canvasRef.current.getContext('2d');
    }

    setCanvasWidth() {
        let availSpace = document.getElementById('canvas-column').offsetWidth;
        //account for canvas border
        availSpace -= 2;
        this.cElem.width = availSpace;
    }

    setCanvasBackground(color) {
        this.cContext.fillStyle = color;
        this.cContext.fillRect(0, 0, this.cElem.width, this.cElem.height);
    }

    handleCanvasMouseDown(e){
        e = e.nativeEvent; //React events don't have offsetX/Y

        this.drawing = true;
        this.lastPos = {x: e.offsetX, y: e.offsetY};
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
        // this.cContext.clearRect(0, 0, this.cElem.width, this.cElem.height);
        this.setCanvasBackground(this.canvasBackgroundColor);
    }

    componentDidMount(){
        this.setCanvasReferences();
        this.setCanvasWidth();

        //make the background white instead of transparent (to be removed once we're drawing on top of images)
        this.setCanvasBackground(this.canvasBackgroundColor);
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
                                    <span class="option-desc">Stroke Width:</span><br />
                                    <input type="range" name="strokeWidth" min="1" max="20" defaultValue={this.strokeWidth} step="1" onInput={this.handleStrokeWidthInput} />
                                    <span id="label-strokeWidth">{this.strokeWidth}</span>
                                </label>
                                <hr />
                                <span class="option-desc">Stroke Color:</span><br />
                                <label>
                                    <span class="option-desc">
                                        <abbr title="Red color value (0-255)">R</abbr>:
                                    </span>
                                    <input type="range" name="strokeColorR" min="0" max="255" defaultValue={this.strokeColor.R} step="1" onInput={this.handleStrokeColorRInput} />
                                    <span id="label-strokeColorR">{this.strokeColor.R}</span>
                                </label><br />
                                <label>
                                    <span class="option-desc">
                                        <abbr title="Green color value (0-255)">G</abbr>:
                                    </span>
                                    <input type="range" name="strokeColorG" min="0" max="255" defaultValue={this.strokeColor.G} step="1" onInput={this.handleStrokeColorGInput} />
                                    <span id="label-strokeColorG">{this.strokeColor.G}</span>
                                </label><br />
                                <label>
                                    <span class="option-desc">
                                        <abbr title="Blue color value (0-255)">B</abbr>:
                                    </span>
                                    <input type="range" name="strokeColorB" min="0" max="255" defaultValue={this.strokeColor.B} step="1" onInput={this.handleStrokeColorBInput} />
                                    <span id="label-strokeColorB">{this.strokeColor.B}</span>
                                </label>
                                <hr />
                                <button type="button" id="clear-btn" onClick={this.handleClearButtonClick}>Clear Canvas</button>
                                <CanvasDownloadButton placeholderFileName="Your Work of Art.png" onButtonClick={this.handleDownloadButtonClick} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}