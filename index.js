const express = require('express');
const ssr = require('./ssr.js');

const app = express();

app.get('/*', async (req, res, next) => {
    const { query } = req;
    const url = query['url'];
    if (!url) return res.status(200);
    const response = await ssr(url);
    // console.log('Res', response);
    // Add Server-Timing! See https://w3c.github.io/server-timing/.
    // res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
    return res.status(200).send(response); // Serve prerendered page as response.
});

app.listen(8080, () => console.log('Server started at http://localhost:8080/. \n Press Ctrl+C to quit'));