/*global __dirname, module, require*/
var error = {
	"missingArg": "Missing required argument",
	"missingArgCurrentFiles": "Missing required argument current files",
	"missingArgFolderName": "Missing required argument folder name",
	"missingArgNewFiles": "Missing required argument new files",
	"missingArgSourcePath": "Missing required argument source path"
};
module.exports.error = error;

module.exports.preview = function (arg) {
	var constant = arg.constant,
		directory = require("../js/admin-directory-contents-api.js"),
		response = arg.response,
		request = arg.request;

	directory.getContents({"folder": decodeURIComponent(request.body.folder)}, function (arg) {
		var dimension = {"width": 200, "height": 200},
			count = {
				"imageLoop": 0,
				"thumbCreated": 0
			},
			json = directory.generateJson(arg),
			out = [],
			queue;
		if (arg.error) {
			throw arg.error;
		}
		function possibleOutput() {
			var done = false;
			if (count.imageLoop === 0) { // no images in this directory
				done = true;
			} else if (count.thumbCreated === count.imageLoop) {
				done = true;
			}
			if (done === true) {
				response.writeHead(200, {'Content-Type': 'application/json'});
				response.end(JSON.stringify({"thumbnails":out}));
			}
		}
		function ifImage(item) {
			function createThumb(item) {
				var sourcePath = require('path').dirname(__dirname) + "/" + item.path.abs,
					outputPath = sourcePath + constant.tempThumbFolder + "/",
					filename = item.name + item.ext;

				require('mkdirp')(outputPath, function (errorNewPath) {
					if (errorNewPath) {
						throw errorNewPath;
					}

					if (require('fs').existsSync(outputPath + filename)) { // file exists
						count.thumbCreated++;
						possibleOutput();
						return;
					}
					require('gm')(sourcePath + filename)
						.resize(dimension.width, dimension.height + ">")
						.gravity('Center')
						.extent(dimension.width, dimension.height)
						.write(outputPath + filename, function (errorWriting) {
							if (errorWriting) {
								throw errorWriting;
							}
							count.thumbCreated++;
							possibleOutput();
						});
				});
			}
			if (item.content.type === "image") {
				count.imageLoop++;
				createThumb(item);
				out.push(constant.tempThumbFolder + "/" + item.name + item.ext);
			}
		}
		queue = require("async").queue(function (item, callback) {
			ifImage(item);
			callback();
		}, 1);

		queue.push(json.items, function(errorEach){
			if (errorEach) {
				throw errorEach;
			}
		});
		queue.drain = possibleOutput;
	});
};

/**
Create directory or use existing directory

@method ensureDestinationFolder
@param {object} arg arguments
@param {string} arg.folderName Destination folder's name for this photo batch
@param {string} [arg.destinationRootPath=resizeImages] Destination photo path excluding filename
@return {string[]} paths to verified directories
**/
module.exports.ensureDestinationFolder = function (arg) {
	var destinationPath,
		mkdrip = require('mkdirp'),
		out = [];
	if (arg === undefined) {
		throw new ReferenceError(error.missingArg);
	}
	if (arg.folderName === undefined) {
		throw new ReferenceError(error.missingArgFolderName);
	}
	destinationPath = arg.destinationRootPath || (require('path').dirname(__dirname) + '/resizeImages/');

	function createOrVerifyFolder(folder) {
		var folderPath = destinationPath + folder + '/' + arg.folderName;
		try {
			mkdrip.sync(folderPath);
		} catch (err) {
			throw err;
		}
		return folderPath;
	}
	out.push(createOrVerifyFolder("originals"));
	out.push(createOrVerifyFolder("photos"));
	out.push(createOrVerifyFolder("thumbs"));
	
	return out;
};
/**
Move source photo to destination originals folder

@method movePhotosToDestinationOriginal
@param {object} arg arguments
@param {string} arg.sourceFolderPath Original photo path excluding filename
@param {string} [arg.destinationRootPath=resizeImages] Destination photo path excluding filename
@param {string[]} arg.newFiles Ordered list of new renamed files (extension excluded)
@param {string[]} arg.currentFiles Ordered list of current files (extension excluded)
@return {undefined}
**/
module.exports.movePhotosToDestinationOriginal = function (arg, callback) {
	var callbackCount = 0,
		destinationPath,
		files = [],
		queue;
	if (arg === undefined) {
		throw new ReferenceError(error.missingArg);
	}
	if (arg.sourceFolderPath === undefined) {
		throw new ReferenceError(error.missingArgSourcePath);
	}
	if (arg.currentFiles === undefined || arg.currentFiles.length === 0) {
		throw new ReferenceError(error.missingArgCurrentFiles);
	}
	if (arg.newFiles === undefined || arg.newFiles.length === 0) {
		throw new ReferenceError(error.missingArgNewFiles);
	}
	destinationPath = arg.destinationRootPath || (require('path').dirname(__dirname) + '/resizeImages/');

	arg.currentFiles.forEach(function (file, index) {
		files.push({
			"current": destinationPath + file,
			"rename": destinationPath + arg.newFiles[index]
		});
	});

	function possibleCallback() { // calculate if all async calls are complete
		callbackCount++;
		
		if (callbackCount === (files.length + 1)) { // +1 for drain
			callback();
		}
	}

	queue = require("async").queue(function (file, errorCallback) {
		require('fs').rename(file.current, file.rename, function (err) {
			if (err) {
				throw err;
			}
			possibleCallback();
		});
		errorCallback();
	}, 1);

	queue.push(files, function(errorEach){
		if (errorEach) {
			throw errorEach;
		}
	});
	queue.drain = possibleCallback;
};

module.exports.resize = function (arg) {
	var constant = arg.constant,
		response = arg.response,
		request = arg.request;

	response.writeHead(200, {'Content-Type': 'application/json'});
	response.end(JSON.stringify({}));
};