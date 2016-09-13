var express = require('express');
var db = require('mongoose');
var images = require('./routes/images')
var app = express();
var Client = require('ssh2-sftp-client');
var sftp = new Client();

db.connect(process.env.MONGODB_URI);
app.listen(process.env.PORT || 3000 );

module.exports = sftp;

app.use('/images', images);