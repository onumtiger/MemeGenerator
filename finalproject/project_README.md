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
- **Run the Tets:** navigate intro our `./frontend` folder and run ``npm test ``
## External tech we used during development

- The React frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- The Express backend was generated with [express-generator](https://www.npmjs.com/package/express-generator). (TODO was it, still?)
- The login/sign up screen UI was taken (changed afterwards) from the following source (https://codepen.io/FlorinPop17/pen/vPKWjd)
- The API image creation is using the "JavaScript Image Manipulation Program"  - JIMP (https://www.npmjs.com/package/jimp)
- The voice control and text reading function is based on the Web Speech Api (https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Creating a meme in our site is also possible via the ImgFlip API (https://imgflip.com/api)
- The charts were created with D3.js, a JavaScript library for manipulating documents based on data (https://d3js.org)