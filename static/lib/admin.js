'use strict';
/* globals $, app, socket */

define('admin/plugins/shopify', ['settings'], function(Settings) {

	var ACP = {};

	ACP.init = function() {
		Settings.load('shopify', $('.shopify-settings'), function() {
			$('#infoboxTpl').text($('[name=infoboxTpl]').val());
			var editor = ace.edit('infoboxTpl');
			editor.setTheme("ace/theme/twilight");
			editor.getSession().setMode("ace/mode/html");

			editor.on('change', function(e) {
				$('[name=infoboxTpl]').val(editor.getValue());
			});
		});

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