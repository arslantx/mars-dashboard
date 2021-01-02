require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

const NASA_API_ENDPOINT = 'https://api.nasa.gov';
const NASA_API_KEY = process.env.NASA_API_KEY;

app.get('/roverinfo/:rover', async (req, res) => {
    try {
        let roverData = await fetch(`${NASA_API_ENDPOINT}/mars-photos/api/v1/rovers/${req.params.rover}?api_key=${NASA_API_KEY}`)
            .then(resp => resp.json());
        res.send({ roverData });
        // res.send(roverInfoData);
    } catch (err) {
        console.log('Error calling roverInfo endpoint:', err);
    }
});

app.get('/images/:rover', async (req, res) => {
    try {
        let images = await fetch(`${NASA_API_ENDPOINT}/mars-photos/api/v1/rovers/${req.params.rover}/latest_photos?api_key=${NASA_API_KEY}`)
            .then(resp => resp.json());
        res.send({ images });
        // res.send(imageData);
    } catch (err) {
        console.log('Error calling images endpoint:', err);
    }
});

app.listen(port, () => console.log(`Mars Dashboard app listening on port ${port}!`))
