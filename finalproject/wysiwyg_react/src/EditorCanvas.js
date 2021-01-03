import React, { createRef } from 'react';
import TextBox from './TextBox';

export default class EditorCanvas extends React.Component {
    constructor(props){
        super(props);
        this.canvasRef = this.props.canvasRef;
        this.cElem = ()=>this.canvasRef.current; //returns the current canvas element
        this.cContext = ()=>this.canvasRef.current.getContext('2d'); //returns the current drawing object
        this.image; //TODO maybe move to state instead of bgImage?
        this.textBoxes = []; //array containing all captions, each as an instance of class TextBox
        this.activeTextBoxes = ()=>this.textBoxes.filter((box)=>!box.disabled); //get all non-disabled entries of textBoxes
        this.selectedTextBoxIndex = -1;
        this.hoveringTextBoxIndex = -1;
        this.draggingTextBox = false;
        this.state = {
            bgImage: this.props.bgImage,
            canvasWidth: 1, //small initial values so that the canvas won't mess with the default layout before it can calculate its appropriate size
            canvasHeight: 1,
            cursor: 'text'
        };
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    setBgImage(src){
        if(src.length){
            this.image = new Image();
            this.image.src = src;

            this.image.addEventListener('load', ()=>{
                //the image should be of the same size as the canvas, but the canvas width can't be predetermined in HTML due to only absolute pixel values being allowed in the width attribute (which we have to use as CSS styling messes with stuff like mouse coords)
                //so, let's determine the maximum available width for the canvas (50% of the viewport width minus padding & border)
                let actualStyles = window.getComputedStyle(document.querySelector('#page-left'));
                let actualWidth = parseInt(actualStyles.getPropertyValue('width'));
                let actualPaddingLeft = parseInt(actualStyles.getPropertyValue('padding-left'));
                let actualPaddingRight = parseInt(actualStyles.getPropertyValue('padding-right'));
                let borderWidth = 1;
                let innerWidth = actualWidth-actualPaddingLeft-actualPaddingRight-borderWidth;
                //determine the height that correctly scales the image based on the calculated width
                let scaledImageHeight = parseInt(innerWidth * this.image.height / this.image.width);
                //apply these values
                this.setState({
                    canvasWidth: innerWidth,
                    canvasHeight: scaledImageHeight
                });
                this.repaint(false);
            });
        }
    }

    repaint(clear){
        if(clear){
            //clear the canvas
            this.cContext().clearRect(0, 0, cElem.width, cElem.height);
        }
        //draw the image background
        this.drawImage();
        //draw the text foreground
        this.drawText();
        //draw selection and hovering textbox outlines where necessary
        if(this.selectedTextBoxIndex > -1) this.drawTextBoxOutline(this.textBoxes[this.selectedTextBoxIndex], "black");
        if(this.hoveringTextBoxIndex > -1 && (this.selectedTextBoxIndex != this.hoveringTextBoxIndex)) this.drawTextBoxOutline(this.textBoxes[this.hoveringTextBoxIndex], "gray");
    }

    drawImage(){
        this.cContext().drawImage(this.image,0,0, this.cElem().width, this.cElem().height);
    }
    
    drawText(){
        this.activeTextBoxes().forEach((box) => {
            let text = box.text;
            let c = this.cContext();

            c.font = `${box.bold ? "bold" : "normal"} ${box.fontSize}px ${box.fontFamily}`;
            c.fillStyle = box.color;
            c.strokeStyle = "black";
            c.shadowColor = "black";
            c.shadowBlur = 5;
            c.textBaseline = "top";
            c.lineWidth = 4;

            c.strokeText(text,box.startX,box.startY); //draw the font outline with shadow
            c.shadowBlur = 0;
            c.fillText(text,box.startX,box.startY); //draw the filled font without shadow
        });
    }
    
    drawTextBoxOutline(tb, color){
        let c = this.cContext();
        c.lineWidth = 1;
        c.strokeStyle = color;
        c.beginPath();
        c.moveTo(tb.startX - textBoxPadding,
                tb.startY - textBoxPadding);
        c.lineTo(tb.startX + textBoxPadding + tb.width,
                tb.startY - textBoxPadding);
        c.lineTo(tb.startX + textBoxPadding + tb.width,
                tb.startY + textBoxPadding + tb.height)
        c.lineTo(tb.startX - textBoxPadding,
                tb.startY + textBoxPadding + tb.height);
        c.closePath();
        c.stroke();
    }

    componentDidMount(){
        this.setBgImage(this.props.bgImage);
    }

    componentDidUpdate(){
        this.repaint(false); //no clearing needed as the entire element is replaced
    }

    handleMouseDown(e){
        e = e.nativeEvent; //React events don't have everything we need

        if(e.button!=0) return; //only watch for the left mouse button
            
        this.selectedTextBoxIndex = this.textBoxes.findIndex((box)=>{ //check if the mousedown is on any of our textboxes
            return (!box.disabled && box.contains(e.offsetX, e.offsetY));
        });

        if(this.selectedTextBoxIndex > -1){ //if so, enter dragging mode
            this.draggingTextBox = true;
            //set the dragOffset / move anchor
            this.textBoxes[this.selectedTextBoxIndex].setDragAnchor(e.offsetX, e.offsetY);
            //indicate that we are grabbing this textbox via cursor
            this.setState({cursor: 'grabbing'});
            //show the corresponding caption box
            this.props.globalFunctions.hideAllCaptionBoxesExcept(this.textBoxes[this.selectedTextBoxIndex].controller);
            this.props.globalFunctions.showCaptionBox(this.textBoxes[this.selectedTextBoxIndex].controller);
        }else{
            this.repaint(true);
        }
    }

    handleMouseMove(e){
        e = e.nativeEvent; //React events don't have everything we need

        //first, check if we are currently moving a textbox
        if(this.draggingTextBox){ //if so, just apply the current mouse coords to the box position
            this.textBoxes[this.selectedTextBoxIndex].moveTo(e.offsetX, e.offsetY);
            this.repaint(true);
        }else{ //if not, check if we are hovering over any of our textboxes
            if(this.checkForHoverChange(e.offsetX, e.offsetY)) { //make sure this is a new hover to prevent unnecessarily redoing the same thing
                if(this.hoveringTextBoxIndex > -1){ //if we are hovering over a textbox we haven't been hovering over just before, indicate that we're ready to grab via cursor (setState will trigger repaint)
                    this.setState({cursor: 'grab'});
                }else{ //if we are not hovering over a textbox but have before, reset the cursor (setState will trigger repaint)
                    this.setState({cursor: 'text'});
                }
            }
        }
    }

    handleMouseUp(e){
        e = e.nativeEvent; //React events don't have everything we need

        if(e.button!=0) return; //only watch for the left mouse button
            
        if(!this.draggingTextBox){
            this.addCaptionAt(e.offsetX, e.offsetY);
        }else{
            //exit dragging mode
            this.draggingTextBox = false;
            //reset hover
            this.checkForHoverChange(e.offsetX, e.offsetY);
            //reset cursor accordingly, will trigger repaint
            this.setState({cursor: (this.hoveringTextBoxIndex > -1) ? 'grab' : 'text'});
        }
        e.stopPropagation();
    }

    checkForHoverChange(mouseX, mouseY){
        let hov = this.textBoxes.findIndex((box)=>{
            return (!box.disabled && box.contains(mouseX, mouseY));
        });
        let ret = (hov!=this.hoveringTextBoxIndex);
        this.hoveringTextBoxIndex = hov;
        return ret;
    }

    addCaptionAt(mx, my){
        let newIndex = this.textBoxes.length;
        let newTextBox = new TextBox(this.canvasRef, parseInt(mx), parseInt(my), " ", 60, "white");
        this.textBoxes.push(newTextBox);
        this.props.globalFunctions.addCaptionInput(newTextBox, newIndex);
    }

    render(){
        return (
            <canvas id="canvas-editor" ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} style={{cursor: this.state.cursor}}>Your browser does not support the Canvas Element. Please switch to a more current browser.</canvas>
        );
    }
}