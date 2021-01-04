import React, { createRef } from 'react';
import TextBox from './TextBox';
import './wysiwyg.scss';

// not sensible to divide this up further into React components as the canvas and the form have to be highly interconnected and achieving the desired outcome with dedicated components would result in some truly nightmarish code.

export default class WYSIWYGEditor extends React.Component {
  constructor(props){
    super(props);
    this.canvasRef = createRef();
    this.cElem = ()=>this.canvasRef.current; //returns the current canvas element
    this.cContext = ()=>this.canvasRef.current.getContext('2d'); //returns the current drawing object
    
    this.textBoxes = []; //array containing all captions, each as an instance of class TextBox
    this.activeTextBoxes = ()=>this.textBoxes.filter((box)=>!box.disabled); //get all non-disabled entries of textBoxes
    this.selectedTextBoxIndex = -1;
    this.hoveringTextBoxIndex = -1;
    this.draggingTextBox = false;
    this.placeholderFileName = 'Your Meme';
    
    this.state = {
      image: null,
      canvasWidth: 1, //small initial values so that the canvas won't mess with the default layout before it can calculate its appropriate size
      canvasHeight: 1
    };
    
    //this binding for React event handlers
    [
      'handlePageWrapperMouseUp',
      'handlePageRightClick',
      'handleDownloadButtonClick',
      'handleCanvasMouseDown',
      'handleCanvasMouseMove',
      'handleCanvasMouseUp'
    ].forEach((handler)=>{
      this[handler] = this[handler].bind(this);
    });
  }

  setTemplateImage(src){
    if(src.length){
      let img = new Image();
      img.src = src;

      img.addEventListener('load', ()=>{
        //the image should be of the same size as the canvas, but the canvas width can't be predetermined in HTML due to only absolute pixel values being allowed in the width attribute (which we have to use as CSS styling messes with stuff like mouse coords)
        //so, let's determine the maximum available width for the canvas (50% of the viewport width minus padding & border)
        let actualStyles = window.getComputedStyle(document.querySelector('#page-left'));
        let actualWidth = parseInt(actualStyles.getPropertyValue('width'));
        let actualPaddingLeft = parseInt(actualStyles.getPropertyValue('padding-left'));
        let actualPaddingRight = parseInt(actualStyles.getPropertyValue('padding-right'));
        let borderWidth = 1;
        let innerWidth = actualWidth-actualPaddingLeft-actualPaddingRight-borderWidth;
        //determine the height that correctly scales the image based on the calculated width
        let scaledImageHeight = parseInt(innerWidth * img.height / img.width);
        //apply these values
        this.setState({
          canvasWidth: innerWidth,
          canvasHeight: scaledImageHeight,
          image: img
        });
      });
    }else{
      this.setState({image: null});
      this.cContext().clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }
  }

  repaint(clear){
    if(clear){
      //clear the canvas
      this.cContext().clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }
    //draw the image background
    this.drawImage();
    //draw the text foreground
    this.drawText();
    //draw selection and hovering textbox outlines where necessary
    this.drawSelectedOutline();
    this.drawHoveredOutline();
  }

  drawImage(){
    this.cContext().drawImage(this.state.image, 0, 0, this.state.canvasWidth, this.state.canvasHeight);
  }

  drawText(){
    this.activeTextBoxes().forEach((box) => {
      box.drawText();
    })
  }

  drawSelectedOutline(){
    if(this.selectedTextBoxIndex > -1){
      this.textBoxes[this.selectedTextBoxIndex].drawOutline("black");
    }
  }

  drawHoveredOutline(){
    if(this.hoveringTextBoxIndex > -1 && (this.selectedTextBoxIndex != this.hoveringTextBoxIndex)){
      this.textBoxes[this.hoveringTextBoxIndex].drawOutline("gray");
    }
  }

  deselectAllCaptions(){
      this.selectedTextBoxIndex = -1;
      this.repaint(true);
      this.hideAllCaptionBoxesExcept(null);
  }

  checkForHoverChange(mouseX, mouseY){
    let hov = this.textBoxes.findIndex((box)=>{
        return (!box.disabled && box.contains(mouseX, mouseY));
    });
    let ret = (hov!=this.hoveringTextBoxIndex);
    this.hoveringTextBoxIndex = hov;
    return ret;
  }

  checkForSelectionChange(mouseX, mouseY){
    let sel = this.textBoxes.findIndex((box)=>{
        return (!box.disabled && box.contains(mouseX, mouseY));
    });
    let ret = (sel!=this.selectedTextBoxIndex);
    this.selectedTextBoxIndex = sel;
    return ret;
  }

  addCaptionAt(x, y){
    //add new textbox
    let newIndex = this.textBoxes.length;
    let newTextBox = new TextBox(this.canvasRef, parseInt(x), parseInt(y), " ", 60, "white");
    this.textBoxes.push(newTextBox);

    //add new caption input elements
    let li = this.createCaptionInputLi();
    document.getElementById('in-captions-list').appendChild(li);

    //get caption input sub-elements for easy access
    let captionInput = li.querySelector('.in-caption');
    let captionDetails = li.querySelector('details');
    let captionRemove = li.querySelector('.in-caption-delete');
    let fontSizeInput = li.querySelector('input[name=fontSize]');
    let fontSizeLabel = li.querySelector('.label-fontSize');
    let boldInput = li.querySelector('input[name=bold]');
    let colorControls = {
      inputR: li.querySelector('input[name=colorR]'),
      inputG: li.querySelector('input[name=colorG]'),
      inputB: li.querySelector('input[name=colorB]'),
      labelR: li.querySelector('.label-colorR'),
      labelG: li.querySelector('.label-colorG'),
      labelB: li.querySelector('.label-colorB'),
    };
    let colorRInput = li.querySelector('input[name=colorR]');
    let colorRLabel = li.querySelector('.label-colorR');
    let colorGInput = li.querySelector('input[name=colorG]');
    let colorGLabel = li.querySelector('.label-colorG');
    let colorBInput = li.querySelector('input[name=colorB]');
    let colorBLabel = li.querySelector('.label-colorB');
    let fontFaceInput = li.querySelector('select[name=fontFace]');

    //link the new textbox with the corresponding input wrapper
    newTextBox.setController(captionDetails);

    //add EventListeners for the new input elements
    li.addEventListener('focus', (e)=>{
      if(e.target != captionRemove){
        if(!captionDetails.open) this.showCaptionBox(captionDetails);
        this.hideAllCaptionBoxesExcept(captionDetails);
        this.selectedTextBoxIndex = newIndex;
        this.repaint(true);
      }
    }, true); //this one should fire during capturing so that when the inner text <input> gets focus, this code is executed before standard focus handling of the input and can't mess with it afterwards
    li.addEventListener('click', (e)=>{
      if(e.target != captionRemove){
        //stop the de-selection onclick EventListener from reaching the caption <li>s
        e.stopPropagation();
      }
    }, true); //just to be sure, let this also fire during capturing for stopPropagation() to affect the click listener on #page-right

    captionRemove.addEventListener('click', (e)=>{
      // e.stopPropagation();
      newTextBox.disable();
      this.selectedTextBoxIndex = -1;
      this.repaint(true);
      li.style.display = 'none';
    });
    captionInput.addEventListener('input', (e)=>{
      newTextBox.updateText(e.target.value);
      this.repaint(true);
    });
    fontSizeInput.addEventListener('input', (e)=>{
      newTextBox.updateFontSize(parseInt(e.target.value));
      this.repaint(true);
      fontSizeLabel.textContent = e.target.value+'px';
    });
    boldInput.addEventListener('change', (e)=>{
      newTextBox.updateBold(e.target.checked);
      this.repaint(true);
    });
    ['R','G','B'].forEach((col)=>{
      colorControls['input'+col].addEventListener('input', (e)=>{
        newTextBox.updateColor(`rgb(${colorControls.inputR.value},${colorControls.inputG.value},${colorControls.inputB.value})`);
        this.repaint(true);
        colorControls['label'+col].textContent = e.target.value;
      });
    });
    fontFaceInput.addEventListener('change', (e)=>{
      newTextBox.updateFontFamily(e.target.value);
      this.repaint(true);
    });
    
    //select and highlight the new input elements for immediate input
    captionInput.focus();
    captionInput.select();
    captionDetails.style.backgroundColor = '#d9e5ee';
    captionDetails.style.transitionDuration = '.3s';
    this.hideAllCaptionBoxesExcept(captionDetails);
  }

  createCaptionInputLi(){
    let li = document.createElement('li');
    li.innerHTML = `
      <details>
          <summary>
              <input class="in-caption" type="text" placeholder="Please enter a caption...">
              <button type="button" class="in-caption-delete" title="Remove this caption">&#10006;</button>
          </summary>
          <div class="in-caption-formatting-wrapper">
              <table class="in-caption-formatting-table">
                  <tbody>
                      <tr>
                          <th>Font Size:</th>
                          <td>
                              <label>
                                  <input type="range" name="fontSize" min="10" max="200" value="60" step="1">
                                  <span class="label-fontSize">60px</span>
                              </label>
                              <label>
                                  <input type="checkbox" name="bold">
                                  bold
                              </label>
                          </td>
                      </tr>
                      <tr>
                          <th>Font Color:</th>
                          <td>
                              <label>
                                  <abbr title="Red color value (0-255)">R</abbr>:
                                  <input type="range" name="colorR" min="0" max="255" value="255" step="1">
                                  <span class="label-colorR">255</span>
                              </label>
                              <label>
                                  <abbr title="Green color value (0-255)">G</abbr>:
                                  <input type="range" name="colorG" min="0" max="255" value="255" step="1">
                                  <span class="label-colorG">255</span>
                              </label>
                              <label>
                                  <abbr title="Blue color value (0-255)">B</abbr>:
                                  <input type="range" name="colorB" min="0" max="255" value="255" step="1">
                                  <span class="label-colorB">255</span>
                              </label>
                          </td>
                      </tr>
                      <tr>
                          <th>Font Face:</th>
                          <td>
                              <select name="fontFace">
                                  <option value="Impact" selected>Impact</option>
                                  <option value="Arial">Arial</option>
                                  <option value="Verdana">Verdana</option>
                                  <option value="Helvetica">Helvetica</option>
                                  <option value="Tahoma">Tahoma</option>
                                  <option value="Trebuchet MS">Trebuchet MS</option>
                                  <option value="Times New Roman">Times New Roman</option>
                                  <option value="Georgia">Georgia</option>
                                  <option value="Garamond">Garamond</option>
                                  <option value="Courier New">Courier New</option>
                                  <option value="Brush Script MT">Brush Script MT</option>
                              </select>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </details>
    `;
    return li;
  }

  hideAllCaptionBoxesExcept(element){
    document.querySelectorAll('#in-captions-list details').forEach((el)=>{
      if(el!=element){
        el.style.backgroundColor = "transparent";
        el.open = false;
      }
    });
  }

  showCaptionBox(element){
    element.open = true;
    element.style.backgroundColor = "#d9e5ee";
  }

  setCanvasCursor(cursor){
    this.cElem().style.cursor = cursor;
  }

  handlePageWrapperMouseUp(e){
    e = e.nativeEvent; //React events don't have offsetX/Y

    if(e.button!=0) return; //only watch for the left mouse button
    
    //if we are / were dragging a textbox around...
    if(this.draggingTextBox) {
      //exit dragging mode
      this.draggingTextBox = false;
      //reset hover
      this.checkForHoverChange(e.offsetX, e.offsetY);
      //reset cursor accordingly
      this.setCanvasCursor((this.hoveringTextBoxIndex > -1) ? 'grab' : 'text');
      //full repaint is inevitable
      this.repaint(true);
    }
  }

  handlePageRightClick(e){
    //if we click on the blank space around the caption boxes on the right side of the page, de-select it and the corresponding textbox in the canvas
    this.deselectAllCaptions();
  }

  handleDownloadButtonClick(e){
    // remove all caption outlines
    this.deselectAllCaptions();
    //get the current canvas image
    let url = this.cElem().toDataURL('image/png');
    
    //download it
    let a = document.getElementById('download-anchor');
    //use the entered Meme title as filename if there is one
    let enteredTitle = document.getElementById('in-title').value;
    a.download = (enteredTitle || 'Your Meme')+'.png';
    a.href = url;
    //we don't have to do the deselection again, so let's prevent the event from bubbling up to #page-right
    e.stopPropagation();
  }

  handleCanvasMouseDown(e){
    e = e.nativeEvent; //React events don't have offsetX/Y

    if(e.button!=0) return; //only watch for the left mouse button
    
    let oldSel = this.selectedTextBoxIndex;
    //check if the mousedown is a new selection of any of our textboxes
    if(this.checkForSelectionChange(e.offsetX, e.offsetY)){
      //we can get away without a full repaint if nothing else was selected before
      if(oldSel > -1) this.repaint(true);
      else this.drawSelectedOutline();
    }

    if(this.selectedTextBoxIndex > -1){ //if we selected a box, enter dragging mode
      this.draggingTextBox = true;
      //set the dragOffset / move anchor
      this.textBoxes[this.selectedTextBoxIndex].setDragAnchor(e.offsetX, e.offsetY);
      //indicate that we are grabbing this textbox via cursor
      this.setCanvasCursor('grabbing');
      //show the corresponding caption box
      this.hideAllCaptionBoxesExcept(this.textBoxes[this.selectedTextBoxIndex].controller);
      this.showCaptionBox(this.textBoxes[this.selectedTextBoxIndex].controller);
    }
  }
  
  handleCanvasMouseMove(e){
    e = e.nativeEvent; //React events don't have offsetX/Y

    //first, check if we are currently moving a textbox
    if(this.draggingTextBox){ //if so, just apply the current mouse coords to the box position
      this.textBoxes[this.selectedTextBoxIndex].moveTo(e.offsetX, e.offsetY);
      this.repaint(true);
    }else{ //if not, check if we are hovering over any of our textboxes
      let oldHov = this.hoveringTextBoxIndex;
      if(this.checkForHoverChange(e.offsetX, e.offsetY)) { //make sure this is a new hover to prevent unnecessarily redoing the same thing
        if(this.hoveringTextBoxIndex > -1){ //if we are hovering over a textbox we haven't been hovering over just before...
          //highlight that textbox via outline (we can get away without a full repaint if nothing else was hovered over before)
          if(oldHov > -1) this.repaint(true);
          else this.drawHoveredOutline();
          // indicate that we're ready to grab via cursor
          this.setCanvasCursor('grab');
        }else{ //if we are not hovering over a textbox but have before, remove the highlighting and reset the cursor
          this.repaint(true);
          this.setCanvasCursor('text');
        }
      }
    }
  }
  
  handleCanvasMouseUp(e){
    e = e.nativeEvent; //React events don't have offsetX/Y

    if(e.button!=0) return; //only watch for the left mouse button
    
    if(!this.draggingTextBox){
      this.addCaptionAt(e.offsetX, e.offsetY);
    } //else case will be handled once the event bubbles up to the document via handlePageWrapperMouseUp()
  }
  
  componentDidMount(){ //TODO check if CSS font has for sure loaded if textboxes should be visible from the start (e.g. for loading meme drafts)
    
    //debug: add textboxes in Impact to test the (cache-free) font loading
    // this.textBoxes.push(new TextBox(this.canvasRef, 10, 10, "Holiday", 50, "white"));
    // this.textBoxes.push(new TextBox(this.canvasRef, 200, 10, "OMM", 50, "white"));
    //---
    this.setTemplateImage(this.props.templateImagePath);
  }

  componentDidUpdate(){
    this.repaint(false); //no clearing needed as the entire element is replaced
  }
  
  render(){
    return (
      <table id="page-wrapper" onMouseUp={this.handlePageWrapperMouseUp}>
        <tbody>
          <tr>
            <td id="page-left">
              <input id="in-title" type="text" placeholder="Enter a title for your meme post..." />
              <canvas id="canvas-editor"
                ref={this.canvasRef}
                width={this.state.canvasWidth}
                height={this.state.canvasHeight}
                onMouseDown={this.handleCanvasMouseDown}
                onMouseMove={this.handleCanvasMouseMove}
                onMouseUp={this.handleCanvasMouseUp}
              >Your browser does not support the Canvas Element. Please switch to a more current browser.</canvas>
            </td>
            <td id="page-right" onClick={this.handlePageRightClick}>
              <form>
                <h2>Add some Captions to your Meme</h2>
                <p>Click somewhere in the image to add a caption at that point.<span id="force-font-preload"></span></p>
                <ul id="in-captions-list"></ul>
                <a id="download-anchor" download={this.placeholderFileName+".png"}>
                  <button type="button" id="download-btn" onClick={this.handleDownloadButtonClick}>Download image</button>
                </a>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
