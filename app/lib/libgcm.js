
var GOOGLE_API_KEY = "AIzaSyBHJpynkADdCcD3M_fznXB7VrmZ8uJQqxI"; //AIzaSyC6HlHOpSw7w6uwp68Kle0B3xhuexHTRdg //Browser API instead of Server API
var GCM_URL = "https://android.googleapis.com/gcm/";
var SENDER_ID = "876696965882"; //com-reimburseapp-repay
var HTTP_OK = 200;

exports.registerGCM = function(successCallback, foregroundCallback, backgroundCallback, pendingCallback) {
	var gcm = require('net.iamyellow.gcmjs');

	var pendingData = gcm.data;
	if (pendingData && pendingData !== null) {
		// if we're here is because user has clicked on the notification
		// and we set extras for the intent
		// and the app WAS NOT running
		// (don't worry, we'll see more of this later)
		var pendingDataStr = JSON.stringify(pendingData);
		Ti.API.info('******* data (started) ' +pendingDataStr );
		alert("Pending Data: "+pendingDataStr);
		if (pendingCallback) pendingCallback(pendingData);
	}

	gcm.registerForPushNotifications({
		success : function(ev) {
			// on successful registration
			Ti.API.info('******* success, ' + ev.deviceToken);
			if (successCallback) successCallback(ev);
		},
		error : function(ev) {
			// when an error occurs
			Ti.API.info('******* error, ' + ev.error);
		},
		callback : function(data) {
			// when a gcm notification is received WHEN the app IS IN FOREGROUND
			var dataStr = JSON.stringify(data);
			alert("Data: "+dataStr);
			if (foregroundCallback) foregroundCallback(data);
		},
		unregister : function(ev) {
			// on unregister
			Ti.API.info('******* unregister, ' + ev.deviceToken);
		},
		data : function(data) {
			// if we're here is because user has clicked on the notification
			// and we set extras in the intent
			// and the app WAS RUNNING (=> RESUMED)
			// (again don't worry, we'll see more of this later)
			var dataStr = JSON.stringify(data);
			Ti.API.info('******* data (resumed) ' + dataStr);
			alert("Background Data: "+dataStr);
			if (backgroundCallback) backgroundCallback(data);
		}
	}); 
};

exports.unregGCM = function(callback) {
	require('net.iamyellow.gcmjs').unregister();
};

exports.sendGCM = function(ids, msg, callback) {
	var retData = {};
	var url = GCM_URL + "send";
	var ready = false;
	var idsArray = ids;
	//var msgArray = msg;
	if (ids && !Array.isArray(idsArray)) idsArray = [ids];
	//if (msg && !Array.isArray(msgArray)) msgArray = [msg];
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : '+e.error);
			var retData = {
				error : (e.source.status > 0) ? e.source.status + " " + e.error : 'Connection Timed out'
			};
			if (callback)
				callback(retData);
			ready = true;
		},
		//Function to be called upon a successful response
		onload : function(e) {
			Ti.API.debug(this.status);
			if (this.status == HTTP_OK) {
				retData = {
					error : "Unknown Error"
				};
				var json = {};
				try {
					json = JSON.parse(this.responseText);
					retData = json;
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (callback)
					callback(retData);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen (default = True)
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Authorization','key='+GOOGLE_API_KEY);
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			data: msg, //msgArray,
			registration_ids: idsArray,
		};
		var dataStr = JSON.stringify(postData);
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(dataStr);

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
};
