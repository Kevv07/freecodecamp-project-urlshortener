require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

//added to handle url
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// - - START - -
const URL = require("url").URL;
const urlDatabase = {};
let counter = 0;

app.use(bodyParser.json());

app.post('/api/shorturl', function(req,res) {
  const inputUrl = req.body.url;

  //make verification for valid url
  const isValidUrl = (s) => {
    try {
      const url = new URL(s);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
      return false;
    }
  };

  //check if valid URL
   if (!isValidUrl(inputUrl)){
    return res.json({ error: 'invalid url'});
  } 
  else
   {
    const shortUrlCode = counter++;
    urlDatabase[shortUrlCode] = inputUrl;
    res.json({
      original_url: inputUrl,
      short_url: shortUrlCode
    });
  }
});

// get to redirect to the original URL
app.get('/api/shorturl/:short_url', (req, res) => {
  const short_url = req.params.short_url;
  const originalUrl = urlDatabase[short_url];

  if (originalUrl) {
      return res.redirect(originalUrl);
  } else {
      return res.status(404).json({ error: 'No short URL found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
