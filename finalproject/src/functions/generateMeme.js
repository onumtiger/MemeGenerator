import Axios from "axios"
export const generateMeme = async (imgID, captions) => { // generate meme
    const creds = ["onumUni", "copquh-pywciC-kubho4"]
    let captionObject = {}
    for(let i = 0; i < captions.length; i++) {
        captionObject[`text${i}`] = captions[i]
    }

    let request = await Axios({
        method: 'post',
        url: 'https://api.imgflip.com/caption_image',
        template_id: imgID,
        username: creds[0],
        password: creds[1],
        // data: {
            
        //     captionObject
        // }
    })

    let meme = {
        id: request.config.template_id,
        url: request.config.url,
    } 

    return meme
}


/// query string aus img url + captions array + creds