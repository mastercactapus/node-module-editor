var Backbone = require("backbone");

var base = require("./base");

var RecentFiles = Backbone.View.extend({
	className: "recent-files",

	events: {
		"click a": "onFileClicked"
	},

	onFileClicked: function(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		var filename = this.$(evt.target).closest("li").data("filename");
		this.trigger("file_clicked", filename);
	},

	renderFiles: function(files) {
		var self = this;

		files = files.slice();
		var ctx = {
			current: files.shift(),
			files: files
		};

		base.render(ctx)
		.then(function(html){
			self.$el.html(html);
		});
	}
});

module.exports = RecentFiles;
