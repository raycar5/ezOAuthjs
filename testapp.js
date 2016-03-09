var ezOAuthjs = require("./ezOAuth");
var express = require("express");
var app = express();
var config = require("./config");
var Sequelize = require('sequelize');


//Response function, takes in the data gathered by passport and returns an object to send to the mobile app 
function response(data){
	console.log("data: " + data);
	return "have some data";
}

// Initalize sequelize with session store , you can integrate whatever database you want that's why this function exists
function setStore(session){
	var SequelizeStore = require('connect-session-sequelize')(session.Store);
	var sequelize = new Sequelize('postgres://user:password@localhost:5432/ezoauth', {logging: false}); //Disabled sequelize logging for better debugging of the rest of the program
	app.use(session({
  		secret: 'SECRET',
  		store: new SequelizeStore({
    		db: sequelize,
    		checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds (15min).
  			expiration: 5 * 60 * 1000  // The maximum age (in milliseconds) of a valid session (5min).
  		})
	}));
	sequelize.sync();
}

var ops = {};
ops.store = setStore;

//Uncomment this if you want to authenticate the device
/*ops.deviceAuthenticator = function(deviceID){
	return deviceID == "hello";
};*/

ezOAuthjs.initialize(app,"ADRESS HERE", ops);

//initialize twitter
ezOAuthjs.twitter(config.twitterConsumerKey, config.twitterConsumerSecret, response);

//initialize an alternate twitter authentication with a different url
ezOAuthjs.twitter(config.twitterConsumerKey, config.twitterConsumerSecret, response,{path:"/difftwitter"});

//initialize facebook
ezOAuthjs.facebook(config.facebookAppID, config.facebookAppSecret, response);

//initialize google
////////////////////////////////////////////////////
//GOOGLE WON'T WORK WITH LOCAL ADRESSES BE CAREFUL//
////////////////////////////////////////////////////
ezOAuthjs.google(config.googleClientID, config.googleClientSecret, response);

//for testing purposes
//app.get("/",function(req, res){res.send("hi")});

startServer();

function startServer(){
	app.listen(5555, function () {
	  console.log("listening in port " + 5555);
	});
}