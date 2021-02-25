


var synth = window.speechSynthesis;

const readCaption = (captionContent) => {
    var utterThis = new SpeechSynthesisUtterance(captionContent);
    synth.speak(utterThis);
    console.log('Wanted to read: ', captionContent)
}


const methods = { readCaption }

export default methods