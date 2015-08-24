'use strict';

module.exports = {
	app: {
		title: 'MEAN.JS',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'mongodb, express, angularjs, node.js, mongoose, passport'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	// The secret should be set to a non-guessable string that
	// is used to compute a session hash
	sessionSecret: 'MEAN',
	// The name of the MongoDB collection to store sessions in
	sessionCollection: 'sessions',
	// The session cookie settings
	sessionCookie: { 
		path: '/',
		httpOnly: true,
		// If secure is set to true then it will cause the cookie to be set
		// only when SSL-enabled (HTTPS) is used, and otherwise it won't
		// set a cookie. 'true' is recommended yet it requires the above
		// mentioned pre-requisite.
		secure: false,
		// Only set the maxAge to null if the cookie shouldn't be expired
		// at all. The cookie will expunge when the browser is closed.
		maxAge: null,
		// To set the cookie in a specific domain uncomment the following 
		// setting:
		// domain: 'yourdomain.com'
	},
	// The session cookie name
	sessionName: 'connect.sid',
	log: {
		// Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		// Stream defaults to process.stdout
		// Uncomment to enable logging to a log on the file system
		options: {
			stream: 'access.log'
		}
	},
	assets: {
		lib: {
			css: [
				'public/stylesheets/main.css'
			],
			js: [
				'public/vendor/angular/angular.js',
    		'public/vendor/angular-animate/angular-animate.js',
    		'public/vendor/angular-cookies/angular-cookies.js',
    		'public/vendor/angular-resource/angular-resource.js',
    		'public/vendor/angular-route/angular-route.js',
    		'public/vendor/angular-sanitize/angular-sanitize.js',
    		'public/vendor/angular-touch/angular-touch.js',
				'public/vendor/ui-bootstrap-tpls-0.12.0.js',
				'public/vendor/ng-notifications-bar/src/ngNotificationsBar.js'
			]
		},
		css: [
			'public/stylesheets/main.css'
		],
		js: [
			'public/scripts/app.module.js',
			'public/scripts/app.config.js',
			'public/scripts/*/*.js'
		],
		tests: [
			'public/vendor/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};