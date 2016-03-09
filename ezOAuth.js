//Dependencies
var passport = require("passport");
var session = require("express-session");


//Serialize functions for passport
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

//Global variables
var serverURL
var path = "/ezoauth";
var app;
var deviceAuthenticator;

//Middleware
var middleware = {};
//Response
middleware.respond = function(responseFunction){
	return function(req,res){
		//Respond based on the function provided and the response
		var sentData = req.session.passport.user;
		sentData.ezDeviceID = req.session.ezDeviceID;
		sentData.ezMetaData = req.session.ezMetaData
		var response = responseFunction(sentData);
		if (typeof(response) != "object"){
			res.json({data:response});
			console.log("It is recommendable to make your ezOAuth response an object");
		}else{
			res.json(response);
		}
	}
}

//Metadata
middleware.metadata = function(){
	return function(req, res, next){
		req.session.ezMetaData = req.headers.ezmetadata;
		next();
	}
}

//DeviceAuthenticator
middleware.authenticateDevice = function(){
	return function(req, res, next){
		if (deviceAuthenticator(req.headers.ezdeviceid)){
			req.session.ezDeviceID = req.headers.ezdeviceid;
			next();
		}else{
			res.end();
		}
	}
}

//Initialization
exports.initialize = function(inApp,inServerURL,ops){
	//Set globals
	serverURL = inServerURL;
	app = inApp;
	if (ops.path != null){path = ops.path;}
	if (ops.deviceAuthenticator != null){deviceAuthenticator = ops.deviceAuthenticator;}
	//Change session store
	if (ops.store !==null){ops.store(session);}
	else{app.use(session({ secret: 'SECRET' }));} //if not specified it defaults to memory store, NOT FOR PRODUCTION
	//Initialize passport
	app.use(passport.initialize());	
}

//Returns context object for the different strategies
function getContext(){
	return {
		passport: passport,
		serverURL: serverURL,
		path: path,
		app: app,
		authenticateDevice: !(deviceAuthenticator == null),
		middleware: middleware
	}
}
//Returns the current set path
exports.getPath = function(){
	return path;
}

//Add twitter authentication method
exports.twitter = function(serverURL, consumerKey, consumerSecret, responseFunction, ops){
	var twitter = require("./strategies/twitter");
	twitter.init(getContext(),serverURL, consumerKey, consumerSecret, responseFunction, ops);
}
//Add facebook authentication method
exports.facebook = function(serverURL, appID, appSecret, responseFunction, ops){
	var twitter = require("./strategies/facebook");
	twitter.init(getContext(),serverURL, appID, appSecret, responseFunction, ops);
}
//Add google authentication method
exports.google = function(serverURL, appID, appSecret, responseFunction, ops){
	var twitter = require("./strategies/google");
	twitter.init(getContext(),serverURL, appID, appSecret, responseFunction, ops);
}