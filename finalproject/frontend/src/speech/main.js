import Read from '../speech/read';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var recognition;

//recognition.continuous = true;
var recordButtonUpdate;
var inputField;
var updateTextFunction;
var updateTextBox;
var updateRecordButtonActive;
var globalVoiceControlButton;

var activeClass;
var plusButtonClicked;


const activateFullVoiceControl = (globalVoiceControlButtonParameter, plusButton, classParameter) => {

    // some variables
    globalVoiceControlButton = globalVoiceControlButtonParameter
    plusButtonClicked = plusButton
    activeClass = classParameter

    if(SpeechRecognition){
        console.log("Your Browser supports speech recognition");
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.start();         

        // event listeners
        recognition.addEventListener("start", startRecording)
        recognition.addEventListener("result", result2)
        recognition.addEventListener("end", stopRecording)
    } else {
        console.log("Your Browser does not support speech recognition");
        globalVoiceControlButton.style.color="white";
        globalVoiceControlButton.innerHTML="voice recognition not supported, please change browser"
        setTimeout(function () {
            globalVoiceControlButton.style.display="none";
        }, 2500);
    }

}

const result2 = (event) => {
    console.log(event.resultIndex)
    const transcript = event.results[event.resultIndex][0].transcript;
    transcript.toLowerCase();
    if(transcript.includes("new")){
        Read.readEnglish("Alright, creating new template")
        //activeClass.handlePlusButtonClick()
    }else if(transcript.includes("one")){
        Read.readEnglish("Cool, we are using template number one, good choice")
    }else if(transcript.includes("next")){
        Read.readEnglish("Oh okay, next one!")
    }else if(transcript.includes("previous")){
        Read.readEnglish("Oh okay, previous one!")
    }else if(transcript.includes("draft")){
        Read.readEnglish("Ok, lets work on your draft")
    }else if(transcript.includes("title")){
        Read.readEnglish("Dictate your desired title now!")
    }else if(transcript.includes("caption")){
        Read.readEnglish("Sure lets add a caption!")
    }else if(transcript.includes("public")){
        Read.readEnglish("Alright, its set to public!")
    }else if(transcript.includes("private")){
        Read.readEnglish("Alright, its set to private!")
    }else if(transcript.includes("load")){
        Read.readEnglish("Nice, here it is!")
    }else if(transcript.includes("publish")){
        Read.readEnglish("Yeah boy! It is live!")
    }else if(transcript.includes("stop")){
        Read.readEnglish("ok good, I am out!")
        console.log("voice control disabled");
        globalVoiceControlButton.innerHTML = "enable voice control"
        globalVoiceControlButton.style.backgroundColor = "initial" 
        stopSpeechRecognition()
        stopRecording()
    }else if(transcript.includes("bold")){
        Read.readEnglish("lets make it bold!")
    }else if(transcript.includes("italic")){
        Read.readEnglish("lets make it italic!")
    }else if(transcript.includes("font")){
        Read.readEnglish("I am sorry, I can not help on this one. Please make the font styling yourself!")
    }else{
        Read.readEnglish("Sorry my fault, I was not listening. Please say again!")
    }
}





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
        recognition = new SpeechRecognition();
        recognition.start();         

        // event listeners
        recognition.addEventListener("start", startRecording)
        recognition.addEventListener("result", result)
        recognition.addEventListener("end", stopRecording)
    } else {
        console.log("Your Browser does not support speech recognition");
        recordButton.innerHTML="voice recognition not supported, please change browser"
        setTimeout(function () {
            recordButtonUpdate.style.backgroundColor = "transparent"
            recordButtonUpdate.innerHTML="voice renot supported";  
            recordButtonUpdate.style.display="none";
        }, 2300);
    }
}

//gets called when there is no voice input any more
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

const methods = { speechRecognition, stopSpeechRecognition, activateFullVoiceControl }

export default methods