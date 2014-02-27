
var core = require("../lib/core");
var FileTabs = require("../lib/file-tabs");
var Backbone = require("backbone");
var $ = require("jquery");

var tabs = new FileTabs.Tabs();

var tabBar = new FileTabs.TabBar({
	collection: tabs,
	viewModel: new Backbone.Model()
});

$("#file-tabs").html(tabBar.$el);

var currentFile;

tabBar.on("file_clicked", function(filename){
	core.events.emit("set-file", filename);
});

core.events.on("file-changed", function(filename){
	tabs.add({
		id: filename,
		changed: true
	},{merge:true});
});
core.events.on("file-pin", function(filename){
	tabs.add({
		id: filename,
		pinned: true
	},{merge:true});
});
core.events.on("file-saved", function(filename){
	var tab = tabs.get(filename);
	if (tab) {
		tab.set("changed", false);
	}
});
core.events.on("set-file", function(filename){
	tabs.setActive(filename);
});
