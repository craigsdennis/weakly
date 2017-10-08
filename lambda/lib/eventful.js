const Client = require("node-rest-client").Client;

const BASE_URL = "http://api.eventful.com/json";
const APP_KEY = process.env.EVENTFUL_APP_KEY;

// NOTE: Headers from eventful are a bit off
const client = new Client({
    mimetypes: {
        json: ["text/javascript;charset=utf-8", "application/json"]
    }
});

function searchEvents(options) {
    // No rest operator...yet.
    const parameters = Object.assign({
        app_key: APP_KEY
    }, options);
    const args = {
        parameters
    };
    return new Promise((resolve, reject) => {
        client.get(`${BASE_URL}/events/search`, args, (data, response) => {
            resolve(data);
        });
    });
}

function getEvent(id) {
    const args = {
        parameters: {
            app_key: APP_KEY,
            id: id
        }
    };
    return new Promise((resolve, reject) => {
        client.get(`${BASE_URL}/events/get`, args, (data, response) => {
            resolve(data);
        });
    });
}

module.exports = {
    searchEvents,
    getEvent
}