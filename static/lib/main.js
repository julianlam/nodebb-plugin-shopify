$(window).on('action:composer.loaded', function(e, data) {
	var composer = $('#cmp-uuid-' + data.post_uuid + ' .write');

	composer.textcomplete([{
		match: /\B#([^\s\n]*)?$/,
		search: function (term, callback) {
			var usernames;

			socket.emit('plugins.shopify.find', {query: term}, function(err, products) {
				callback(products.map(function(productObj) {
					return productObj.title;
				}));
			});
		},
		index: 1,
		replace: function (product) {
			return '#' + utils.slugify(product) + ' ';
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
