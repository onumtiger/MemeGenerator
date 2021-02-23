const Meme = require('../db/models/meme-model');
const User = require('../db/models/user-model');
const dbUtils = require('../db/dbUtils');
const globalHelpers = require('../utils/globalHelpers');
var Jimp = require('jimp');
var app = require('express')();
var zip = require('express-zip');

const createMeme = async (req, res) => { //TODO send template ID, increment template uses on creation
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No meme data received!'
        })
    }

    if (req.files && req.files.image) { //check if we actually received a file
        let img = req.files.image;
        let id = await dbUtils.getNewEmptyMemeID();
        let filename = id+"_"+img.name; //ID in addition to name in order to prevent unwanted overrides
        img.mv('public/memes/'+filename, async function(err){ //this overwrites an existing image at that filepath if there is one!
            if(err){
                res.status(500).send(err);
            }else{
                let url = 'memes/'+filename;
                
                const meme = new Meme({
                    _id: id,
                    url: url,
                    name: body.name,
                    user_id: body.userID,
                    visibility: body.visibility,
                    captions: body.captions,
                    comment_ids: [],
                    creationDate: globalHelpers.getTodayString(),
                    stats: {
                        _id: id,
                        upvotes: [],
                        downvotes: [],
                        views: 0
                    }
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
    } else if(body.imageURL){
        let id = await dbUtils.getNewEmptyMemeID();
        
        const meme = new Meme({
            _id: id,
            url: body.imageURL,
            name: body.name,
            user_id: body.userID,
            visibility: body.visibility,
            captions: body.captions,
            comment_ids: [],
            creationDate: globalHelpers.getTodayString(),
            stats: {
                _id: id,
                upvotes: [],
                downvotes: [],
                views: 0
            }
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
    } else {
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
    await Meme.findOne({ _id: req.params.id }, (err, meme) => {
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
    await Meme.find({}, (err, memes) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        // if (!memes.length) {
        //     return res
        //         .status(204)
        //         .json({ success: false, error: `No memes found` })
        // }
        return res.status(200).json({ success: true, data: memes })
    }).catch(err => console.log(err))
}

const patchMeme = async function(req, res) {
    console.log("Patch Meme generic")
    var body = req.body;
    var memeId = req.params.id;
    var updatedProperty = body.toUpdate
    const result = await Meme.updateOne({_id: memeId}, updatedProperty)
    console.log(result);
}

const postViewsMeme = async (req, res) => {
    console.log("post upvotes")
    var body = req.body;
    var memeId = req.params.id;
    var updatedViews= body.toUpdate
    const result = await Meme.updateOne({_id: memeId}, {updatedViews})
}

const postUpvotesMeme = async (req, res) => {
    console.log("post upvotes")
    var body = req.body;
    var memeId = req.params.id;
    var updatedUserId= body.toUpdate
    const result = await Meme.updateOne({_id: memeId}, { $push: {'stats.upvotes': updatedUserId}})  
}

const postDownvotesMeme = async (req, res) => {
    console.log("post downvotes")
    var body = req.body;
    var memeId = req.params.id;
    var updatedUserId= body.toUpdate
    const result = await Meme.updateOne({_id: memeId}, { $push: {'stats.downvotes': updatedUserId}})
}



// Api Image Mamipulation/Creation
const executeImageCreation  = async (req, res) => {

    //Arrays
    const xPositions = req.body.xPositions
    const yPositions = req.body.yPositions
    const texts = req.body.texts
    const textColor = req.body.textColor
    const textsPerImage = req.body.textsPerImage
    const imageURL = req.body.imageURL
    
    //Bool
    const imageset = req.body.imageset

    //Numbers
    const points = xPositions.length
        // variables
        var imagesToCreate = req.body.images
        var loop = 0;
        var textsToDisplay = textsPerImage
        var savedImage = 0
        var finalPaths = []
        var finalNames = []

    if(imageset){// a set of images as result
        for(i=0; i<imagesToCreate; i++){    
            console.log("create image", i)
            let image = await Jimp.read(imageURL)
                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => { 
                    //print text with color
                    new Jimp(1280, 720, 0x0, function (err, finishedTextImage) {
                        for (loop; loop < textsToDisplay; loop++) {
                            finishedTextImage.print(font, xPositions[loop], yPositions[loop], texts[loop])
                        }
                        finishedTextImage.color([{ apply: 'xor', params: [textColor] }]);
                        
                        textsToDisplay = textsToDisplay+textsPerImage
                        let url = '/memes/image_'+savedImage+'.png'
                        finalPaths.push(url)
                        finalNames.push('image_'+savedImage+'.png')
                        console.log(finalNames)
                        console.log(finalPaths)
                        savedImage = addOne(savedImage)
                        
                        image
                            //merge images
                            .blit(finishedTextImage, 0, 0)
                            //save new image   
                            .write('./public' + url, () => {
                                
                                if (i==(imagesToCreate-1)){
                                console.log("send response")
                                let resArray = []
                                for(i=0; i<imagesToCreate; i++){
                                    resArray.push({ path: finalPaths[i], name: finalNames[i]})
                                }
                                console.log("Response Array: ", resArray)
                                res.status(200).zip(resArray);
                            }    
                         });// save
                            
                        
                    });
            });              
        }
        
            
    
        
    } else if (!imageset){ // only one image as result
        console.log("create one image")
        //const resultingImage = await Jimp.read('/images/jan_domi_punch.png') 
        Jimp.read(imageURL)
        .then(image => {
            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font => { 
                //print text with color
                new Jimp(1280, 720, 0x0, function (err, finishedTextImage) {
                    for (loop = 0; loop < points; loop++) {
                        finishedTextImage.print(font, xPositions[loop], yPositions[loop], texts[loop])
                    }
                    finishedTextImage.color([{ apply: 'xor', params: [textColor] }]);
                    let url = '/memes/image_'+savedImage+'.png'
                    image
                        //merge images
                        .blit(finishedTextImage, 0, 0)                
                        //.print(font, x, y, message, maxWidth) // print a message on an image with text wrapped at maxWidth
                        .write('./public' + url); // save
                    res.status(200).json({success: true, pathUrl: url})
                });
            });    
        })
        .catch(err => {
        console.error(err);
        res.status(400).json({success: false, error: err})
        }); 
    } else {
        console.log("imageset is not valid")
    }
}

// helper method for image saving 
const addOne = (number) => {
    return number+1
}

module.exports = {
    createMeme,
    deleteMeme,
    patchMeme,
    postViewsMeme,
    postUpvotesMeme,
    postDownvotesMeme,
    getMemes,
    getMemeById,
    executeImageCreation
}