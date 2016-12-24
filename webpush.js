var webPush = require('web-push');
var fs = require('fs');

var opt = require('./webpush.config.json');
webPush.setGCMAPIKey(opt.GCMAPIKey);
var files = fs.readFileSync('db.txt').toString().split(' ');
var endpoint = files[0];
var key = files[1];
var authSecret = files[2];

const pushSubscription = {
	endpoint: endpoint,
	keys:{
		p256dh: key,
		auth: authSecret
	}
}

const options = {
	TTL: 5000
}
module.exports = {
	pushPayload : function(req){
		webPush.sendNotification(pushSubscription, JSON.stringify({title: req.body.payload}), options);
	},
	
	pushOne : function(submission){
		console.log("pushone");
		webPush.sendNotification(pushSubscription, JSON.stringify(submission), options);
	},
	
	pushMany : function(submissions){
		console.log("pushMany");
		webPush.sendNotification(pushSubscription, JSON.stringify(submissions), options).then(function(){
			console.log("Then send notif");
		}).catch(function(){
			console.log("Catch send notif");
		});
	},
}