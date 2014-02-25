var core = require("../lib/core");
var fs = require("fs");

//there has to be a better way.... :)
var modeList = {};
global.ace = {
	define: function(name, requires, fn) {
		fn(null, null, modeList);
	}
}
require("../vendor/ace/ext-modelist");
delete global.ace;
modeList = modeList.exports;

var files = {};

core.events.on("load-file", function(filename, filepath){
	if (!files[filename]) {
		var file = files[filename] = {
			path: filepath,
			type: modeList.getModeForPath(filename),
			rawData: fs.readFileSync(filepath),
			filename: filename
		};

		transformFile(file);
	}

	setFile(files[filename]);
});

core.events.on("write-file", function(file){
	if (file.transform) return;

	fs.writeFileSync(file.filename, file.data);
});


function transformFile(file) {
	if (file.type.name === "text" && isBin(file.rawData)) {
		file.transform = "binary";

		file.data = formatHex(file.rawData);
	} else {
		file.data = file.rawData.toString();
	}
}

function formatHex(data) {
	var output = new Buffer(data.length*3 + data.length/8);
	output.fill("00 ");
	var i = 0;
	while (i < data.length) {
		var hex = [];
		var ascii = [];
		for (var b=0;b<8;b++) {
			if (i+b >= data.length) break;
			var cByte = data.readUInt8(i+b);
			hex[b] = data.toString("hex",i+b,i+b+1);
			ascii[b] = cByte > 127 ? "." : String.fromCharCode(cByte);
			if (hex[b].length === 1) hex[b] = "0" + hex[b];
		}

		output.write(hex.join(" ") + "   " + ascii.join("") + "\n");
		i+=8;
	}
	return output.toString();
}
function isBin(data) {
	return true;
}

function setFile(file) {
	core.events.emit("set-file", file);
}
