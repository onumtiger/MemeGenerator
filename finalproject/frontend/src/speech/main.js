import Read from '../speech/read';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// used variables
var recognition;
var globalVoiceControlButton;
var listeningToTitle; 
var listeningToCaption;
var handleVoiceInput;
var numbers;

/**
 * handles all voice input
 * @param {Element} globalVoiceControlButtonParameter // button to enable
 * @param {Function} voiceInputCallback // function to call when input is spoken
 */
const activateFullVoiceControl = (globalVoiceControlButtonParameter, voiceInputCallback) => {

    // some variables
    globalVoiceControlButton = globalVoiceControlButtonParameter
    handleVoiceInput = voiceInputCallback
    listeningToTitle = false
    listeningToCaption = false
    numbers = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
               
    // checks if browser is supporting speech recognition
    if(SpeechRecognition){
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.start();
        
        globalVoiceControlButton.innerHTML = "... recording - click to disable "
        globalVoiceControlButton.style.backgroundColor = "red"

        // event listeners
        recognition.addEventListener("start", startRecording)
        recognition.addEventListener("result", result2)
        recognition.addEventListener("end", stopRecording)
    } else {

        // DONT delete this log
        console.log("Your Browser does not support speech recognition");

        // give short info and let button disappear in not supported browsers
        globalVoiceControlButton.style.color="white";
        globalVoiceControlButton.innerHTML="voice recognition not supported, please change browser"
        setTimeout(function () {
            globalVoiceControlButton.style.display="none";
        }, 2500);
    }
}

/**
 * called when there is voice input available
 * @param {*} event 
 */
const result2 = (event) => {
    
    // get voice input
    const transcript = event.results[event.resultIndex][0].transcript;
    console.log(transcript)

     // listening to title input
     if(listeningToTitle){
        listeningToTitle = false 
        handleVoiceInput("enter_title", transcript)
        Read.readEnglish("I hope I got it right?")
    } 
    // listening to caption voice input
    else if(listeningToCaption){
        listeningToCaption = false
        handleVoiceInput("enter_caption", transcript)
        Read.readEnglish("Here is your caption!")
    }else {

    // lower case 
    var res = transcript.toLowerCase();
    // voice input handling and callback 
    if(res.includes("new")&&res.includes("template")){
        Read.readEnglish("Alright, how do you want to create your template?")
        handleVoiceInput("create_new_template", "")
    }
    else if(!res.includes("this")&&!res.includes("use")&&res.includes("template")||res.includes("choose")||res.includes("take")&&!(!res.includes("next")||!res.includes("previous"))){
        let parameter = null

        // check template number
        for(let i=0; i<(numbers.length); i++){
            if (res.includes(numbers[i])){
                parameter = i
                Read.readEnglish("Cool, that is a good choice")
            }
        }
        if(parameter || parameter==0){handleVoiceInput("template_choose", parameter)}
        else {Read.readEnglish("Oh I think it is besser when you choose, I am not feeling good at the moment. Sorry!")}
        
    } // NEXT BUTTON
    else if(res.includes("next")&&!res.includes("caption")){
        Read.readEnglish("Oh okay, next one!")
        handleVoiceInput("next_template", "")
    } // PREVIOUS BUTTON
    else if(res.includes("previous")){
        Read.readEnglish("Oh okay, previous one!")
        handleVoiceInput("previous_template", "")
    } // USE DRAFT
    else if((res.includes("draught")||res.includes("draft"))&&!(res.includes("save"))){
        Read.readEnglish("Ok, lets work on your last draft")
        handleVoiceInput("draft", "")
    } // USE THIS TEMPLATE
    else if(res.includes("this")&&(res.includes("template")||res.includes("use")&&res.includes("this"))){
        Read.readEnglish("Ok, lets use it")
        handleVoiceInput("use_template", "")
    } // ENTER TITLE
    else if(res.includes("title")||res.includes("titel")){
        Read.readEnglish("Dictate your desired title now!")
        listeningToTitle = true
        handleVoiceInput("enter_title", "")
    } // ADD CAPTION
    else if(res.includes("caption")||res.includes("action")||res.includes("captain")){
        Read.readEnglish("Alright, dictate your caption!")
        listeningToCaption = true  
        handleVoiceInput("caption_active", "");
    } // CREATE OWN TEMPLATE
    else if(res.includes("own")&&!res.includes("down")){
        Read.readEnglish("Have fun!")
        handleVoiceInput("create_own_template", "")
    } // CHOOSE PUBLIC
    else if(res.includes("public")){
        Read.readEnglish("Alright, its set to public!")
        handleVoiceInput("set_public", "")
    } // CHOOSE PRIVATE
    else if(res.includes("privat")){
        Read.readEnglish("Alright, its set to private!")
        handleVoiceInput("set_private", "")
    } // CHOOSE NOT LISTED
    else if(res.includes("listed")){
        Read.readEnglish("Alright, its set to unlisted!")
        handleVoiceInput("set_unlisted", "")
    } // DOWNLOAD
    else if(res.includes("down")&&res.includes("load")){
        Read.readEnglish("Nice, here it is!")
        handleVoiceInput("download", "")
    } // EXTERNAL
    else if(res.includes("external")){
        Read.readEnglish("Here you are! Oh! Sorry I got an important phone call, please go on yourself!")
        handleVoiceInput("external_image", "")
    } // PUBLISH
    else if(res.includes("publish")){
        Read.readEnglish("Yeah nice! It is life!")
        handleVoiceInput("publish", "")
    } // SAVE AS DRAFT
    else if((res.includes("draught")||res.includes("draft")&&res.includes("save"))||(res.includes("again")&&res.includes("save"))){
        Read.readEnglish("Saved as draft!")
        handleVoiceInput("save_draft", "")
    } // SCROLL UP
    else if (res.includes("up")&&res.includes("scroll")){
        Read.readEnglish("All the way up!")
        handleVoiceInput("up", "")
    } //SCROLL DOWN
    else if (res.includes("down")&&res.includes("scroll")){
        Read.readEnglish("Down!")
        handleVoiceInput("down", "")
    } // THANK YOU -> stops
    else if(res.includes("thank")&&res.includes("you")){
        Read.readEnglish("Your welcome, I am out!")
        globalVoiceControlButton.innerHTML = "enable voice control"
        globalVoiceControlButton.style.backgroundColor = "initial" 
        stopSpeechRecognition()
        stopRecording()
    } // STOPS
    else if(res.includes("stop")){
        Read.readEnglish("ok good, I am out!")
        globalVoiceControlButton.innerHTML = "enable voice control"
        globalVoiceControlButton.style.backgroundColor = "initial" 
        stopSpeechRecognition()
        stopRecording()
    }
    // FONT
    else if(res.includes("font")){
        Read.readEnglish("I am sorry, I can not help on this one. Please do the font styling yourself!")
    } // NOT RECOGNIZED
    else{
        Read.readEnglish("Sorry! Please say again!")
    }
    }
}

/**
 * called when there is no voice input any more
 */
const stopSpeechRecognition = () => {
    recognition.stop();
}

/**
 * called when recording starts
 */
const startRecording = () => {
    console.log("ACTIVE")
}

/**
 * called when recording ends
 */
const stopRecording = () => {
    console.log("INACTIVE")
    globalVoiceControlButton.innerHTML = "enable voice control"
    globalVoiceControlButton.style.backgroundColor = "initial" 
}

const methods = { stopSpeechRecognition, activateFullVoiceControl }

export default methods