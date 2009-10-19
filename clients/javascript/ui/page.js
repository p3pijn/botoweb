/**
 * @author    Ian Paterson
 * @namespace boto_web.ui.page
 */

/**
 * A page with botoweb markup.
 *
 * @param html an HTML document fragment for parsing.
 */
boto_web.ui.Page = function(html) {
	var self = this;

	self.node = $(html).find(boto_web.ui.selectors.section);
	self.id = self.node.id || 'section_' + boto_web.ui.desktop.num_pages;

	if (self.node.attr(boto_web.ui.properties.model)) {
		self.node.find(boto_web.ui.selectors.object).each(function() {
			var model = boto_web.env.models[self.node.attr(boto_web.ui.properties.model)];
			var url = document.location.href + '';
			var node = this;
			var id = url.replace(/.*\?([^&]*)&?(edit|delete)?/, '$1');

			self.id = model.name + '_' + id;

			if (self.id in boto_web.ui.desktop.pages) {
				boto_web.ui.desktop.pages[self.id].obj.do_action(RegExp.$2);
				return;
			}

			$(node).hide();

			model.get(id, (function(action) { return function(obj) {
				self.obj = new boto_web.ui.Object(node, model, obj, action);
				$(node).show();
			};})(RegExp.$2));
		});
	}
	else {
		self.node.find(boto_web.ui.selectors.search).each(function() {
			new boto_web.ui.widgets.Search(this);
		});
	}

	if (self.id in boto_web.ui.desktop.pages) {
		return boto_web.ui.desktop.pages[self.id];
	}

	self.activate = function() {
		boto_web.ui.desktop.activate(self);
	}

	// Parse valid elements in the html but outside the <section>
	document.title = $(html).find('title').html() || document.title;
};
