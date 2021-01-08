const Meme = require('../db/models/meme-model')

const createMeme = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a movie',
        })
    }

    const meme = new Meme(body)

    if (!meme) {
        return res.status(400).json({ success: false, error: "err" })
    }

    meme
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: meme._id,
                message: 'meme created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'meme not created!',
            })
        })
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
    await Meme.find({}, (err, meme) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!meme.length) {
            return res
                .status(404)
                .json({ success: false, error: `Movie not found` })
        }
        return res.status(200).json({ success: true, data: meme })
    }).catch(err => console.log(err))
}

module.exports = {
    createMeme,
    deleteMeme,
    getMemes,
    getMemeById,
}