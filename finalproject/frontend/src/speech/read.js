var synth = window.speechSynthesis;

const readEnglish = (text) => {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'en-US';
    synth.speak(utterThis);
    console.log("tries to speak english");
}

const readGerman = (text) => {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = 'de-DE';
    synth.speak(utterThis);
    console.log("tries to speak german");
}

// READS given information
const readCaption = (captionContent) => {
    console.log("tries to read out captions");
    var utterThis = new SpeechSynthesisUtterance(captionContent);
    synth.speak(utterThis);
}

const methods = { readCaption, readEnglish }

export default methods