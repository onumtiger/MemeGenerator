export const fetchMemes = async (templateLength) => { // get templates images
    const url = 'https://api.imgflip.com/get_memes'
    let memes = []

    let response = await fetch(url)
    let responseJSON = await response.json()

    for (let i = 0; i < templateLength; i++) {
        let random = Math.floor(Math.random() * 100)
        let meme = {
            box_count: '',
            height: '',
            id: '',
            name: '',
            url: '',
            width: ''
        }
        
        meme.box_count = responseJSON.data.memes[random].box_count
        meme.height = responseJSON.data.memes[random].height
        meme.id = responseJSON.data.memes[random].id
        meme.name = responseJSON.data.memes[random].name
        meme.url = responseJSON.data.memes[random].url
        meme.width = responseJSON.data.memes[random].width

        memes.push(meme)
    }

    return memes
} 