"use strict";

var controllers = require('./lib/controllers'),
	async = module.parent.require('async'),
	winston = module.parent.require('winston'),
	request = module.parent.require('request'),
	templates = module.parent.require('templates.js'),

	meta = module.parent.require('./meta'),
	utils = module.parent.require('../public/src/utils'),

	plugin = {
		ready: false,
		products: [],
		lookup: {},
		matchRegex: /#[\w\-_]+/g
	},
	_app;

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers,
		SocketPlugins = require.main.require('./src/socket.io/plugins');
		
	_app = params.app;
	SocketPlugins.shopify = require('./lib/websockets');

	router.get('/admin/plugins/shopify', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/shopify', controllers.renderAdminPage);

	async.series([
		async.apply(plugin.updateSettings),
		async.apply(plugin.updateProducts),
		async.apply(plugin.buildLookupTable)
	]);

	callback();
};

plugin.addAdminNavigation = function(header, callback) {
	header.plugins.push({
		route: '/plugins/shopify',
		icon: 'fa-shopping-cart',
		name: 'Shopify'
	});

	callback(null, header);
};

plugin.updateSettings = function(callback) {
	meta.settings.get('shopify', function(err, settings) {
		plugin.settings = settings;
		plugin.ready = ['key', 'password', 'shopname'].every(function(key) {
			return settings.hasOwnProperty(key) && settings[key] && settings[key].length;
		});
		plugin.baseUrl = 'https://' + plugin.settings.shopname + '.myshopify.com/admin';

		callback(err);
	});
};

plugin.updateProducts = function(callback) {
	if (!plugin.ready) {
		return callback();
	}

	// Call Shopify, get products, shove into local variable
	var finished = false,
		page = 1;
	async.doWhilst(function(next) {
		winston.verbose('[shopify] Retrieving products page ' + page + '...');
		request({
			url: '/products.json',
			qs: {
				limit: 250,
				page: page
			},
			baseUrl: plugin.baseUrl,
			auth: {
				user: plugin.settings.key,
				password: plugin.settings.password
			},
			json: true
		}, function(err, res, body) {
			if (!err && res.statusCode === 200) {
				plugin.products = plugin.products.concat(body.products);
				finished = body.products.length < 250;
				page++;
			} else {
				winston.warn('[shopify] Could not retrieve list of products!');
				finished = true;
			}

			next();
		});
	}, function() {
		return !finished;
	}, function() {
		winston.info('[shopify] Product retrieval complete, curating ' + plugin.products.length + ' products');
		callback();
	});
};

plugin.buildLookupTable = function(callback) {
	// For each product, grab the title, slugify it, and add to lookup table
	winston.verbose('[shopify] Building lookup table...');
	plugin.products.forEach(function(productObj) {
		plugin.lookup[productObj.handle] = productObj;
	});

	winston.verbose('[shopify] Lookup table built.');
	callback();
};

plugin.parsePost = function(data, callback) {
	if (!data || !data.postData || !data.postData.content) {
		return callback(null, data);
	}

	plugin.parseRaw(data.postData.content, function(err, content) {
		if (err) {
			return callback(err);
		}

		data.postData.content = content;
		callback(null, data);
	});
};

plugin.parseRaw = function(content, callback) {
	var matches = content.match(plugin.matchRegex);

	if (!matches) {
		return callback(null, content);
	}

	var products = matches.filter(function(match, idx, arr) {
		return idx === arr.indexOf(match);
	}).map(function(match) {
		return plugin.lookup[match.slice(1)];
	}).filter(Boolean);

	_app.render('partials/shopify/infoboxes', {
		productUrlPrefix: plugin.settings.productUrlPrefix,
		vendorUrlPrefix: plugin.settings.vendorUrlPrefix,
		typeUrlPrefix: plugin.settings.typeUrlPrefix,
		matches: products
	}, function(err, html) {
		// Replace the # with the product name
		content = content.replace(plugin.matchRegex, function(match) {
			if (plugin.lookup.hasOwnProperty(match.slice(1))) {
				return plugin.lookup[match.slice(1)].title;
			} else {
				return match;
			}
		});

		content += html;

		callback(null, content);
	});

	// async.eachSeries(matches, function(match, next) {
	// 	var slug = match.slice(1);
	// 	if (plugin.lookup.hasOwnProperty(slug)) {
	// 		templates.parse('<div class="shopify-infobox">' + plugin.settings.infoboxTpl + '</div>', plugin.lookup[slug], function(html) {
	// 			// if (!err) {
	// 				content = content.replace(match, html);
	// 			// }

	// 			return next();
	// 		});
	// 	} else {
	// 		return next();
	// 	}
	// }, function(err) {
	// 	return callback(null, content);
	// });
};

plugin.find = function(query, callback) {
	callback(null, Object.keys(plugin.lookup)
		.filter(function(slug) {
			return slug.indexOf(query) !== -1;
		})
		.sort(function(a, b) {
			// Float matches where matched text is nearer the beginning to the top
			return a.indexOf(query) > b.indexOf(query) ? 1 : -1;
		})
		.map(function(slug) {
			return plugin.lookup[slug];
		}));
}

module.exports = plugin;