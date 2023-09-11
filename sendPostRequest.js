const axios = require('axios');

// Define the URL of your API
const apiUrl = 'http://localhost:3000/notes'; 

// Define the data you want to send in the request body
const requestData = {
    title: 'New Note',
    body: 'This is the content of the new note.',
};

// Send a POST request to the API
axios
    .post(apiUrl, requestData)
    .then((response) => {
        console.log('POST request successful.');
        console.log('Response data:', response.data);
    })
    .catch((error) => {
        console.error('Error:', error.message);
    });
