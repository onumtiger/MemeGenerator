export const selectImage = (image) => { // not selected pictures
    let template = document.getElementsByClassName("meme")
    for (let i = 0; i < template.length; i++){
        template[i].classList.add("hidden")
    }  
    document.getElementById("task").innerHTML = "Add captions"

    let img = document.getElementById(image)
    img.classList.add("highlighted")
    let imgUrl = img.id

    return imgUrl
}