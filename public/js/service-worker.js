'use-strict';
const notifCenterAction = "openNotifCenter";
const redditAction = "openReddit";
const urlAction = "openUrl";
self.addEventListener('push', function(event){
	console.log("push in service-worker");
	var data = event.data ? event.data.text() : "no payload";
	
	var tag = 'redditNotif'
	var obj = JSON.parse(data);
	var options = {};
	options.icon = "../images/icon-192x192.png";
	options.tag = tag;
	
	if(Array.isArray(obj)){
		options.body = "Many interesting reddit threads";
		options.data = obj;
		options.actions = [
			{action: notifCenterAction, title: "Open notification center"}]
	}
	else{
		options.body = obj.title;
		options.data = obj;
		options.actions = [
		{action: redditAction, title: "Open reddit link"},
		{action: urlAction, title: "Open url"}];
	}
	
	event.waitUntil(
		self.registration.showNotification('Reddit notif', options)
	);
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('notificationclick', function(event){
  var data = event.notification.data;
  var url;
  event.notification.close();
  console.log(event.action);
  if(event.action === notifCenterAction){
	 url = "../" 
  }
  else if(event.action === redditAction){
	  url = "https://reddit.com/" + data.permalink;
	  fetch('./updateSeen',{
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			submissionId : data.id
		}),
	});
  }
  else if(event.action === urlAction){
	  url = data.url;
	  fetch('./updateSeen',{
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			submissionId : data.id
		}),
	});
  }
  else{
	  return;
  }
  
  
  event.waitUntil(
	clients.openWindow(url)
  );
})
