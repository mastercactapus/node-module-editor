var core = require("../lib/core");
var $ = require("jquery");

var $body = $("body");


//config file anybody??
$body.on("keypress", function(evt){
	if (evt.keyCode === 19 && evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
		core.events.emit("save-file");
	}
});

