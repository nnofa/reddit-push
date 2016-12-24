var endpoint;
var key;
var authSecret;

navigator.serviceWorker.register('/js/service-worker.js')
.then(function(registration){
	console.log("in registration");
	document.getElementById('updateBtn').onclick= function(){
		registration.update();
	}
	return registration.pushManager.getSubscription()
	.then(function(subscription){
		if(subscription){
			return subscription;
		}
		
		return registration.pushManager.subscribe({userVisibleOnly:true});
	});
}).then(function(subscription){
	console.log("in subscription");
	var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
	key = rawKey ?
		btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) : '';
	
	var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
	authSecret = rawAuthSecret ?
				btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) : '';
	
	endpoint = subscription.endpoint;
	fetch('./register',{
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			endpoint: subscription.endpoint,
			key:key,
			authSecret: authSecret,
		}),
	});
}).catch(function(){
	console.log("We fucking lost");
});

function hideLink(id){
	var clickedLink = document.getElementById(id);
	clickedLink.parentElement.style.display = "none";
	fetch('./updateSeen',{
		method: 'post',
		headers: {
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			submissionId : id
		}),
	});
}

function markAllSeen(){
	fetch('./markAllSeen',{
		method: 'post'
	});
}