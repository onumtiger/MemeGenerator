import React, { createRef } from 'react';
import './wysiwyg.scss';
import EditorCanvas from './EditorCanvas';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.canvasCompRef = createRef();
    this.canvasRef = createRef();
    this.state = {

    };
    this.globalFunctions = {
      hideAllCaptionBoxesExcept: function(ref){
        document.querySelectorAll('#in-captions-list details').forEach((el)=>{
          if(el!=ref.current){
            el.style.backgroundColor = "transparent";
            el.open = false;
          }
        });
      },
      showCaptionBox: function(ref){
        let element = ref.current;
        element.open = true;
        element.style.backgroundColor = "#d9e5ee";
      },
      addCaptionInput: function(textbox, index){
        //TODO add <CaptionInput textBoxIndex={index} />
        //TODO attach handlers, manage focus etc
      }
    };
    this.handlePageWrapperMouseUp = this.handlePageWrapperMouseUp.bind(this);
    this.handlePageRightClick = this.handlePageRightClick.bind(this);
    this.handleDownloadButtonClick = this.handleDownloadButtonClick.bind(this);
  }
  handleDownloadButtonClick(e){
    // remove all caption outlines
    this.deselectAllCaptions();
    //download the current canvas image
    let cElem = document.getElementById('canvas-editor');
    let anchor = document.getElementById('download-anchor');
    anchor.href = cElem.toDataURL('image/png');
    //we don't have to do the deselection again, so let's prevent the event from bubbling up to #page-right
    e.stopPropagation();
  }
  handlePageWrapperMouseUp(e){
    if(e.button!=0) return; //only watch for the left mouse button

    this.canvasCompRef.current.handleMouseUp(e); //TODO this also forwards unrelated events, we have to call the else case separately here.
  }

  handlePageRightClick(e){
    //if we click on the blank space around the caption boxes on the right side of the page, de-select it and the corresponding textbox in the canvas
    this.deselectAllCaptions();
  }
  
  render(){
    return (
      <table id="page-wrapper" onMouseUp={this.handlePageWrapperMouseUp}>
        <tbody>
          <tr>
            <td id="page-left">
              <input id="in-title" type="text" placeholder="Enter a title for your meme post..." />
              <EditorCanvas ref={this.canvasCompRef} canvasRef={this.canvasRef} bgImage="testmeme.png" globalFunctions={this.globalFunctions} />
            </td>
            <td id="page-right" onClick={this.handlePageRightClick}>
              <form>
                <h2>Add some Captions to your Meme</h2>
                <p>Click somewhere in the image to add a caption at that point.<span id="force-font-preload"></span></p>
                <ul id="in-captions-list"></ul>
                <a id="download-anchor" download="Your Meme.png">
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
