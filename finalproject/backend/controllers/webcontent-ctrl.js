const test = (req, res) => {
    console.log(req.query);
    res.status(200).json(req.query);
}

const getWebImage = async (req, res) => {
    let remoteUrl = decodeURI(req.params.url);
    //TODO
    let localUrl="";
    if (!localUrl) {
        return res.status(400).json({ success: false, error: "Could not fetch this image!" })
    }
    return res.status(200).json({ success: true, url: localUrl })
}

const getWebSnapshot = async (req, res) => {
    let remoteUrl = decodeURI(req.params.url);
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