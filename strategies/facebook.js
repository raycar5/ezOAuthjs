var passport;
var serverURL
var app;
var path;
var pathEnd = "/facebook";
exports.init = function(context, appID, appSecret, responseFunction, ops){
	//Configure passport facebook strategy
	serverURL = context.serverURL;
	passport = context.passport;
	app = context.app;
	path = context.path;
	if (ops != null && ops.path != null) {pathEnd = ops.path};
	var FacebookStrategy = require('passport-facebook').Strategy;
	passport.use(new FacebookStrategy({
	    clientID: appID,
	    clientSecret: appSecret,
	    callbackURL: serverURL + path + pathEnd + "/callback"
	  	},
	  	function(accessToken, refreshToken, profile, done) {
	  		//Pass passport response as a single object
	      done(null, {accessToken: accessToken, refreshToken: refreshToken, profile: profile});
	    })
	);
	if(!context.authenticateDevice){
		//Doesn't have device identifier
		app.get(path + pathEnd,context.middleware.metadata(), passport.authenticate('facebook'));
		app.get(path + pathEnd + '/callback', passport.authenticate('facebook'), context.middleware.respond(responseFunction));
	}else{
		//Has device identifier
		app.get(path + pathEnd, context.middleware.authenticateDevice(), context.middleware.metadata(), passport.authenticate('facebook'));	
		app.get(path + pathEnd + '/callback', passport.authenticate('facebook'), context.middleware.respond(responseFunction));
	}	
};