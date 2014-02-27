var path = require("path");
var glob = require("glob");

//load components
glob.sync(path.join(__dirname, "../components/**/*.js"))
.forEach(require);


var core = require("./core");

module.exports = function(initDir) {
	console.log(initDir)
	core.events.emit("set-dir", path.resolve(initDir));
}
