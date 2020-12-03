import {
    getTemplates,
    selectImage    
} from "./_index.js"

export const setUpTemplate = async () => { // add template images to dom
    let memes = await getTemplates()
    for (let i = 0; i < memes.length; i++){
        var newImg = document.createElement('img')
        newImg.src = memes[i].url;
        newImg.classList.add("meme")
        newImg.setAttribute("id", memes[i].id)
        newImg.onclick = function() {
            selectImage(this.id)
        }
        document.getElementById('templateContainer').appendChild(newImg);
    }
}