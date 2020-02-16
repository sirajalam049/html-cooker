const express = require('express');
const ssr = require('./ssr.js');

const app = express();

app.get('/reset', async (req, res) => {
    const { query } = req;
    const url = query['url'];
    if (!url) return res.status(200);
    const response = await ssr(url, true);
    return res.status(200).send(response); // Serve prerendered page as response.
});

app.get('/*', async (req, res, next) => {
    const { query } = req;
    const url = query['url'];
    if (!url) return res.status(200);
    const response = await ssr(url);
    return res.status(200).send(response); // Serve prerendered page as response.
});

app.listen(8080, () => console.log('Server started at http://localhost:8080/. \n Press Ctrl+C to quit'));