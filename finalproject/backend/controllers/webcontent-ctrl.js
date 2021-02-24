var Jimp = require('jimp');

const test = (req, res) => {
    console.log(req.query);
    res.status(200).json(req.query);
}

const getWebImage = async (req, res) => {
    let remoteUrl = decodeURIComponent(req.params.url);
    
    try{
        let remoteImage = await Jimp.read(remoteUrl);
        
        let fileName = `uploaded_${Date.now()}.png`;
        let localUrl = '/templates/'+fileName;
        remoteImage.write('public'+localUrl);

        return res.status(200).json({ success: true, url: localUrl });

    }catch(err){        
        console.log(err);
        res.status(400).json({success: false, error: err.toString()});
    }
}

const getWebSnapshot = async (req, res) => {
    let remoteUrl = decodeURIComponent(req.params.url);
    //TODO
    let localUrl="";
    if (!localUrl) {
        return res.status(400).json({ success: false, error: "Could not snapshot this website!" })
    }
    return res.status(200).json({ success: true, url: localUrl })
}

module.exports = {
    test,
    getWebImage,
    getWebSnapshot
}