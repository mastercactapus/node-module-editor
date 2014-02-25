var core = require("../lib/core");
var fs = require("fs");
var yaml = require("js-yaml");

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

editor.on("change", function(evt){
	core.events.emit("file-changed", currentFile);
});

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
	if (file.transform) {
		data = file.transform.write(data);
	}
	fs.writeFileSync(currentFile, data);
	core.events.emit("file-saved", currentFile);
});

function createSession(filename) {
	var file = {};
	file.data = fs.readFileSync(filename);
	file.mode = modelist.getModeForPath(filename);

	if (transforms[file.mode.name]) {
		file.transform = transforms[file.mode.name];
		file.data = file.transform.read(file.data);
		file.mode = file.transform.mode;
	}

	file.editSession = ace.createEditSession(file.data.toString(), file.mode.mode);
	file.editSession.setUseWrapMode(true);


	return file;
}

var transforms = {
	json: {
		mode: modelist.getModeForPath("transform.yaml"),
		read: function(data) {
			//should store orig file formatting data
			
			var jsonData = JSON.parse(data);
			return yaml.safeDump(jsonData,{
				indent: 4
			});
		},
		write: function(data) {
			var yamlData = yaml.safeLoad(data);
			return JSON.stringify(yamlData, null, "  ") + "\n";
		}
	}
};
