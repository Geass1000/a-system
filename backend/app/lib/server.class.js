'use strict';

let express = require('express');
let bodyParser = require('body-parser');
let logger = require('morgan');
let methodOverride = require('method-override');
let errorhandler = require('errorhandler');
let cors = require('cors');

let config = require('../config/app.config');

let router = require('../routers/server.router');

/**
 * The server.
 *
 * @class Server
 */
class Server {
	/**
	 * Bootstrap the server.
	 *
	 * @class Server
	 * @method bootstrap
	 * @static
	 * @return {Server}  Return object server
	 */
	static bootstrapServer () {
		return new Server();
	}

	/**
	 * Constructor.
	 *
	 * @class Server
	 * @constructor
	 */
	constructor () {
		this.model = {};

		this.app = express();

		this.setConfig();

		this.setRoutes();

		this.startServer();
	}


	/**
	 * Configure server.
	 *
	 * @class Server
	 * @method setConfig
	 */
	setConfig () {
		console.log('Configuring server...');
		if (config.env === 'development')
			this.app.use(logger('dev'));

		// Parse body request to a json
		this.app.use(bodyParser.json());
		//this.app.use(bodyParser.urlencoded({ extended: true }));

		// Get default methods put and delete
		this.app.use(methodOverride());

		// Use CORS technology
		this.app.use(cors());

		// Create connect to a database
		require('../config/mongodb.database');
	}

	/**
	 * Setting routes.
	 *
	 * @class Server
	 * @method setRoutes
	 */
	setRoutes () {
		console.log('Setting routes...');

		this.app.use('/', router);
	}

	/**
	 * Start server.
	 *
	 * @class Server
	 * @method startServer
	 */
	startServer () {
		this.app.use(function(err, req, res, next) {
			if (err.name === 'StatusError') res.send(err.status, err.message);
			else next(err);
		});

		if (config.env === 'development')
			this.app.use(errorhandler());

		console.log('Starting server...');
		this.app.listen(config.express.port, function (err) {
			console.log(`listening in http://localhost:${config.express.port}`);
		});
	}
}

module.exports = Server;
