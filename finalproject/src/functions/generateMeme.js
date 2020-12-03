export const generateMeme = async (imgUrl) => { // generate meme
    document.getElementById("templateContainer").classList.add("hidden") 

    let form = document.getElementById("memeForm");
    let button = document.getElementById("submit-button");
    button.innerText = "building...";

    const params = {
        template_id: imgUrl,
        text0: form.firstCaption.value,
        text1: form.lastCaption.value,
        username: "onumUni",
        password: "copquh-pywciC-kubho4"
    };
    let queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
    const response = await fetch(
        `https://api.imgflip.com/caption_image?${queryString}`, {method: 'POST'}
    );
    const json = await response.json();
    button.innerText = "Generate";

    document.getElementById("meme").src = json.data.url;
}