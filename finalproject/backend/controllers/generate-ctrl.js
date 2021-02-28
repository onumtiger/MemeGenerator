var Jimp = require('jimp');
const Meme = require('../db/models/meme-model');

/** 
 * Controller handles all API action from outside 
 */

/**
 * test how given URL query parameters are parsed into JSON
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object 
 */
const testQueryParams = (req, res) => {
    console.log(req.query);
    res.status(200).json(req.query);
}

/**
 * User calls API with search parameters, the HTTP response will be a zip file with the resulting images or a JSON object with an error message if mandatory parameters were omitted. Zip files will never contain more than 20 images.
 * @param {Request} req - Express Request Object
 * @param {Response} res - Express Response Object
 */
const getSearchImages = async (req, res) => {

    try {
        const { titleContains, fileFormat, maxImages } = req.query;
        let zipArray = []; // needed for zip saving
        let hardLimit = 20; // max supported zip file number size

        // CHECK IF USER WANTS LESS THAN 20 IMAGES
        if ((maxImages < hardLimit) && (maxImages != null)) {
            hardLimit = maxImages;
        }

        // THROW ERROR WHEN EMPTY PARAMETERS
        if (!titleContains && !fileFormat && !maxImages) throw new Error("information not valid ");

        // GET MEMES
        let memes = await Meme.find({}, (err, memes) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            return memes
        })

        // FILTER MEMES WITH SEARCH PARAMETERS
        if (titleContains) {
            memes = memes.filter(meme => (
                meme.name.toLowerCase().includes(titleContains.toLowerCase())
            ));
        }

        // FILTER MEMES BY FILE TYPE
        if (fileFormat) {
            memes = memes.filter(meme => (
                meme.url.match(new RegExp(`.+\\.(${fileFormat})$`, 'i'))
            ));
        }

        // PUSH THE MEMES INTO ARRAY
        for (i = 0; (i < (memes.length) && i < hardLimit); i++) {
            let path = memes[i].url
            //path              name
            zipArray.push({ path: './public' + path, name: path });
        }

        // SEND STATUS WITH ZIP
        res.status(200).zip(zipArray);

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.toString() });
    }
}


/**
 * API image Manipulation/Creation method
 * @param {Request} req - Express Request Object
 * @param {Response} req - Express Response Object
 */
const executeImageCreation = async (req, res) => {  

    const { images, templateURL } = req.query;
    let zipArray = []; // needed for zip saving

    try {
        // SAVE TEMPLATE IMAGE
        let template = await Jimp.read(decodeURIComponent(templateURL));

        // SAVE RESULTS IN ZIP ARRAY 
        for (let i = 0; i < images.length; i++) {
            let image = images[i];
            let captions = image.captions;
            let name = image.name;
            let font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK); //loads font
            let fileName = (name && zipArray.findIndex((e) => e.name == name) == -1) ? name + '.png' : 'image_' + i;

            await captionImage(template.clone(), font, captions, fileName); //adds captions to template and saves it

            zipArray.push({ path: './public/temp/' + fileName, name: fileName }); // pushes result into zip array
        }

        // SEND ZIP FILE
        res.status(200).zip(zipArray);

    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, error: err.toString() });
    }

}


/**
 * helping method for image creation 
 * @param {Jimp} template - Jimp template image object
 * @param {Font} font - Font object to use for captioning
 * @param {{x: Number, y: Number, text: string, textColor: string}} captions - Object with the caption text, x/y coords and a color code as encodedURIComponent
 * @param {string} fileName - filename to use for the saved captioned image file
 */
const captionImage = async (template, font, captions, fileName) => {
    return new Promise(async (resolve, reject) => {
        new Jimp(template.getWidth(), template.getHeight(), 0x0, function (err, textCanvas) {
            if (err) throw err;
            captions.forEach((caption) => {
                let canvas = textCanvas.clone();
                canvas.print(font, parseInt(caption.x), parseInt(caption.y), caption.text); // prints captions on transparent image
                canvas.color([{ apply: 'xor', params: [decodeURIComponent(caption.textColor)] }]); // color handling
                template.blit(canvas, 0, 0); // merge images
            });

            let url = './public/temp/' + fileName;

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
    getSearchImages,
    testQueryParams
}