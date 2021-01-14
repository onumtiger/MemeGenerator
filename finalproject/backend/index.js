const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db/index.js')
const memeRouter = require('./routes/meme-router.js')
const app = express()
const path = require('path');

const PORT = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!!')
})

app.use('/api', memeRouter)

//TODO create an error handler for anything that doesn't match the above routers

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))