const mongoose = require('mongoose')


//TODO: check image URL
mongoose
    .connect('mongodb://127.0.0.1:27017/images', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db