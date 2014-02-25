var Backbone = require("backbone");
var $ = require("jquery");
var fs = require("fs");
var path = require("path");
var _ = require("lodash");

var core = require("../lib/core");
var FileBrowserView = require("../lib/file-browser");
var scanner = require("../lib/file-scanner");

var filesCollection = new Backbone.Collection();
var filesView = new FileBrowserView({collection: filesCollection});

$("#browser").html(filesView.$el);


filesView.on("file_clicked", function(filepath){
	core.events.emit("set-file", filepath);
});

var watchers = {};

//core events we care about
core.events.on("set-dir", function(dirname) {
	var files = scanner.scan(dirname);
	filesCollection.set(files);

	removeWatchers();
	addWatchers(dirname, function(filename) {
		//this api seems inconsistant, and inaccurate most of the time
		if (fs.existsSync(filename)) {
			filesCollection.add(scanner.file(dirname, filename), {merge: true});
		} else {
			filesCollection.remove({id: filename});
		}
	});
});

function removeWatchers() {
	_.each(watchers, function(watcher){
		watcher.close();
	});
	watchers = {};
}
function addWatchers(dirname, cb) {
	watchers[dirname] = fs.watch(dirname, function(event, filename){
		if (!watchers[filename] && fs.existsSync(filename) && fs.statSync(filename).isDirectory()) {
			addWatchers(path.resolve(dirname, filename), cb);
		} else if (watchers[filename] && !fs.existsSync(filename)) {
			watchers[filename].close();
			delete watchers[filename];
		}

		cb(path.resolve(dirname, filename));
	});

	fs.readdirSync(dirname).forEach(function(file){
		file = path.resolve(dirname, file);
		if (fs.statSync(file).isDirectory()) {
			addWatchers(file, cb);
		}
	});
}
