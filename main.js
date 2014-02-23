
var $ = require("jquery");
var path = require("path");
var _ = require("lodash");
var Q = require("q");
var Backbone = require("backbone");
var glob = require("glob");
var fs = require("fs");

require("./lib/dust-require");
var TreeView = require("./lib/file-browser");

//init editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");




var fil = glob.sync("./!(node_modules)/**")
.concat(glob.sync("./!(node_modules)"))
.map(function(f){return f.slice(2);})
.map(function(file){

	return {
		id: file,
		basename: path.basename(file),
		directory: fs.statSync(file).isDirectory()
	};
});


var files = new Backbone.Collection();
files.set(fil);

var view = new TreeView({collection: files});


$("#browser").html(view.$el);

