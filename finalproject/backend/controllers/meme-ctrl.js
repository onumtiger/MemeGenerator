const Meme = require('../db/models/meme-model')


const createMeme = (req, res) => {
    
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No meme data received!',
        })
    }

    if(req.files && req.files.image){ //check if we actually received a file
        let img = req.files.image;
        let filename = img.name; //TODO we probably should pass an additional ID to the filename in order to prevent unwanted overrides.
        img.mv('public/memes/'+filename, function(err){ //this overwrites an existing image at that filepath if there is one!
            if(err){
                res.status(500).send(err);
            }else{
                url = 'memes/'+filename;
                
                const meme = new Meme(body) //TODO change to actual properties, add the url, and store the data as we need it.


                if (!meme) {
                    return res.status(400).json({
                        success: false,
                        error: "Meme data could not be parsed for storing!"
                    });
                }
            
                meme
                    .save()
                    .then(() => {
                        return res.status(201).json({
                            success: true,
                            id: meme._id, //TODO maybe change depending on what a stored Meme looks like and which ID we will work with
                            error: 'Meme successfully stored!'
                        })
                    })
                    .catch(dbError => {
                        return res.status(500).json({
                            success: false,
                            error: 'Meme could not be stored! You should find additional error info in the detailedError property of this JSON.',
                            detailedError: dbError
                        })
                    })
            }
        });
    }else{
        res.status(400).json({
            success: false,
            error: 'No valid file received!'
        });
    }
}

const deleteMeme = async (req, res) => {
    await Meme.findOneAndDelete({ _id: req.params.id }, (err, meme) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!meme) {
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }

        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}

const getMemeById = async (req, res) => {
    await Meme.findOne({ id: req.params.id }, (err, meme) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!meme) {
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }
        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}

const getMemes = async (req, res) => {
    console.log("Entered!")
    await Meme.find({}, (err, meme) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!meme.length) {
            return res
                .status(404)
                .json({ success: false, error: `Meme not found` })
        }
        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}


module.exports = {
    createMeme,
    deleteMeme,
    getMemes,
    getMemeById
}