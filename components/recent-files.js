var $ = require("jquery");
var core = require("../lib/core");
var RecentFiles = require("../lib/recent-files");
var path = require("path");
var _ = require("lodash");

var recentFilesView = new RecentFiles();

$("#recent-files").html(recentFilesView.$el);


var recent = [];
core.events.on("set-file", function(filename){
	addFile(filename);
	recentFilesView.renderFiles(recent);
});
recentFilesView.on("file_clicked", function(filename) {
	core.events.emit("set-file", filename);
});

function addFile(filename) {
	var idx = _.findIndex(recent, {filename: filename});
	if (idx !== -1) {
		recent.splice(idx,1);
	}
	recent.unshift({
		filename: filename,
		basename: path.basename(filename)
	});
	if (recent.length > 10) {//get config
		recent.pop();
	}
}
