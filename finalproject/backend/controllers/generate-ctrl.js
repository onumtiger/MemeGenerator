var Jimp = require('jimp');
var app = require('express')();
var zip = require('express-zip');

// Api Image Mamipulation/Creation
const executeImageCreation  = async (req, res) => {

    //Arrays
    const xPositions = req.query.xPositions
    console.log(xPositions)
    const yPositions = req.query.yPositions
    const texts = req.query.texts
    const textColor = req.query.textColor
    const textsPerImage = req.query.textsPerImage
    const imageURL = decodeURI(req.query.imageURL)
    
    //Bool
    const imageset = req.query.imageset

    //Numbers
    const points = xPositions.length
        // variables
        var imagesToCreate = req.query.images
        var loop = 0;
        var textsToDisplay = textsPerImage
        var savedImage = 0
        var runs = -1
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
                        let url = './public/memes/image_'+savedImage+'.png'
                        finalPaths.push(url)
                        finalNames.push('image_'+savedImage+'.png')
                        console.log(finalNames)
                        console.log(finalPaths)
                        savedImage = addOne(savedImage)
                        runs = addOne(runs)
                        
                        image
                            //merge images
                            .blit(finishedTextImage, 0, 0)
                            //save new image   
                            .write('./public' + url, () => {
                                
                                if (runs==(imagesToCreate-1)){
                                console.log("run : ", runs)
                                console.log("i : ", i)
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
                        .write('./public' + url, () => {
                            res.status(200).zip([{ path: './public'+url, name: 'image_'+savedImage+'.png' }]);
                        }); // save               
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
    executeImageCreation
}