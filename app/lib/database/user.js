
var ModelName = 'User/';

var postData = {
	token : SERVER_KEY,
	method : 'get',
	sortby : 'id',
	order : 'desc',
	offset : 0,
	max : 20,
	model : {
		id : 0,
	},
};

exports.login = function(_item, callback) {
	var retData = {};
	var url = SERVER_API + ModelName;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			//alert('Connection error : '+e.error);
			var retData = {
				error : e.error
			};
			if (callback)
				callback(retData);
			ready = true;
		},
		//Function to be called upon a successful response
		onload : function(e) {
			
			if (this.status == HTTP_OK) {
				var json = JSON.parse(this.responseText);
				Ti.API.debug(json);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				//if(!json.error) {
				// retData = {
				// token : json.token,
				// signature : json.signature,
				// params : json.model,
				// error : json.error,
				// };
				retData = json;
				//};
				
				if (callback)
					callback(retData);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	Ti.API.info("username: ", _item.username);
	Ti.API.info("passwordHash: ", _item.passwordHash);
	http.setRequestHeader('Content-Type', 'application/json');
	try {
		var postData = {
			method : 'login',
			model : {
				username : _item.username,
				passwordHash : _item.passwordHash,
				//expDate : EXPIRED_TIME,//.format("yyyy/MM/dd HH:mm:ss+00:00"),
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (var i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	Ti.API.info("DB getItem: ", retData);
	return retData;
};

exports.getObject = function(_gid, callback) {
	Ti.API.info("ItemID = " + _gid);
	var retData = {};
	var url = SERVER_API + ModelName + _gid;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : '+e.error);
			var retData = {
				error : e.error
			};
			if (callback)
				callback(retData);
			ready = true;
		},
		//Function to be called upon a successful response
		onload : function(e) {
			Ti.API.debug(this.status);
			if (this.status == HTTP_OK) {
				var json = JSON.parse(this.responseText);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = {
						title : json.model.title, //title,
						description : json.model.description, //description,
						total : json.model.total, //amount,
						projectdate : json.model.projectdate, //date,
						sentdate : json.model.sentdate,
						sent : json.model.sent,
						done : json.model.done,
						gid : json.model.id,
						error : json.error,
					};
				};
				if (callback)
					callback(retData);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	//http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'get',
			model : {
				id : _gid,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(postData);

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (var i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	Ti.API.info("DB getItem: ", retData);
	return retData;
};

exports.getList = function(_done, callback) {
	var retData = [];
	var url = SERVER_API + ModelName;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : '+e.error);
			var retData = {
				error : e.error
			};
			if (callback)
				callback(retData);
			ready = true;
		},
		//Function to be called upon a successful response
		onload : function(e) {
			Ti.API.debug(this.status);
			if (this.status == HTTP_OK) {
				var json = JSON.parse(this.responseText);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				for (var i = 0,
				    len = json.model.length; i < len; i++) {
					retData.push({
						title : json.model[i].title, //title,
						description : json.model[i].description, //description,
						total : json.model[i].total, //amount,
						projectdate : json.model[i].projectdate, //date,
						sentdate : json.model[i].sentdate,
						sent : json.model[i].sent,
						done : json.model[i].done,
						gid : json.model[i].id,
						error : json.error,
					});
				};
				//obj.tableView.setData(obj.getTableData(_done, retData));
				if (callback)
					callback(retData);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	//http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'get',
			order : 'desc',
			offset : 0,
			max : 20,
			model : {

			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(postData);

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (var i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	Ti.API.info("Cloud Selected Rows: ", retData.length);
	return retData;
};

exports.updateObject = function(_item, callback) {
	Ti.API.info("Item Desc = " + _item.description);
	var retData = {};
	var url = SERVER_API + ModelName;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : '+e.error);
			var retData = {
				error : e.error
			};
			if (callback)
				callback(retData);
			ready = true;
		},
		//Function to be called upon a successful response
		onload : function(e) {
			Ti.API.debug(this.status);
			if (this.status == HTTP_OK) {
				var json = JSON.parse(this.responseText);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (callback)
					callback(json);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	//http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'update',
			model : {
				id : _item.gid,
				title : _item.title, //title,
				description : _item.description, //description,
				projectdate : _item.projectdate, //date,
				sentdate : _item.sentdate,
				sent : _item.sent,
				done : _item.done,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(postData);

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (var i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};

exports.addObject = function(_item, callback) {
	var retData = {};
	var url = SERVER_API + ModelName;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : '+e.error);
			var retData = {
				error : e.error
			};
			if (callback)
				callback(retData);
			ready = true;
		},
		//Function to be called upon a successful response
		onload : function(e) {
			Ti.API.debug(this.status);
			if (this.status == HTTP_OK) {
				var json = JSON.parse(this.responseText);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (callback)
					callback(json);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type', 'application/json');
	try {
		var postData = {
			method : 'create',
			model : {
				//id : _item.gid,
				username : _item.username, //title,
				passwordHash : _item.passwordHash, //description,
				fullname : _item.fullname, //date,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (var i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};

exports.deleteDetailObject = function(_gid, callback) {
	Ti.API.info("ItemID = " + _gid);
	var retData = {};
	var url = SERVER_API + ModelName;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : '+e.error);
			var retData = {
				error : e.error
			};
			if (callback)
				callback(retData);
			ready = true;
		},
		//Function to be called upon a successful response
		onload : function(e) {
			Ti.API.debug(this.status);
			if (this.status == HTTP_OK) {
				var json = JSON.parse(this.responseText);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (callback)
					callback(json);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	//http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'delete',
			model : {
				id : _gid,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(postData);

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (var i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};
