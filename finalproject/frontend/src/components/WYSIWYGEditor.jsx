import React, { createRef } from 'react';
import {CanvasDownloadButton, CanvasUploadButton} from '.';
import TextBox from '../abstract/TextBox';
import '../style/WYSIWYG.scss';
import api from '../api';
import Main from '../speech/main';

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

    this.fontSizeMin = 10;
    this.fontSizeMax = 200;
    this.fontFaces = ["Impact", "Arial", "Verdana", "Helvetica", "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", "Courier New", "Brush Script MT"];
    this.colorValueMin = 0;
    this.colorValueMax = 255;

    this.textBoxDefaults = {
      fontSize: 60,
      colorR: this.colorValueMax,
      colorG: this.colorValueMax,
      colorB: this.colorValueMax
    };
    this.recordButtonActive = false;
    
    this.selectedVisibilityElem = null;
    
    this.state = {
      image: null,
      canvasWidth: 1, //small initial values so that the canvas won't mess with the default layout before it can calculate its appropriate size
      canvasHeight: 1
    };

    this.draftButtonTexts = {
      default: 'Save as Draft',
      done: 'Draft Saved! Save again?',
      loading: 'Saving...'
    };
    
    //this binding for React event handlers
    [
      'handlePageWrapperMouseUp',
      'handlePageRightClick',
      'handleDownloadButtonClick',
      'handleCanvasMouseDown',
      'handleCanvasMouseMove',
      'handleCanvasMouseUp',
      'handlePublishedMeme',
      'assembleUploadFormData',
      'handleVisibilityOptionCheck',
      'handleDraftButtonClick', 
      'updateText'
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
        let actualStyles = window.getComputedStyle(document.querySelector('#wysiwyg-wrapper #page-left'));
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
        
        if(this.props.draft){
          let draft = this.props.draft;
          document.querySelector('#wysiwyg-wrapper #in-title').value = draft.title;
          draft.captions.forEach((d)=>{
            this.addCaption(d.x, d.y, d.text, d.fontSize, d.colorR, d.colorG, d.colorB, d.bold, d.italic, d.fontFace, false);
          });
          this.deselectAllCaptions();
        }
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
    if(this.state.image){
      this.cContext().drawImage(this.state.image, 0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }
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

  /**
   * called by voice recording methods -> main.js
   * @param {TextBox} textBox 
   * @param {String} value 
   * @param {Boolean} recordButtonActive 
   */
  updateText(textBox, value, recordButtonActive){
    this.recordButtonActive = recordButtonActive
    textBox.updateText(value);
    this.repaint(true);
  }

  addCaption(x, y, text, fontSize, colorR, colorG, colorB, bold, italic, fontFace, fromUserClick){
    //add new textbox
    let newIndex = this.textBoxes.length;
    let newTextBox = new TextBox(this.canvasRef, parseInt(x), parseInt(y), text, fontSize, colorR, colorG, colorB, bold, italic, fontFace);
    this.textBoxes.push(newTextBox);

    //add new caption input elements
    let li = this.createCaptionInputLi();
    document.querySelector('#wysiwyg-wrapper #in-captions-list').appendChild(li);

    //get caption input sub-elements for easy access
    let captionInput = li.querySelector('.in-caption');
    let captionDetails = li.querySelector('details');
    let captionRemove = li.querySelector('.in-caption-delete');
    let speechButton = li.querySelector('.speech-button');
    let fontSizeInput = li.querySelector('input[name=fontSize]');
    let fontSizeLabel = li.querySelector('.label-fontSize');
    let boldInput = li.querySelector('input[name=bold]');
    let italicInput = li.querySelector('input[name=italic]');
    let colorControls = {
      inputR: li.querySelector('input[name=colorR]'),
      inputG: li.querySelector('input[name=colorG]'),
      inputB: li.querySelector('input[name=colorB]'),
      labelR: li.querySelector('.label-colorR'),
      labelG: li.querySelector('.label-colorG'),
      labelB: li.querySelector('.label-colorB'),
    };
    let fontFaceInput = li.querySelector('select[name=fontFace]');

    //link the new textbox with the corresponding input wrapper
    newTextBox.setController(captionDetails);

    //set the given input values, check if they are within the allowed values where necessary
    captionInput.value = text;
    let saneFontSize = Math.max(this.fontSizeMin, Math.min(this.fontSizeMax, fontSize));
    fontSizeInput.value = saneFontSize;
    fontSizeLabel.textContent = saneFontSize+'px';
    let saneColorR = Math.max(this.colorValueMin, Math.min(this.colorValueMax, colorR));
    colorControls.inputR.value = saneColorR;
    colorControls.labelR.textContent = saneColorR;
    let saneColorG = Math.max(this.colorValueMin, Math.min(this.colorValueMax, colorG));
    colorControls.inputG.value = saneColorG;
    colorControls.labelG.textContent = saneColorG;
    let saneColorB = Math.max(this.colorValueMin, Math.min(this.colorValueMax, colorB));
    colorControls.inputB.value = saneColorB;
    colorControls.labelB.textContent = saneColorB;
    boldInput.checked = bold;
    italicInput.checked = italic;
    fontFaceInput.value = this.fontFaces.find((v)=>(v==fontFace)) || "Impact";

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
      if(e.target != captionRemove && e.target != speechButton){
        //stop the de-selection onclick EventListener from reaching the caption <li>s
        e.stopPropagation();
      }
    }, true); //just to be sure, let this also fire during capturing for stopPropagation() to affect the click listener on #page-right


    // Event listener for the record button
    speechButton.addEventListener('click', (e)=>{
     // do nothing of already recording, if not then ...
      if(!this.recordButtonActive){
        this.recordButtonActive = true;

        // Button styling changes when clicked 
        speechButton.innerHTML="... recording";
        speechButton.style.backgroundColor = "red"
        speechButton.style.color = "white"
        
        // CALL VOICE INPUT -> "speechRecognition" handles everything from now on 
        Main.speechRecognition(speechButton, captionInput, this.updateText, newTextBox, this.recordButtonActive)  
      } 
    });

    captionRemove.addEventListener('click', (e)=>{
      // e.stopPropagation();
      newTextBox.disable();
      this.selectedTextBoxIndex = -1;
      this.repaint(true);
      li.style.display = 'none';
    });
    captionInput.addEventListener('input', (e)=>{
      this.updateText(newTextBox, e.target.value);
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
    italicInput.addEventListener('change', (e)=>{
      newTextBox.updateItalic(e.target.checked);
      this.repaint(true);
    });
    ['R','G','B'].forEach((col)=>{
      colorControls['input'+col].addEventListener('input', (e)=>{
        newTextBox.updateColor(colorControls.inputR.value, colorControls.inputG.value, colorControls.inputB.value);
        this.repaint(true);
        colorControls['label'+col].textContent = e.target.value;
      });
    });
    fontFaceInput.addEventListener('change', (e)=>{
      newTextBox.updateFontFamily(e.target.value);
      this.repaint(true);
    });
    
    if(fromUserClick){
      //select and highlight the new input elements for immediate input
      captionInput.focus();
      captionInput.select();
      captionDetails.style.backgroundColor = '#d9e5ee';
      captionDetails.style.transitionDuration = '.3s';
      this.hideAllCaptionBoxesExcept(captionDetails);
    }
  }

  createCaptionInputLi(){
    let li = document.createElement('li');
    let child = document.querySelector('#wysiwyg-wrapper #in-captions-template-li').firstChild.cloneNode(true);
    li.appendChild(child);
    return li;
  }

  hideAllCaptionBoxesExcept(element){
    document.querySelectorAll('#wysiwyg-wrapper #in-captions-list details').forEach((el)=>{
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
    let a = document.querySelector('#wysiwyg-wrapper .canvas-download-anchor');
    //use the entered Meme title as filename if there is one
    let enteredTitle = document.querySelector('#wysiwyg-wrapper #in-title').value;
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
      this.addCaption(e.offsetX, e.offsetY, "", this.textBoxDefaults.fontSize, this.textBoxDefaults.colorR, this.textBoxDefaults.colorG, this.textBoxDefaults.colorB, false, false, "Impact", true);
    } //else case will be handled once the event bubbles up to the document via handlePageWrapperMouseUp()
  }

  handlePublishedMeme(memeId){
    if(this.props.draft){
      //TODO actual user ID...
      api.deleteDraft(0, this.props.draft._id);
    }
    this.props.history.push('/memes/view/'+memeId);
  }

  handleVisibilityOptionCheck(e){
    let elem = e.target;
    
    if(elem.checked){
      this.selectedVisibilityElem = elem;
      document.querySelector('#wysiwyg-wrapper #visibilityOption-wrapper').classList.remove('invalid');
    }
  }

  handleDraftButtonClick(e){
    let elem = e.target;

    let draftData = {
      template_src: this.state.image.src,
      title: document.querySelector('#wysiwyg-wrapper #in-title').value || 'Created Meme',
      captions: []
    };
    this.activeTextBoxes().forEach((box) => {
      draftData.captions.push({
        x: box.getX(),
        y: box.getY(),
        text: box.getText(),
        fontSize: box.getFontSize(),
        colorR: box.getColorR(),
        colorG: box.getColorG(),
        colorB: box.getColorB(),
        bold: box.getBold(),
        italic: box.getItalic(),
        fontFace: box.getFontFace()
      });
    })

    elem.textContent = this.draftButtonTexts.loading;
    elem.classList.add('inactive');
    //TODO actual user ID...
    api.insertDraft(draftData, 0).then((res)=>{
        if(res.data.success){
            elem.textContent = this.draftButtonTexts.done;
        }
    }).catch(err =>{
        console.log('Failed to upload draft: ',err);
    }).finally(()=>{
        elem.textContent = this.draftButtonTexts.default;
        elem.classList.remove('inactive');
    });
  }
  
  assembleUploadFormData(){
    this.deselectAllCaptions();
    const formData = new FormData();

    let enteredTitle = document.querySelector('#wysiwyg-wrapper #in-title').value;
    formData.append('name', enteredTitle || 'Created Meme');
    formData.append('userID', 0); //TODO get current userID
    
    if(!this.selectedVisibilityElem){
      document.querySelector('#wysiwyg-wrapper #visibilityOption-wrapper').classList.add('invalid');
      return null;
    }
    formData.append('visibility', this.selectedVisibilityElem.value);

    let captions = [];
    //get caption texts from active textBoxes
    this.activeTextBoxes().forEach((box) => {
      captions.push(box.getText());
    })
    formData.append('captions', captions);

    return formData;
  }
  
  componentDidMount(){
    this.setTemplateImage(this.props.templateImagePath);

    //TODO insert actual userId
    api.getTemplateVisibilityOptions(0).then((response)=>{
      let voWrapper = document.querySelector('#wysiwyg-wrapper #visibilityOption-wrapper');
      response.data.data.forEach(vo => {
        voWrapper.innerHTML += `
        <p class="visibilityOption">
          <input type="radio" name="visibility" id=${"visibility-"+vo.value} value=${vo.value} />
          <label for=${"visibility-"+vo.value}>${vo.name}</label>
        </p>`;

        voWrapper.querySelector(`#${"visibility-"+vo.value}`).addEventListener('change', this.handleVisibilityOptionCheck);
      });
    }).catch(err =>{
        console.log('Failed to get visibility options: ',err);
    });
  }

  componentDidUpdate(){
    this.repaint(false); //no clearing needed as the entire element is replaced
  }
  
  render(){
    return (
      <table id="wysiwyg-wrapper" className="fullsizetable" onMouseUp={this.handlePageWrapperMouseUp}>
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
                <h3>Now, add some Captions to your Meme!</h3>
                <p>Click somewhere in the image to add a caption at that point.</p>
                <ul id="in-captions-list">
                  <li id="in-captions-template-li">
                    <details>
                      <summary>
                        <input className="in-caption" type="text" placeholder="Please enter a caption..." />
                        <button type="button" className="speech-button" id="speech-button" title="dictate caption">dictate caption</button>
                        <button type="button" className="in-caption-delete" title="Remove this caption">&#10006;</button>
                      </summary>
                      <div className="in-caption-formatting-wrapper">
                        <table className="in-caption-formatting-table fullsizetable">
                          <tbody>
                            <tr>
                              <th>Font Size:</th>
                              <td>
                                <label>
                                  <input type="range" name="fontSize" min={this.fontSizeMin} max={this.fontSizeMax} defaultValue={this.textBoxDefaults.fontSize} step="1" />
                                  <span className="label-fontSize">{this.textBoxDefaults.fontSize+'px'}</span>
                                </label>
                                <label>
                                  <input type="checkbox" name="bold" />
                                  bold
                                </label>
                                <label>
                                  <input type="checkbox" name="italic" />
                                  italic
                                </label>
                              </td>
                            </tr>
                            <tr>
                              <th>Font Color:</th>
                              <td>
                                <label>
                                  <abbr title={`Red color value (${this.colorValueMin}-${this.colorValueMax})`}>R</abbr>:
                                  <input type="range" name="colorR" min={this.colorValueMin} max={this.colorValueMax} defaultValue={this.textBoxDefaults.colorR} step="1" />
                                  <span className="label-colorR">{this.textBoxDefaults.colorR}</span>
                                </label>
                                <label>
                                  <abbr title={`Green color value (${this.colorValueMin}-${this.colorValueMax})`}>G</abbr>:
                                  <input type="range" name="colorG" min={this.colorValueMin} max={this.colorValueMax} defaultValue={this.textBoxDefaults.colorG} step="1" />
                                  <span className="label-colorG">{this.textBoxDefaults.colorG}</span>
                                </label>
                                <label>
                                  <abbr title={`Blue color value (${this.colorValueMin}-${this.colorValueMax})`}>B</abbr>:
                                  <input type="range" name="colorB" min={this.colorValueMin} max={this.colorValueMax} defaultValue={this.textBoxDefaults.colorB} step="1" />
                                  <span className="label-colorB">{this.textBoxDefaults.colorB}</span>
                                </label>
                              </td>
                            </tr>
                            <tr>
                              <th>Font Face:</th>
                              <td>
                                <select name="fontFace">
                                  {this.fontFaces.map((name)=>(
                                    <option value={name} key={name}>{name}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </details>
                  </li>
                </ul>
                <div id="visibilityOption-wrapper"></div>
                <button type="button" id="save-draft-btn" onClick={this.handleDraftButtonClick}>{this.draftButtonTexts.default}</button>
                <CanvasDownloadButton placeholderFileName={this.placeholderFileName+".png"} onButtonClick={this.handleDownloadButtonClick} />
                <CanvasUploadButton canvasRef={this.canvasRef} uploadSuccessCallback={this.handlePublishedMeme} assembleFormData={this.assembleUploadFormData} apiFunctionName="insertMeme" />
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
