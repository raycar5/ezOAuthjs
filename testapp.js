var ezOAuthjs = require("./ezOAuth");
var express = require("express");
var app = express();
var config = require("./config");

//Response function, takes in the data gathered by passport and returns an object to send to the mobile app 
function response(data){
	console.log("token: " + data.token);
	console.log("secret: " + data.tokenSecret);
	console.log("profile: " + data.profile);
	return {data: "here is some return data"};
}

ezOAuthjs.initialize(app);

ezOAuthjs.twitter("http://localhost:5555", config.consumerKey, config.consumerSecret, response);

startServer();

function startServer(){
	app.listen(5555, function () {
	  console.log("listening in port " + 5555);
	});
}