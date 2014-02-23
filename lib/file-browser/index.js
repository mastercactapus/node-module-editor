var Q = require("q");
var Backbone = require("backbone");
var path = require("path");
var _ = require("lodash");
require("../dust-require");

var base = require("./base");

var FileBrowser = Backbone.View.extend({
	tagName: "div",
	className: "css-file-browser",

	events: {
		"click .dir": "onDirClicked",
		"click .file": "onFileClicked"
	},

	initialize: function(options){
		this.listenTo(this.collection, "change", this.render);
		this.render().done();
	},
	render: function(){
		var self = this;
		
		var ctx = this._getRenderCtx();

		return base.render(ctx)
		.then(function(html){
			self.$el.html(html);
		});
	},
	_getRenderCtx: function() {
		var items = this.collection.toJSON();
		var dirs = {};

		//build list of directories
		items.forEach(function(item){
			var dir = path.dirname(item.id);
			dirs[dir] = dirs[dir] || [];
			dirs[dir].push(item);
		});

		//sort the list of directories
		_.each(dirs, function(items, name){
			dirs[name] = _.sortBy(items, function(item){

				return (item.directory ? "/" : "") + item.id;
			});
		});

		items.forEach(function(item){
			if (item.directory) {
				item.contents = dirs[item.id];
			}
		});

		var out = {};
		out.contents = dirs["."];

		return out;

	},

	
	onFileClicked: function(evt){
	
	},
	onDirClicked: function(evt){
		var $target = $(evt.target);
		var name = $target.closest("li").data("id");
		this.collection.get(name).set("active", $target.prop("checked"), {silent:true});
	}
});

module.exports = FileBrowser;
