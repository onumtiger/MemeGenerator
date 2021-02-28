# Submission README - MEMIFY

## Development / Testing environment

We developed with Node versions 14.15.1 and current versions of the web browsers Chrome, Firefox (voice rec not supported) and Safari (voice rec not supported). With other software or other versions of it we cannot guarantee for all features to work properly. Please feel especially discouraged from testing with Internet Explorer or mobile browsers, some features will most likely not work on these browsers. 

Please also note that the speech recognition features *only* work with Chrome.
So the best way to go is Chrome.

## How to install the project

The project is split up in two folders: **./backend** containing an Express server for the API and **./frontend** containing a React client with the frontend. Both are separate node projects, so you will first have to install both by navigating into each of those two folders and run ``npm install`` in them. Especially the React install might take a little while.

Our backend relies on MongoDB (with mongoose), so make sure it is installed on your machine as well.

If you are installing on MacOS Catalina, you might encounter a problem with the install of node-sass in our frontend project. This is because of a dependency on node-gyp. You can find more info on that [here](https://github.com/nodejs/node-gyp#installation) and [here](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md).

## How to start the project

After installation you have to start the project in three main steps:

- **Start the Database:** Run `mongod` and/or, depending on your operating system, do whatever magic you have to do to get the MongoDB server daemon to run - this might include setting the `dbpath` flag.
- **Start the Server:** navigate into our `./backend` folder and run ``npm start``
- **Start the Frontend:** navigate into our `./frontend` folder and run ``npm start``

The React app will open in development mode on localhost:3000, while the Express backend will run in the background on localhost:3001 (we proxy HTTP requests from the frontend to the right port in package.json to simplify the URLs for static content).

## How to run the automated tests

- To enable testing the backend server needs to be available
- **Start the Server:** navigate into our `./backend` folder and run ``npm start``
- The test check the frontend backend connection
- **Run the Test:** navigate into our `./frontend` folder and run ``npm test``
## External tech we used during development

- The React frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- The login/sign up screen UI was taken (changed afterwards) from the following source (https://codepen.io/FlorinPop17/pen/vPKWjd)
- The API image creation is using the "JavaScript Image Manipulation Program"  - JIMP (https://www.npmjs.com/package/jimp)
- The voice control and text reading function is based on the Web Speech Api (https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Creating a meme in our site is also possible via the ImgFlip API (https://imgflip.com/api)
- The charts were created with D3.js, a JavaScript library for manipulating documents based on data (https://d3js.org)
- the jwt token is created using the jsonwebtoken package (https://www.npmjs.com/package/jsonwebtoken). JWT are used to encode information store at them at the client
- the password is encrypted and decrypted with bcrypt (https://www.npmjs.com/package/bcrypt). Bcrypt uses a given salt to hash e.g. passwords 
- the communication between backend and frontend is done with axios (https://www.npmjs.com/package/axios). With axios http requests are generated to use a restful api.
- creating memes via screenshots is done with puppeteer (https://www.npmjs.com/package/puppeteer). Puppeteer enanbles interacting with the browser via code e.g. to navigate between pages.
- the body-parser (https://www.npmjs.com/package/body-parser) is used to use bodies of http requests in our middleware.
- Using nodemon (https://www.npmjs.com/package/nodemon) real time changes in our backend are possible as it reloads everytime a change is saved
- Jest (https://www.npmjs.com/package/jest) is a testing library which enables automated testing. It can be modified in several ways to enbale e.g. UI testing using puppeteer.
- cors (https://www.npmjs.com/package/cors) is used to enable middleware usage

## How to use our voice control:

- The voice control only recognizes english language
- It is active by clicking the "enable voice control" button within the "Custom Meme Creation" page
- It stops when re-clicking on the same button or by saying the keywords "stop" or "thank you", alone or within a sentence
- The voice control is answering after every voice input, so if there is no answer then there is something broken
- The voice recognition is capable of understanding 90% of the page input possibilities, thus 90% of the pages functionality

    (FUNCTION) (Y/N), (VOICE INPUT EXAMPLE)
    -> Choose template (Y), example: "Choose template number one"
    -> Create new template (Y), example: "Create a new template"
    -> Use draft (Y), example: "Use draft"
    -> Next template (Y), example: "Next template"
    -> Previous template (Y), example: "Previous template"
    -> Use this template (Y), example: "Use this template"
    -> Create own image (Y), example: "Create own image"
    -> Upload external image (Y), example: "Upload external image"
    -> Entering a title (Y), example: "Enter title" (asking which title then)
    -> Adding captions (Y), example: "Add caption"
    -> Specific font styling (N), not supported now, but answers when asked to do so
    -> Setting visibility (Y), example: "set to public"
    -> Saving as draft (Y), example: "Save as draft"
    -> Saving as new draft (Y), example: "Save as new draft"
    -> Download image (Y), example: "download image"
    -> Publish image (Y), example: "publish image"

    -> If the recognition did not understand the voice input it asks you to say a command one more time 
    -> If the voice control is not feeling confident with what she/he understood, she/he will say that

    -> (gender equality), we encountered that the voice control is a man on apple devices and a women on windows devices
    -> Furthermore we are pretty confident that the voice control is working better when no other program uses the microphone at the same time (this may be subjective and perhaps caused by some other disturbing sounds when connected to another voice channel like discord)
    -> Only working on Google Chrome, but checked and handled when used by another browser. 


## How to use our (image creation) API:

- (1) Image generation: 

    URL query parameters - expected form:
    http://localhost:3001/api/external?images[0][name]=name1&images[0][captions][0][x]=10&images[0][captions][0][y]=10&images[0][captions][0][text]=caption1&images[0][captions][0][textColor]=%23ff3333&images[0][captions][1][x]=80&images[0][captions][1][y]=80&images[0][captions][1][text]=caption2&images[0][captions][1][textColor]=%2333ffff&images[1][name]=name2&images[1][captions][0][x]=10&images[1][captions][0][y]=10&images[1][captions][0][text]=caption3&images[1][captions][0][textColor]=%23d24dff&images[1][captions][1][x]=80&images[1][captions][1][y]=80&images[1][captions][1][text]=caption4&images[1][captions][1][textColor]=%23d9ff66&templateURL=https%3A%2F%2Fi.ytimg.com%2Fvi%2FjSiVi800um0%2Fhqdefault.jpg

    translates to:
    {
        templateURL: 'https%3A%2F%2Fi.ytimg.com%2Fvi%2FjSiVi800um0%2Fhqdefault.jpg', //URIEncoded template image URL
        images: [
            {
                name: 'name1', //filename, .png will be appended. if this name already exists or none is given, another name will be chosen
                captions: [
                    {
                        x: '10',
                        y: '10',
                        textColor: '%23ff3333', // hex color of text (URIEncoded!)
                        text: 'caption1'
                    },
                    {
                        x: '80',
                        y: '80',
                        textColor: '%2333ffff', // hex color of text (URIEncoded!)
                        text: 'caption2'
                    }
                ]
            },
            {
                name: 'name2', //filename, .png will be appended. if this name already exists or none is given, another name will be chosen
                captions: [
                    {
                        x: '10',
                        y: '10',
                        textColor: '%23d24dff', // hex color of text (URIEncoded!)
                        text: 'caption3'
                    },
                    {
                        x: '80',
                        y: '80',
                        textColor: '%23d9ff66', // hex color of text (URIEncoded!)
                        text: 'caption4'
                    }
                ]
            }
        ]
    } 


- (2) Get a specific set of images using search parameters (provided as a zip file):

    URL query parameters - expected form (example):
    http://localhost:3001/api/external/getImages?titleContains=Jan&fileFormat=png|jpg&maxImages=10

    It expects at least one of these URL query parameters with truthy string values:

     - titleContains: meme title filter, only return memes that (case-insensitively) contain this string in the meme title
     - fileFormat: one or multiple (separated by the '|' character) file extensions, only return memes that are of these file types
     - maxImages: only return the first x matching memes

  
    