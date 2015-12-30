var main = require('../library'),

	Sockets = {};

Sockets.find = function(socket, data, callback) {
	main.find(data.query, callback);
};

module.exports = Sockets;