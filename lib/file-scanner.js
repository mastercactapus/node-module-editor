var glob = require("glob");
var path = require("path");
var os = require("os");
var fs = require("fs");

exports.scan = function(dir) {
	if (os.platform === "win32") {
		dir = dir.replace(/\\/, "/");
	}
	dir = dir || ".";

	return glob.sync(dir + "/!(node_modules)/**")
	.concat(glob.sync(dir + "/!(node_modules)"))
	.map(function(f){return f.slice(2);})
	.map(function(file){

		return {
			id: file,
			basename: path.basename(file),
			directory: fs.statSync(file).isDirectory()
		};
	});
};
