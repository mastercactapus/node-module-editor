var core = require("../lib/core");
var fs = require("fs");

var state = exports;
var ace = window.ace;

//init editor
var editor = ace.edit("editor");
var modelist = ace.require("ace/ext/modelist");

editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

state.editor = editor;
state.files = {};

var currentFile;

core.events.on("set-file", function(filename){
	currentFile = filename;
	if (!state.files[filename]) {
		state.files[filename] = createSession(filename);
	}
	editor.setSession(state.files[filename].editSession);
	editor.focus();
});
core.events.on("save-file", function(){
	var data = editor.getValue();
	var file = state.files[currentFile];
	fs.writeFileSync(currentFile, data);
});

function createSession(filename) {
	var file = {};
	file.data = fs.readFileSync(filename);
	file.editSession = ace.createEditSession(file.data.toString(), modelist.getModeForPath(filename).mode);
	file.editSession.setUseWrapMode(true);

	return file;
}
