'use strict';

var Controllers = {};

Controllers.renderAdminPage = function (req, res, next) {
	res.render('admin/plugins/shopify', {
		ready: module.parent.exports.ready,
		numProducts: module.parent.exports.products.length
	});
};

module.exports = Controllers;