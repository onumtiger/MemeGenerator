# Submission README

## Development / Testing environment

We developed with Node versions 14.15.1, 15.4 and TODO and current versions of the web browsers Firefox, Opera and Safari (TODO). With other software or other versions of it we cannot guarantee for all features to work properly. Please feel especially discouraged from testing with Internet Explorer or mobile browsers.

## How to install the project

The project is split up in two folders: **./backend** containing an Express server for the API and **./frontend** containing a React client with the frontend. Both are separate node projects, so you will first have to install both by navigating into each of those two folders and run ``npm install`` in them. Especially the React install might take a little while.

If you are installing on MacOS Catalina, you might encounter a problem with the install of node-sass in our frontend project. This is because of a dependency on node-gyp. You can find more info on that [here](https://github.com/nodejs/node-gyp#installation) and [here](https://github.com/nodejs/node-gyp/blob/master/macOS_Catalina.md).

## How to start the project

After installation you can start the project by again navigating into both aforementioned folders and run ``npm start`` in them. The React app will open in development mode on localhost:3000, while the Express backend will run in the background on localhost:3001 (We proxy API calls to the right port in package.json to simplify the URLs in the frontend).

## External tech we used during development

- The React frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- The Express backend was generated with [express-generator](https://www.npmjs.com/package/express-generator). (TODO was it, still?)

## TODO

- guide to MongoDB setup (run mongod before, no need to also run mongo again then... I think? Yes? Maybe?)
- ...
