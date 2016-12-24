'use-strict';

const snoowrap = require('snoowrap');
const options = require('./reddit-credentials.json');

var allMap = allMap || new Map();

const r = new snoowrap(options);

function filterAnimeTopHour(post){
	if(post.score < 10) return false;
	var title = post.title.toLowerCase();
	
	if(title.indexOf('disc') === -1 || title.indexOf('spoilers') === -1) return false;
	if(allMap.has(post.id)) return false;
	
	allMap.set(post.id, post);
	return true;
}

function filterMangaTopHour(post){
	if(post.score < 5) return false;
	var title = post.title.toLowerCase();
	
	if(title.indexOf('disc') === -1) return false;
	if(allMap.has(post.id)) return false;
	allMap.set(post.id, post);
	return true;
}

function purgeMap(){
	var retMap = {}
	var mapIter = allMap.keys();
	var key;
	while((key = mapIter.next().value) !== undefined){
		var val = allMap.get(key);
		if(val.seen){
			if(new Date().getTime() - val.created_utc > 3600 * 1000){
				allMap.delete(key);
			}
			continue;
		}
		else{
			var sub = {};
			sub.title = val.title;
			sub.url = val.url;
			sub.permalink = val.permalink;
			sub.id = val.id;
			retMap[key] = sub;
		}
	}
	return retMap;
}
module.exports = {

	getTopAnime : function() {
		var topAnime = r.getSubreddit('anime').getTop({time: "hour"}).filter(filterAnimeTopHour);
		return topAnime;
	},

	getTopManga : function() {
		var topManga = r.getSubreddit('manga').getTop({time: "hour"}).filter(filterMangaTopHour);
		return topManga;
	},
	
	getTopAll : function(){
		var p1 = this.getTopAnime();
		var p2 = this.getTopManga();
		return Promise.all([p1,p2]);
	},
	
	getMap : function(){
		var retMap = purgeMap();
		return retMap;
	},
	
	updateSeen: function(id){
		var sub = allMap.get(id);
		sub.upvote();
		sub.seen = true;
	},
	/*
	markAllSeen: function(){
		var mapIter = allMap.keys();
		var key;
		while((key = mapIter.next().value) !== undefined){
			var val = allMap.get(key);
			val.seen = true;
		}
	}*/
}

