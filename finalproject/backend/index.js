const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/index.js');
const memeRouter = require('./routes/meme-router.js');
const templateRouter = require('./routes/template-router.js');
const webContentRouter = require('./routes/webcontent-router.js');

const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');

const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
//Maybe not necessary:
//app.use(bodyParser.json({ type: 'application/json' }));

app.use(express.static(path.join(__dirname, 'public')));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
    res.send('Hello World!!');
})

app.use('/api', fileUpload({safeFileNames: true, preserveExtension: true})); //populates req.file for file uploads
app.use('/api', memeRouter);
app.use('/api', templateRouter);
app.use('/api/webcontent', webContentRouter);

//TODO create an error handler for anything that doesn't match the above routers

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));