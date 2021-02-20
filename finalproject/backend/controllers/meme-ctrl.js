const Meme = require('../db/models/meme-model');
const Stats = require('../db/models/stats-model');
const globalHelpers = require('../globalHelpers');

const createMeme = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No meme data received!'
        })
    }

    if(req.files && req.files.image){ //check if we actually received a file
        let img = req.files.image;
        let id = await globalHelpers.getNewEmptyMemeID();
        let filename = id+"_"+img.name; //ID in addition to name in order to prevent unwanted overrides
        img.mv('public/memes/'+filename, async function(err){ //this overwrites an existing image at that filepath if there is one!
            if(err){
                res.status(500).send(err);
            }else{
                let url = 'memes/'+filename;
                
                let statsID = await globalHelpers.getNewFullStatsID();
                
                const meme = new Meme({
                    _id: id,
                    url: url,
                    name: body.name,
                    user_id: body.userID,
                    visibility: body.visibility,
                    stats_id: statsID,
                    captions: body.captions,
                    comment_ids: [],
                    creationDate: globalHelpers.getTodayString()
                });


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
                            id: meme._id,
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
    console.log("Trying to get memes!")
    await Meme.find({}, (err, memeArray) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!memeArray.length) {
            return res
                .status(204)
                .json({ success: false, error: `No memes found` })
        }
        return res.status(200).json({ success: true, data: memeArray })
    }).catch(err => console.log(err))
}


module.exports = {
    createMeme,
    deleteMeme,
    getMemes,
    getMemeById
}