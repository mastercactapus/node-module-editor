var core = require("../lib/core");

var state = exports;
var ace = window.ace;

//init editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

state.editor = editor;

core.events.on("set-file", function(name, data, type){
	editor.setValue(data.toString());
	editor.getSession().setMode("ace/mode/" + type);
});

