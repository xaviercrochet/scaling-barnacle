var express = require('express');
var db = require('mongoose');
var images = require('./routes/images');
var cors = require('cors');
var Client = require('ssh2-sftp-client');

var app = express();

db.connect(process.env.MONGODB_URI);
app.listen(process.env.PORT || 3000 );

app.use(cors());
app.use('/images', images);