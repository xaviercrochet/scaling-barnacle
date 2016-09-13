var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var q = require('q');

var ImageSchema = new Schema({
	filename: {
		type: String,
		required: true,
		unique: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

ImageSchema.statics.createImage = createImage;
ImageSchema.statics.getImage = getImage;
ImageSchema.statics.getImages = getImages;
ImageSchema.statics.deleteImage = deleteImage;

function deleteImage(imageId){
	var d = q.defer();
	Image.findByIdAndRemove(imageId)
		.exec(function(error, image) {
			if(error) {
				d.reject(error);
			}
			else {
				d.resolve(image);
			}
		});
	return d.promise;
};

function createImage(filename) {
	var image = new Image({
		filename: filename
	});
	var d = q.defer();
	image.save().then(function(image) {
		d.resolve(image);
	}, function(error) {
		d.reject(error);
	});
	return d.promise;
};

function getImage(imageID) {
	var d = q.defer();
	Image.findById(imageID)
		.exec(function(err, image) {
			if(err) {
				d.reject(err);
			}
			else {
				d.resolve(image);
			}
		});
	return d.promise;
};

function getImages(){
	var d = q.defer();
	Image.find({}).exec(function(err, images){
		if(err) {
			d.reject(err);
		}
		else {
			d.resolve(images);
		}
	})
	return d.promise;
};

var Image = mongoose.model('Image', ImageSchema);
module.exports = Image;
