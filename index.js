var gui = require("nw.gui");
var fs = require("fs");
var path = require("path");
var initDir = gui.App.argv[0] || process.env.PWD;
initDir = path.resolve(initDir);

function findPackage(dir) {
	var newPath = path.dirname(dir);
	if (fs.existsSync(path.join(dir, "package.json"))) {
		return dir;
	} else if (newPath !== dir) {
		return findPackage(newPath);
	} else {
		throw new Error("Could not find package.json");
	}
}


require("./lib/main")( findPackage(initDir) );
