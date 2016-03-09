var passport;
var serverURL
var app;
var path;
var pathEnd = "/google";
exports.init = function(context, appID, appSecret, responseFunction, ops){
	//Configure passport google strategy
	serverURL = context.serverURL;
	passport = context.passport;
	app = context.app;
	path = context.path;
	if (ops != null && ops.path != null) {pathEnd = ops.path};
	var GoogleStrategy = require('passport-google-oauth20').Strategy;
	passport.use(new GoogleStrategy({
	    clientID: appID,
	    clientSecret: appSecret,
	    callbackURL: serverURL + path + pathEnd + "/callback"
	  	},
	  	function(accessToken, refreshToken, profile, done) {
	  		//Pass passport response as a single object
	      return done(null, {accessToken: accessToken, refreshToken: refreshToken, profile: profile});
	    })
	);
	if(!context.authenticateDevice){
		//Doesn't have device identifier
		app.get(path + pathEnd,context.middleware.metadata(), passport.authenticate('google', { scope: ['profile'] }));
		app.get(path + pathEnd + '/callback', passport.authenticate('google'), context.middleware.respond(responseFunction));
	}else{
		//Has device identifier
		app.get(path + pathEnd, context.middleware.authenticateDevice(), context.middleware.metadata(), passport.authenticate('google', { scope: ['profile'] }));	
		app.get(path + pathEnd + '/callback', passport.authenticate('google'), context.middleware.respond(responseFunction));
	}	
};