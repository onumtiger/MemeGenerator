const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/index.js');
const zip = require('express-zip');
// ROUTER
const memeRouter = require('./routes/meme-router.js');
const userRouter = require('./routes/user-router.js');
const templateRouter = require('./routes/template-router.js');
const statsRouter = require('./routes/stats-router.js');
const webContentRouter = require('./routes/webcontent-router.js');
const guiDataRouter = require('./routes/guidata-router.js');
const generateRouter = require('./routes/generate-router.js');
const draftRouter = require('./routes/draft-router.js');
// VARIOUS
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const PORT = 3001;

// USE
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
// USE static files middleware for everything in the public folder - used mainly for images
app.use(express.static(path.join(__dirname, 'public')));

// HANDLE mongoDB errors
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
// POPULATE req.file for file uploads
app.use('/api', fileUpload({safeFileNames: true, preserveExtension: true}));

// REGISTER our routers
app.use('/api/meme', memeRouter);
app.use('/api/user/', userRouter)
app.use('/api/templates', templateRouter);
app.use('/api/stats', statsRouter);
app.use('/api/webcontent', webContentRouter);
app.use('/api/guidata', guiDataRouter);
app.use('/api/external', generateRouter);
app.use('/api/drafts', draftRouter);

// FALLBACK error message for anything else, using the same JSON response structure as the rest to allow for generic response handling without breaking anything with the default HTML/XML response
app.use('/', (req, res) => {
    res.status(404).json({success: false, error: `You sent a ${req.method} request to the URL ${req.originalUrl}, but there is no handler for this kind of request. Please check the URL and HTTP-Method.`});
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));