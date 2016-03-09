var passport;
var serverURL
var app;
var path;
var pathEnd = "/twitter";
exports.init = function(context, consumerKey, consumerSecret, responseFunction, ops){
	//Configure passport twitter strategy
	serverURL = context.serverURL;
	passport = context.passport;
	app = context.app;
	path = context.path;
	if (ops != null && ops.path != null) {pathEnd = ops.path};
	var TwitterStrategy = require('passport-twitter').Strategy;
	passport.use(new TwitterStrategy({
	    consumerKey: consumerKey,
	    consumerSecret: consumerSecret,
	    callbackURL: serverURL + path + pathEnd + "/callback"
	  	},
	  	function(token, tokenSecret, profile, done) {
	  		//Pass passport response as a single object
	      done(null, {token: token, tokenSecret: tokenSecret, profile: profile});
	    })
	);
	if(!context.authenticateDevice){
		//Doesn't have device identifier
		app.get(path + pathEnd,context.middleware.metadata(), passport.authenticate('twitter'));
		app.get(path + pathEnd + '/callback', passport.authenticate('twitter'), context.middleware.respond(responseFunction));
	}else{
		//Has device identifier
		app.get(path + pathEnd, context.middleware.authenticateDevice(), context.middleware.metadata(), passport.authenticate('twitter'));	
		app.get(path + pathEnd + '/callback', passport.authenticate('twitter'), context.middleware.respond(responseFunction));
	}	
};