const getWebImage = async (req, res) => {
    let remoteUrl = req.body.url;
    //TODO
    let localUrl="";
    if (!localUrl) {
        return res.status(400).json({ success: false, error: "Could not fetch this image!" })
    }
    return res.status(200).json({ success: true, url: localUrl })
}

const getWebSnapshot = async (req, res) => {
    let remoteUrl = req.body.url;
    //TODO
    let localUrl="";
    if (!localUrl) {
        return res.status(400).json({ success: false, error: "Could not snapshot this website!" })
    }
    return res.status(200).json({ success: true, url: localUrl })
}

module.exports = {
    getWebImage,
    getWebSnapshot
}