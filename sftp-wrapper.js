var express = require('express');
var Client = require('ssh2-sftp-client');
var sftp = new Client();
var q = require('q');
var imagesPath = ('./images/');

var sftpWrapper = {
	put: put,
	del: del
}
sftp.connect({
    host: 'ssh.lisadeb.com',
    port: '22',
    //username: 'lisadeb.com',
    //password: 'HappyDays!'
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD
}).catch(function(error){
	console.log(error);
});

function put(filename, data) {
	return sftp.put(data, imagesPath + filename, []);
};

function del(filename) {
	return sftp.delete(imagesPath + '/' + filename);
};

module.exports = sftpWrapper;