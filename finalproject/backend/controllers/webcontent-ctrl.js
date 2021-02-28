const Jimp = require('jimp');
const puppeteer = require('puppeteer');

/**
 * test
 * @param {*} req 
 * @param {*} res 
 */
const testQueryParams = (req, res) => {
    console.log(req.query);
    res.status(200).json(req.query);
}

/**
 * get web image
 * @param {*} req 
 * @param {*} res 
 */
const getWebImage = async (req, res) => {
    let remoteUrl = decodeURIComponent(req.params.url);
    
    try{
        // We used Jimp's functionality to load supported image types from a given URL for this feature. It supports JPEG, PNG, BMP, TIFF and GIFs as inputs but only JPEG, PNG and BMP for file outputs, so no GIF animations or anything fancy. Since we're left with static images, we just convert to PNG when saving the image to our server.

        //try to read the image
        let remoteImage = await Jimp.read(remoteUrl);
        
        //get a new unique filename, append it to the templates server path and save the file
        let fileName = `uploaded_${Date.now()}.png`;
        let localUrl = '/templates/'+fileName;
        remoteImage.write('public'+localUrl);

        //if, for whatever reason, we failed to get the URL, trigger an error response
        if (!localUrl) {
            throw new Error("Could not retrieve an image file from this website!");
        }

        //we have what we need, send the URL on its way
        return res.status(200).json({ success: true, url: localUrl });
    }catch(err){        
        console.log('getWebImage error: ', err);
        res.status(500).json({ success: false, error: err.toString() });
    }
}

/**
 * get web snapshot
 * @param {*} req 
 * @param {*} res 
 */
const getWebSnapshot = async (req, res) => {
    let remoteUrl = decodeURIComponent(req.params.url);
    try{
        // Since webshot does not get along very well with recent node versions and the results tend to look terrible especially on more modern websites (try YouTube, for instance), we used Puppeteer for this feature. Like the old and discontinued PhantomJS, which webshot uses, Puppeteer is a headless browser, which we use here to screenshot a 720p website rendered by Blink/Chromium. The following is an adapted version of the example at https://www.npmjs.com/package/puppeteer:

        //launch the browser, set the viewport and navigate to the page
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 720 });
        await page.goto(remoteUrl);

        //get a new unique filename, append it to the templates server path and save the screenshot
        let fileName = `screenshot_${Date.now()}.png`;
        let localUrl = '/templates/'+fileName;
        await page.screenshot({ path: 'public'+localUrl });
    
        //just to be safe and to avoid bugs or unnecessary complications, shut down the browser
        await browser.close();
        
        //if, for whatever reason, we failed to get the URL, trigger an error response
        if (!localUrl) {
            throw new Error("Could not snapshot this website!");
        }

        //we have what we need, send the URL on its way
        return res.status(200).json({ success: true, url: localUrl });
    }catch(err){
        console.log('getWebSnapshot error: ', err);
        return res.status(500).json({ success: false, error: err.toString() });
    }
}

module.exports = {
    testQueryParams,
    getWebImage,
    getWebSnapshot
}