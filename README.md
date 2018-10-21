## N.E.S.T. (New Earth Settlement Team)
### Overview
This is a hackathon project developed for Mission Hack (http://www.missionhack.ca/). The theme of the hackathon is to develop a tool that will be beneficial to a group of people selected to colonize a new planet called New Earth. It should solve a specific problem they will encounter in the new environment.

For our project, we chose to create a tool that will solidify communication between people from different language backgrounds and thus foster a better and healthier community.

### Project description
NEST is a React messaging web app that uses Google Translate API to translate all the incoming texts to a language of the user's choice. It uses WebSocket to communicate between the client and the server.

#### Requirements
A valid Google Cloud Platform Service Account key obtained from GCP console (https://console.cloud.google.com/).

Upon creation, you can download the private key as JSON file, place in this folder as `api-secret-key.json`.

Keep in mind that this is a paid service calculated by how many characters are translated using the API, visit https://cloud.google.com/translate/pricing for more pricing details.

#### How to build project
Run `npm install` on both client and server directories.

Start the WebSocket server in `server` with `node server.js`.

Launch the React web app in `client` with `npm start`. Visit `localhost:8080` (default port) to access the app.
