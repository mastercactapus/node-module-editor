
var path = require("path");
var glob = require("glob");

//load components
glob.sync(path.join(__dirname, "../components/**/*.js"))
.forEach(require);


var core = require("./core");
core.events.emit("set-dir", ".");
