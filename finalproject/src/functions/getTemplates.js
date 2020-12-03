export const getTemplates = async () => { // get templates images
    let memes = []
    let response = await fetch(`https://api.imgflip.com/get_memes`);
    let data = await response.json();
    let templateLength = 10
    for (let i = 0; i < templateLength; i++){
        let img = {
            id: "",
            url: ""
        }
        let random = Math.floor(Math.random() * 100) 
        img.id = data.data.memes[random].id
        img.url = data.data.memes[random].url
        memes.push(img)
    }
    return memes
}