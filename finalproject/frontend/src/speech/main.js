const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

//recognition.continuous = true;
var recordButtonUpdate;
var inputField;
var updateTextFunction;
var updateTextBox;
var updateRecordButtonActive;

/**
 * Handles all voice input for captions in the WYSIWYG Editor
 * @param {*} recordButton 
 * @param {*} captionInput 
 * @param {*} updateText 
 * @param {*} textBox 
 * @param {*} recordButtonActive 
 */

const speechRecognition = (recordButton, captionInput, updateText, textBox, recordButtonActive) => {

    // save variables from calling class
    recordButtonUpdate = recordButton;
    inputField = captionInput;
    updateTextFunction = updateText;
    updateTextBox = textBox; 
    updateRecordButtonActive = recordButtonActive;
    inputField.innerHTML = " ... recording";

    // checks if browser supports voice recognition
    if(SpeechRecognition){
        console.log("Your Browser supports speech recognition");
        recognition.start();         
    } else {
        console.log("Your Browser does not support speech recognition");
        recordButton.innerHTML="change browser"
    }

    // event listeners
    recognition.addEventListener("start", startRecording)
    recognition.addEventListener("result", result)
    recognition.addEventListener("end", stopRecording)
    
}

// gets called when there is no voice input any more
const result = (event) =>{
    // read voice input
    const transcript = event.results[0][0].transcript;
    inputField.value=transcript
    recordButtonUpdate.style.backgroundColor = "yellowgreen"
    recordButtonUpdate.innerHTML = "done!"; 
    updateRecordButtonActive = false;
    // call update text for text to appear in image
    updateTextFunction(updateTextBox, transcript, updateRecordButtonActive)
    // some button gui changes -> reset
    setTimeout(function () {
        recordButtonUpdate.style.backgroundColor = "transparent"
        recordButtonUpdate.innerHTML="dictate caption";  
        recordButtonUpdate.style.color = "black"
        
    }, 1000);
}

// called when there is no voice input any more
const stopSpeechRecognition = () => {
    recognition.stop();
}

// called when recording starts
const startRecording = () => {
    console.log("ACTIVE")
}

//called when recording ends
const stopRecording = () => {
    console.log("INACTIVE")   
}

const methods = { speechRecognition, stopSpeechRecognition }

export default methods