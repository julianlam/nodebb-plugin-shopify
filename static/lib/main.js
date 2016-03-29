$(window).on('action:composer.loaded', function(e, data) {
	var composer = $('#cmp-uuid-' + data.post_uuid + ' .write');

	composer.textcomplete([{
		match: /\B#([^\s\n]*)?$/,
		search: function (term, callback) {
			var usernames;

			socket.emit('plugins.shopify.find', {query: term}, function(err, products) {
				callback(products);
			});
		},
		template: function(productObj) {
			return '<div class="shopify-textcomplete"><div class="img-container"><img src="' + productObj.image.src + '" /></div><span>' + productObj.title + '</span></div>';
		},
		index: 1,
		replace: function (productObj) {
			return '#' + utils.slugify(productObj.handle) + ' ';
		},
		cache: true
	}], {
		zIndex: 20000,
		listPosition: function(position) {
			this.$el.css(this._applyPlacement(position));
			this.$el.css('position', 'absolute');
			return this;
		}
	});
});
