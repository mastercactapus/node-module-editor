var glob = require("glob");
var path = require("path");
var os = require("os");
var fs = require("fs");

exports.scan = function(dirname) {
	if (os.platform === "win32") {
		dirname = dirname.replace(/\\/, "/");
	}
	dirname = dirname || ".";

	return glob.sync(path.resolve(dirname, "!(node_modules)/**"))
	.concat(glob.sync(path.resolve(dirname, "!(node_modules)")))
	.map(function(file){
		return exports.file(dirname, file);
	});
};

exports.file = function(dirname, filename) {
	var relativePath = path.relative(dirname, filename);

	return {
		id: filename,
		moduleDir: dirname,
		relativePath: relativePath,
		basename: path.basename(filename),
		directory: fs.statSync(filename).isDirectory()
	};
}
