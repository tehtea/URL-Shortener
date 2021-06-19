# Sample URL Shortening Service

This is a sample URL shortening service that converts a given URL into a randomized 6-character slug.
It is done by generating a UUIDv4 for each given URL, then storing this URL and the first six characters of the UUID in Firebase.
A shortened URL is formed by suffix-ing the generated slug with this service's domain name to redirect the user to the target URL.

You can view the deployed demo at [this link](https://gds-interview.et.r.appspot.com/).

## Environment
- Developed on Windows 10 with CMD commands, scripts may not be compatible with Bash
- Node v14
- DB used: Firebase Firestore
- Designed for deployment on Google App Engine

## How to run locally
- Prerequisite: Ensure that dependencies are installed: `npm install`
- To run the entire service, use `npm start-local`
- To only run the frontend for development, use `npm run start-client`
- To run sample integration test, use `npm test`
- To lint the project, use `npm run lint`

## Assumptions
- The long URL provided by client is reachable
- First six characters of UUIDv4 is sufficient to minimize shortened URL collisions in db
- Validity of shortened URLs not guaranteed - old shortened URLs are overwritten in event of collision

## Development Notes / Credits
- Forked from the Hello World! sample for Node.js on Google App Engine
- Followed this to find out how to render React Apps using Express: https://levelup.gitconnected.com/how-to-render-react-app-using-express-server-in-node-js-a428ec4dfe2b
- Used this to figure out how to write reducers on the frontend in a cleaner way: https://medium.com/stashaway-engineering/react-redux-tips-better-way-to-handle-loading-flags-in-your-reducers-afda42a804c6
- Make sure useReducer does not return promise:
https://stackoverflow.com/questions/61261658/usereducer-returning-a-promise-instead-of-the-updated-state
