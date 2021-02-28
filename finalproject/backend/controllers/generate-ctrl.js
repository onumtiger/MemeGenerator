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

    // expects at least one of these URL query parameters with truthy string values:
    //  - titleContains: meme title filter, only return memes that (case-insensitively) contain this string in the meme title
    //  - fileFormat: one or multiple (separated by the '|' character) file extensions, only return memes that are of these file types
    //  - maxImages: only return the first x matching memes
    // example:
    // http://localhost:3001/api/external/getImages?titleContains=Jan&fileFormat=png|jpg&maxImages=10

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
            console.log("i", i)
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

    //TODO: Delete this array for submission

    // URL query parameters - expected form:
    // http://localhost:3001/api/external?images[0][name]=name1&images[0][captions][0][x]=10&images[0][captions][0][y]=10&images[0][captions][0][text]=caption1&images[0][captions][0][textColor]=%23ff3333&images[0][captions][1][x]=80&images[0][captions][1][y]=80&images[0][captions][1][text]=caption2&images[0][captions][1][textColor]=%2333ffff&images[1][name]=name2&images[1][captions][0][x]=10&images[1][captions][0][y]=10&images[1][captions][0][text]=caption3&images[1][captions][0][textColor]=%23d24dff&images[1][captions][1][x]=80&images[1][captions][1][y]=80&images[1][captions][1][text]=caption4&images[1][captions][1][textColor]=%23d9ff66&templateURL=https%3A%2F%2Fi.ytimg.com%2Fvi%2FjSiVi800um0%2Fhqdefault.jpg
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
    //                     textColor: '%23ff3333', // hex color of text (URIEncoded!)
    //                     text: 'caption1'
    //                 },
    //                 {
    //                     x: '80',
    //                     y: '80',
    //                     textColor: '%2333ffff', // hex color of text (URIEncoded!)
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
    //                     textColor: '%23d24dff', // hex color of text (URIEncoded!)
    //                     text: 'caption3'
    //                 },
    //                 {
    //                     x: '80',
    //                     y: '80',
    //                     textColor: '%23d9ff66', // hex color of text (URIEncoded!)
    //                     text: 'caption4'
    //                 }
    //             ]
    //         }
    //     ]
    // }

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