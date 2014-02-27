var dust = require("dustjs-linkedin");
require("dustjs-helpers");
var fs = require("fs");
var Q = require("q");

if (require.extensions) {
    require.extensions[".dust"] = function(module, filename) {
        var text = fs.readFileSync(filename, 'utf8');
        var source = dust.compile(text, filename);
        var tmpl = dust.loadSource(source, filename);

        module.exports = tmpl;
        module.exports.render = function(context) {
            return Q.nfcall(dust.render, filename, context);
        };
        module.exports.stream = function(context) {
            return Q.nfcall(dust.stream, filename, context);
        };
    };
}
