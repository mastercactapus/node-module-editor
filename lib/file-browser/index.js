var Q = require("q");
var Backbone = require("backbone");
var path = require("path");
var _ = require("lodash");
var $ = require("jquery");

var base = require("./base");

var FileBrowser = Backbone.View.extend({
	tagName: "div",
	className: "css-file-browser",

	events: {
		"change input": "onDirClicked",
		"click a": "onFileClicked"
	},

	initialize: function(options){
		this.listenTo(this.collection, "add remove", _.throttle(this.render, 100));
		this.render().done();
		this.onFileClicked = _.debounce(this.onFileClicked, 50);
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

		if (items.length === 0) return {};

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
		out.contents = dirs[items[0].moduleDir];

		return out;

	},

	
	onFileClicked: function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		var $target = this.$(evt.target);
		var filename = $target.closest("li").data("id");
		this.trigger("file_clicked", filename);
	},
	onDirClicked: function(evt){
		evt.preventDefault();
		evt.stopPropagation();
		var $target = $(evt.target);
		var name = $target.closest("li").data("id");
		this.collection.get(name).set("active", $target.prop("checked"), {silent:true});
	}
});

module.exports = FileBrowser;
