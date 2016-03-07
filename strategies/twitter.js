var express = require("express");
var passport = require("passport");
var session = require("express-session");
var app;
var path;
exports.init = function(context,serverURL, consumerKey, consumerSecret, responseFunction, ops){
	//Configure passport twitter strategy
	var app = context.app;
	var path = context.path;
	var TwitterStrategy = require('passport-twitter').Strategy;
	passport.use(new TwitterStrategy({
	    consumerKey: consumerKey,
	    consumerSecret: consumerSecret,
	    callbackURL: serverURL + path + "/twitter/callback"
	  	},
	  	function(token, tokenSecret, profile, done) {
	  		//Pass passport response as a single object
	      done(null, {token: token, tokenSecret: tokenSecret, profile: profile});
	    })
	);
	if(ops == null || !ops.deviceIdentifier){
		//Doesn't have device identifier
		context.app.get(path + "/twitter", passport.authenticate('twitter'));
		app.get(path + '/twitter/callback', passport.authenticate('twitter'),function(req,res){
			//Respond based on the function provided
			res.send(responseFunction(req.session.passport.user));
		});
	}else{
		//Has device identifier
		app.get(path + "/twitter/:id",function(req, res, next){
			if (ops.deviceAuthenticator(req.params.id)){
				next();
			}else{
				res.end();
			}
		}, passport.authenticate('twitter'));	
	}	
};