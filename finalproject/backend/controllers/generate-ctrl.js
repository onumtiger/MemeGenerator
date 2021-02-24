var Jimp = require('jimp');

const getSearchImages = async () => {
    console.log('got query: ', req.query);

    try{
        console.log('got query: ', req.query);

        const { titleContains, fileFormat } = req.query;
        let zipArray = [];

            // GET MEMES
            console.log("Trying to get memes!")
            let memes = await Meme.find({}, (err, memes) => {
                if (err) {
                    return res.status(400).json({ success: false, error: err })
                }
                return memes
            }).catch(err => console.log(err))
            console.log('gegetted memes: ', memes)


            res.status(200).json({success: true});

        //push memes into 
                                    //path                  name
        //zipArray.push({path: './public/temp/'+fileName, name: fileName});
        //zip
        //res.status(200).zip(zipArray);
    }catch(err){         
        console.log(err);
        res.status(400).json({success: false, error: err.toString()});
    }
}


// Api Image Mamipulation/Creation
const executeImageCreation  = async (req, res) => {

    console.log('got query: ',req.query);

    // URL query parameters - expected form:
    // http://localhost:3001/api/generate?textColor=%23ff0da0&images[0][name]=name1&images[0][captions][0][x]=10&images[0][captions][0][y]=10&images[0][captions][0][text]=caption1&images[0][captions][1][x]=80&images[0][captions][1][y]=80&images[0][captions][1][text]=caption2&images[1][name]=name2&images[1][captions][0][x]=10&images[1][captions][0][y]=10&images[1][captions][0][text]=caption3&images[1][captions][1][x]=80&images[1][captions][1][y]=80&images[1][captions][1][text]=caption4&templateURL=https%3A%2F%2Fi.ytimg.com%2Fvi%2FjSiVi800um0%2Fhqdefault.jpg
    // translates to:
    // {
    //     templateURL: 'https%3A%2F%2Fi.ytimg.com%2Fvi%2FjSiVi800um0%2Fhqdefault.jpg', //URIEncoded template image URL
    //     images: [
    //         {
    //             name: 'name1', //filename, .png will be appended. if this name already exists or none is given, another name will be chosen
    //             captions: [
    //                 {
    //                     x: '10',
    //                     y: '10',
    //                     textColor: '%23603cff', // hex color of text (URIEncoded!)
    //                     text: 'caption1'
    //                 },
    //                 {
    //                     x: '80',
    //                     y: '80',
    //                     textColor: '%23603cff', // hex color of text (URIEncoded!)
    //                     text: 'caption2'
    //                 }
    //             ]
    //         },
    //         {
    //             name: 'name2', //filename, .png will be appended. if this name already exists or none is given, another name will be chosen
    //             captions: [
    //                 {
    //                     x: '10',
    //                     y: '10',
    //                     textColor: '%23603cff', // hex color of text (URIEncoded!)
    //                     text: 'caption3'
    //                 },
    //                 {
    //                     x: '80',
    //                     y: '80',
    //                     textColor: '%23603cff', // hex color of text (URIEncoded!)
    //                     text: 'caption4'
    //                 }
    //             ]
    //         }
    //     ]
    // }

    const { images, templateURL, searchParameter } = req.query;

    let zipArray = [];
    
    //title contains, file format

    try{
        let template = await Jimp.read(decodeURIComponent(templateURL));
        
        for(let i=0; i<images.length; i++){
            let image = images[i];
            
            let captions = image.captions;
            let name = image.name;

            let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            
            let fileName = (name && zipArray.findIndex((e)=>e.name==name) == -1) ? name+'.png' : 'image_'+i;
            
            await captionImage(template.clone(), font, captions, fileName);

            zipArray.push({path: './public/temp/'+fileName, name: fileName});
        }

        //zip
        res.status(200).zip(zipArray);

    }catch(err){         
        console.log(err);
        res.status(400).json({success: false, error: err.toString()});
    }
    
}


const captionImage = async(template, font, captions, fileName)=>{
    return new Promise(async (resolve, reject) => {
        new Jimp(template.getWidth(), template.getHeight(), 0x0, function (err, textCanvas) {
            if(err) throw err;

            console.log('printing captions: ',captions);
            captions.forEach((caption)=>{
                let canvas = textCanvas.clone();
                canvas.print(font, parseInt(caption.x), parseInt(caption.y), caption.text);
                canvas.color([{ apply: 'xor', params: [decodeURIComponent(caption.textColor)] }]);
                //merge images
                template.blit(canvas, 0, 0);
            });

            let url = './public/temp/'+fileName;
            
            template
                //save new image   
                .write(url, () => {
                    resolve();
                });
        });
    });
}


module.exports = {
    executeImageCreation, 
    getSearchImages
}