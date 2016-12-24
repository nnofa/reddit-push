'use-strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var wp = require('./webpush.js');
var reddit = require('./reddit.js');
var fs = require('fs');

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

function pushNewSubmission(){
	reddit.getTopAll().then(function(values){
		var submissions = values[0].concat(values[1]);
		for(var i = 0; i < submissions.length; i++){
			var submission = submissions[i];
			var temp = {};
			temp.title = submission.title;
			temp.url = submission.url;
			temp.permalink = submission.permalink;
			submissions[i] = temp; //only put title and url to push;
		}
		if(submissions.length === 1){
			wp.pushOne(submissions[0]);
		}
		else if(submissions.length > 1){
			wp.pushMany(submissions);
		}
	}).catch(function(){
		console.log("Fail!!");
	});
}

app.post('/register', function(req,res){
	console.log("register is called");
	fs.writeFileSync('db.txt', req.body.endpoint + " " + req.body.key + " " + req.body.authSecret + " ");
	res.sendStatus(201);	
});

app.get('/', function(req,res){
	var subMap = reddit.getMap();
	res.render("index.pug", {subMap: subMap, name: "nnofa"})
});

app.post('/updateSeen', function(req,res){
	reddit.updateSeen(req.body.submissionId);
	res.sendStatus(201);
});

app.post('/markAllSeen', function(req, res){
	reddit.markAllSeen();
	res.sendStatus(201);
});
	
app.listen(3000, function(){
	console.log("example app on port 3000");
});

pushNewSubmission();
setInterval(pushNewSubmission, 60000);