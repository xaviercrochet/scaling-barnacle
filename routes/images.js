var express = require('express');
var Image = require('../models/image');
var randomstring = require("randomstring");
var sftpClient = require('../sftp-wrapper');
var multer  = require('multer');

var router = express.Router();
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get('/', function(req, res) {
	Image.getImages()
		.then(function(images){
			res.json(images);
		})
		.catch(function(error){
			res.status(500).send(error);
		});

});

router.get('/:id', function(req, res){
	var imageId = req.params.id;
	Image.getImage(imageId)
		.then(function(image) {
			if(image == null) {
				res.status(404).send(imageNotFoundError(imageId));
			}
			else {
				res.json(image);
			}
		})
		.catch(function(error) {
			res.status(500).send(error);
		});
});

router.delete('/:id', function(req, res){
	var imageId = req.params.id;
	Image.deleteImage(imageId)
		.then(function(image){
			sftpClient.del(image.filename);
			res.status(200).send("Image successfully deleted");
		})
		.catch(function(error) {
			res.status(500).send(error);
		}); 
});

router.post('/', upload.single('filename'),  function(req, res){
	console.log(req);
	if(! req.file) {
		res.status(400).send("Image upload failed");
	}
	else {
		var filename = generateRandomFilename(req.file.originalname);
		sftpClient.put(filename, req.file.buffer);
		Image.createImage(filename)
			.then(function(image){
				res.json(image);
			})
			.catch(function(error){
				res.status(500).send(error);
			});
		}
});

function generateRandomFilename(originalFilename) {
	return randomstring.generate() + "." + originalFilename.split('.').pop();
};

function imageNotFoundError(imageId) {
 	return {
		Message: "Image not found",
		ImageId: imageId
	};
};

module.exports = router;

