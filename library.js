"use strict";

var controllers = require('./lib/controllers'),
	async = module.parent.require('async'),
	winston = module.parent.require('winston'),
	request = module.parent.require('request'),

	meta = module.parent.require('./meta'),

	plugin = {
		ready: false,
		products: []
	};

plugin.init = function(params, callback) {
	var router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;
		
	// We create two routes for every view. One API call, and the actual route itself.
	// Just add the buildHeader middleware to your route and NodeBB will take care of everything for you.

	router.get('/admin/plugins/shopify', hostMiddleware.admin.buildHeader, controllers.renderAdminPage);
	router.get('/api/admin/plugins/shopify', controllers.renderAdminPage);

	async.series([
		async.apply(plugin.updateSettings),
		async.apply(plugin.updateProducts)
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
			if (res.statusCode === 200) {
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
	});
};

module.exports = plugin;