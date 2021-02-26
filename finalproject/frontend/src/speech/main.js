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
var listeningToTitle; 
var listeningToCaption;
var handleVoiceInput;
var numbers;


const activateFullVoiceControl = (globalVoiceControlButtonParameter, voiceInputCallback) => {

    // some variables
    globalVoiceControlButton = globalVoiceControlButtonParameter
    handleVoiceInput = voiceInputCallback
    listeningToTitle = false
    listeningToCaption = false
    numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
               

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
    console.log(transcript)

     // listened to title input?
     if(listeningToTitle){
        listeningToTitle = false 
        handleVoiceInput("enter_title", transcript)
        Read.readEnglish("I hope I got it right?")
    } else if(listeningToCaption){
        listeningToCaption = false
        handleVoiceInput("enter_caption", transcript)
        Read.readEnglish("Here is your caption!")
    }else {

    var res = transcript.toLowerCase();
    console.log(res)

    if(res.includes("new")){
        Read.readEnglish("Alright, how do you want to create your template?")
        handleVoiceInput("create_new_template", "")
    }
    else if(res.includes("template")||res.includes("choose")||res.includes("take")){
        let parameter = null
        for(let i=0; i<(numbers.length); i++){
            if (res.includes(numbers[i])){
                parameter = i
                Read.readEnglish("Cool, that is a good choice")
            }
        }
        if(parameter || parameter==0){handleVoiceInput("template_choose", parameter)}
        else {Read.readEnglish("Oh I think it is besser when you choose, I am not feeling good at the moment. Sorry!")}
        
    }
    else if(res.includes("next")){
        Read.readEnglish("Oh okay, next one!")
        handleVoiceInput("next_template", "")
    }
    else if(res.includes("previous")){
        Read.readEnglish("Oh okay, previous one!")
        handleVoiceInput("previous_template", "")
    }
    else if(res.includes("draft")&&!(res.includes("save"))){
        Read.readEnglish("Ok, lets work on your draft")
        handleVoiceInput("draft", "")
    }
    else if(res.includes("title")){
        Read.readEnglish("Dictate your desired title now!")
        listeningToTitle = true
        handleVoiceInput("enter_title", "")
    }
    else if(res.includes("caption")){
        Read.readEnglish("Alright, dicate your first caption!")
        listeningToCaption = true  
    }
    else if(res.includes("own")){
        Read.readEnglish("Have fun!")
        handleVoiceInput("create_own_template", "")
    }
    else if(res.includes("public")){
        Read.readEnglish("Alright, its set to public!")
        handleVoiceInput("set_public", "")
    }
    else if(res.includes("private")){
        Read.readEnglish("Alright, its set to private!")
        handleVoiceInput("set_private", "")
    }
    else if(res.includes("down")){
        Read.readEnglish("Nice, here it is!")
        handleVoiceInput("download", "")
    }
    else if(res.includes("external")){
        Read.readEnglish("Sorry, from here you have to click yourself!")
    }
    else if(res.includes("publish")){
        Read.readEnglish("Yeah boy! It is live!")
        handleVoiceInput("publish", "")
    }
    else if(res.includes("draft")&&res.includes("save")){
        Read.readEnglish("Saved as draft!")
        handleVoiceInput("save_draft", "")
    }
    else if(res.includes("thank")&&res.includes("you")){
        Read.readEnglish("Your welcome, I am out!")
        globalVoiceControlButton.innerHTML = "enable voice control"
        globalVoiceControlButton.style.backgroundColor = "initial" 
        stopSpeechRecognition()
        stopRecording()
    }
    else if(res.includes("stop")){
        Read.readEnglish("ok good, I am out!")
        console.log("voice control disabled");
        globalVoiceControlButton.innerHTML = "enable voice control"
        globalVoiceControlButton.style.backgroundColor = "initial" 
        stopSpeechRecognition()
        stopRecording()
    }/*else if(transcript.includes("bold")){
        Read.readEnglish("lets make it bold!")
        handleVoiceInput("set_caption_bold")
    }else if(transcript.includes("italic")){
        Read.readEnglish("lets make it italic!")
        handleVoiceInput("set_caption_italic")
    }*/else if(res.includes("font")){
        Read.readEnglish("I am sorry, I can not help on this one. Please do the font styling yourself!")
    }else{
        Read.readEnglish("Sorry! Please say again!")
    }
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