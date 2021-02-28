var synth = window.speechSynthesis;

/**
 * Read englisch content 
 * @param {String} text - text to read
 */
const readEnglish = (text) => {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'en-US';
    synth.speak(utterThis);
}

/**
 * Read captions
 * @param {String} captionContent - caption to read
 */
const readCaption = (captionContent) => {
    var utterThis = new SpeechSynthesisUtterance(captionContent);
    synth.speak(utterThis);
}

const methods = { readCaption, readEnglish }

export default methods