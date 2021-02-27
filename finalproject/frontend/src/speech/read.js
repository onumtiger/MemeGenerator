var synth = window.speechSynthesis;

/**
 * Read englisch content 
 * @param {*} text 
 */
const readEnglish = (text) => {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'en-US';
    synth.speak(utterThis);
    console.log("tries to speak english");
}

/**
 * Read captions
 * @param {*} captionContent 
 */
const readCaption = (captionContent) => {
    var utterThis = new SpeechSynthesisUtterance(captionContent);
    synth.speak(utterThis);
}

const methods = { readCaption, readEnglish }

export default methods