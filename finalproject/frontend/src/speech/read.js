var synth = window.speechSynthesis;

// READS given information
const readCaption = (captionContent) => {
    var utterThis = new SpeechSynthesisUtterance(captionContent);
    synth.speak(utterThis);
}

const methods = { readCaption }

export default methods