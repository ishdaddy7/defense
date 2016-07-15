'use strict';

var app = require('./app');
var db = require('./db');
var https = require('https');
var fs = require('fs');

var port = 8000;

const options = {
  key: fs.readFileSync('/Users/shan/Documents/MediaMath/Personal/Fullstack/auther/defense/server/key.pem'),
  cert: fs.readFileSync('/Users/shan/Documents/MediaMath/Personal/Fullstack/auther/defense/server/cert.pem')
};

var secureServer = https.createServer(options, app).listen(port, function (err) {
  if (err) throw err;
  console.log('HTTP server patiently listening on port', port);
  db.sync()
  .then(function () {
    console.log('Oh and btw the postgres server is totally connected, too');
  });
});


/*
var server = app.listen(port, function (err) {
  if (err) throw err;
  console.log('HTTP server patiently listening on port', port);
  db.sync()
  .then(function () {
    console.log('Oh and btw the postgres server is totally connected, too');
  });
});
*/
module.exports = secureServer;
