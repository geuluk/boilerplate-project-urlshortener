require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var storage = new Map();
var counter = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//getUrl
app.get('/api/shorturl/:id?', function(req, res) {
  var url = storage.get(req.params.id);
  if (url!=null){
    res.redirect(url)
  } else {
    res.json({ error: 'invalid url' });
  }
});

//addUrl
app.post('/api/shorturl/', function(req, res) {
  var url = req.body.url;
  if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(url)){
    var id = ++counter;
    storage.set(String(id), url);
    res.json({ original_url : url, short_url : id});
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
