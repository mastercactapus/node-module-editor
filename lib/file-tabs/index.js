var Backbone = require("backbone");
var path = require("path");
var dust = require("dustjs-linkedin");

var base = require("./base");

var Tab = Backbone.Model.extend({
	initialize: function(){
		this.listenTo(this, "change:changed", this.onChanged);
		this.set("basename", path.basename(this.get("id")));
	},
	onChanged: function(){
		//remove if not pinned and not changed
		if (!this.get("pinned") && !this.get("changed")) {
			this.stopListening();
			this.collection.remove(this);
		}
	}
});

var Tabs = Backbone.Collection.extend({
	model: Tab,
	initialize: function(){
		this.listenTo(this, "add", this.onAdd);
	},
	onAdd: function(model) {
		if (model.get("id") === this.activeFile) {
			model.set("active", true);
		}
	},
	setActive: function(filename) {
		this.activeFile = filename;
		this.forEach(function(model){
			if (model.get("id") === filename) {
				model.set("active", true);
			} else {
				model.set("active", false);
			}
		})
	},
	comparator: function(a,b){
		if (a.pinned && !b.pinned) return 1; //pinned after non-pinned
		if (b.pinned && !a.pinned) return -1;

		if (a.changed && !b.changed) return -1; //changed before unchanged
		if (b.changed && !a.changed) return 1;

		if (a.id < b.id) return -1; //alphabetical otherwise
		if (a.id > b.id) return 1;

		return 0; //they are the same
	}
});

var TabBar = Backbone.View.extend({
	events: {
		"click li": "onTabClick"
	},
	initialize: function(){
		this.listenTo(this.collection, "sort remove change", this.render);
		this.render().done();
	},
	render: function(){
		var self = this;

		return base.render(this.collection.toJSON())
		.then(function(html){
			self.$el.html(html);
		});
	},
	onTabClick: function(evt) {
		var filename = this.$(evt.target).closest("li").data("id");
		this.trigger("file_clicked", filename);
	}
});



exports.Tab = Tab;
exports.Tabs = Tabs;
exports.TabBar = TabBar;