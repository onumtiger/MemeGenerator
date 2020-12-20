import Axios from "axios"
export const generateMeme = async (imgID, captions) => { // generate meme
    const creds = ["onumUni", "copquh-pywciC-kubho4"]

    let request = await Axios.post(`https://api.imgflip.com/caption_image`, 
                                    null, 
                                    { params: {
                                        template_id: imgID,
                                        username: creds[0],
                                        password: creds[1],
                                        text0: captions[0],
                                        text1: captions[1],
                                        text2: captions[2],
                                        text3: captions[3],
                                        text4: captions[4],
                                        text5: captions[5],
                                    }})

    let meme = {
        url: request.data.data.url,
    } 

    return meme
}


/// query string aus img url + captions array + creds