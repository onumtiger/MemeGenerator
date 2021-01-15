# Submission README

## How to install the project

The project is split up in two folders: **./backend** containing an Express server for the API and **./frontend** containing a React client with the frontend. Both are separate node projects, so you will first have to install both by navigating into each of those two folders and run ``npm install`` in them. Especially the React install might take a little while.

## How to start the project

After installation you can start the project by again navigating into both aforementioned folders and run ``npm start`` in them. The React app will open in development mode on localhost:3000, while the Express backend will run in the background on localhost:3001 (We proxy API calls to the right port in package.json to simplify the URLs in the frontend).

## External tech we used during development

- The React frontend was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
- The Express backend was generated with [express-generator](https://www.npmjs.com/package/express-generator). (TODO was it, still?)

## TODO

- guide to MongoDB setup (run mongod before, no need to also run mongo again then... I think? Yes? Maybe?)
- ...
