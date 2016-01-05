'use strict';
/* globals $, app, socket */

define('admin/plugins/shopify', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('shopify', $('.shopify-settings'));

		$('#save').on('click', function() {
			Settings.save('shopify', $('.shopify-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'shopify-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});	
	};

	return ACP;
});