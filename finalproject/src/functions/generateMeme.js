import Axios from "axios"
export const generateMeme = async (imgID, captions) => { // generate meme
    const creds = ["onumUni", "copquh-pywciC-kubho4"]
    let captionObject = {}
    for(let i = 0; i < captions.length; i++) {
        captionObject[`text${i}`] = captions[i]
    }

    let responseJSON
    Axios({
        method: 'post',
        url: 'https://api.imgflip.com/caption_image',
        template_id: imgID,
        username: creds[0],
        password: creds[1],
        data: {
            captionObject
        }
      }).then(async (response) => {
        console.log("res", response)
        responseJSON = await response.json()
      })

    console.log("response", responseJSON)

    let meme = {
        height: responseJSON.data.height,
        id: responseJSON.data.id,
        name: responseJSON.data.name,
        url: responseJSON.data.url,
        width: responseJSON.data.width
    } 

    return meme
}


/// query string aus img url + captions array + creds