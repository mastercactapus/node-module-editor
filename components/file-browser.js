var Backbone = require("backbone");
var $ = require("jquery");

var core = require("../lib/core");
var FileBrowserView = require("../lib/file-browser");
var scanner = require("../lib/file-scanner");

var filesCollection = new Backbone.Collection();
var filesView = new FileBrowserView({collection: filesCollection});

$("#browser").html(filesView.$el);


filesView.on("file_clicked", function(file){
	core.events.emit("load-file", file);
});

//core events we care about
core.events.on("set-dir", function(dirname) {
	var files = scanner.scan(dirname);
	filesCollection.set(files);
});
