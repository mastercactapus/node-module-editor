var glob = require("glob");
var path = require("path");
var os = require("os");
var fs = require("fs");

exports.scan = function(dir) {
	if (os.platform === "win32") {
		dir = dir.replace(/\\/, "/");
	}
	dir = dir || ".";

	return glob.sync(path.join(dir, "!(node_modules)/**"))
	.concat(glob.sync(path.join(dir, "!(node_modules)")))
	.map(function(f){return path.relative(dir, f);})
	.map(function(file){
		var fullPath = path.resolve(dir, file);

		return {
			path: fullPath,
			id: file,
			basename: path.basename(file),
			directory: fs.statSync(fullPath).isDirectory()
		};
	});
};
