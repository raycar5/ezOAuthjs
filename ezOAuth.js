//Dependencies
var express = require("express");
var passport = require("passport");
var session = require("express-session");


passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});

//Global variables
var path = "/ezoauth";
var app;
//Initialization
exports.initialize = function(inapp,ops){
	//Set app
	app = inapp;
	//Initialize session required by passport
	app.use(session({ secret: 'SECRET' }));
	//Initialize passport
	app.use(passport.initialize());
	//If no options provided stop here
	if (ops==null){return;}
	//Change default path
	path = ops.path;
}
//Returns context object for the different strategies
function getContext(){
	return {
		path: path,
		app: app
	};
}
exports.getPath = function(){
	return path;
}

//Add twitter authentication method
exports.twitter = function(serverURL, consumerKey, consumerSecret, responseFunction, ops){
	var twitter = require("./strategies/twitter");
	twitter.init(getContext(),serverURL, consumerKey, consumerSecret, responseFunction, ops);
}