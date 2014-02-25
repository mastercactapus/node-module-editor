var core = require("../lib/core");

var state = exports;
var ace = window.ace;

//init editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

state.editor = editor;

var ignoreChanges = true;
var currentFile;

core.events.on("set-file", function(file){
	ignoreChanges = true;
	currentFile = file;
	editor.setValue(file.data, -1);
	editor.getSession().setMode(file.type.mode);
	ignoreChanges = false;
});
core.events.on("save-file", function(){
	core.events.emit("write-file", currentFile);
});

editor.getSession().on("change", onChange);
function onChange(evt) {
	if (ignoreChanges) return;

	core.events.emit("editor-change", evt);
	currentFile.data = editor.getValue();
}
