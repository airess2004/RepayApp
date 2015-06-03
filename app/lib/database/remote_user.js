
var ModelName = "app_users/";

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
	var url = SERVER_API + "users/sign_in";
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
				try {				
					var json = JSON.parse(this.responseText);
					Ti.API.debug(json);
					//this.responseData / this.responseXML
					//retData = json;
					//convert array/model as necessary
					if (!json.message) {
						retData = {
							token : json.auth_token,
							signature : json.signature,
							params : json.params,
							error : json.message,
							fullname : json.email,
							role : json.role,
							original_avatar_url : json.original_avatar_url,
							mini_avatar_url : json.mini_avatar_url,
						};
					};
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
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
				user_login: {
					email: _item.username,
					password : _item.passwordHash,
				},
				deviceToken: _item.deviceToken,
				//expDate : EXPIRED_TIME,//.format("yyyy/MM/dd HH:mm:ss+00:00"),
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
	var orgItem = _item;
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
				retData = {
					error : "Unknown Error"
				};
				var json = {};
				try {
					json = JSON.parse(this.responseText);
					retData = orgItem;
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				var json = JSON.parse(this.responseText);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.success) {
					retData = {
						gid : json.user.id,
						email: json.user.email,
						username: json.user.username,
						original_avatar_url: json.user.original_avatar_url,
						mini_avatar_url: json.user.mini_avatar_url,
						device_id: json.user.device_id,
						role_id: json.user.role_id,
						fullname: json.user.name,
						login: json.user.login,
						is_main_user: json.user.is_main_user ? 1:0,
						authentication_token: json.user.authentication_token,
						isDeleted : json.user.isDeleted ? 1:0,
						dateCreated : json.user.created_at,
						lastUpdated : moment.parseZone(json.user.updated_at).utc().toISOString(),
						isSync : 1,
					};
					if (_item.id) retData.id = _item.id;
				} else {
					retData.error = json.message ? errors2string(json.message.errors) : "Record not found!";
				} 
				if (callback)
					callback(retData, orgItem);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('PUT', url + "/0"+"?auth_token="+SERVER_KEY, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			user : {
				//id : _item.gid,
				email : _item.email, //title,
				username : _item.username, //description,
				name : _item.fullname, //date,
				original_avatar_url : _item.original_avatar_url,
				mini_avatar_url : _item.mini_avatar_url,
				device_id : _item.device_id,
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

exports.addObject = function(_item, callback) {
	var orgItem = _item;
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
				retData = {
					error : "Unknown Error"
				};
				var json = {};
				try {
					json = JSON.parse(this.responseText);
					retData = orgItem;					
					if (json.success) {
						retData = {
							gid : json.user.id,
							email : json.user.email,
							username : json.user.username,
							original_avatar_url : json.user.original_avatar_url,
							mini_avatar_url : json.user.mini_avatar_url,
							device_id : json.user.device_id,
							role_id : json.user.role_id,
							fullname : json.user.name,
							login : json.user.login,
							is_main_user : json.user.is_main_user ? 1 : 0,
							authentication_token : json.user.authentication_token,
							isDeleted : json.user.isDeleted ? 1 : 0,
							dateCreated : json.user.created_at,
							lastUpdated : moment.parseZone(json.user.updated_at).utc().toISOString(),
							isSync : 1,
						};
						if (_item.id)
							retData.id = _item.id;
					} else {
						retData.error = json.message ? errors2string(json.message.errors) : "Record not found!";
					} 
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				var json = JSON.parse(this.responseText);
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (callback)
					callback(retData, orgItem);
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
			user : {
				email : _item.email, //title,
				password : _item.password, //description,
				password_confirmation : _item.password2,
				name : _item.fullname, //date,
				deviceToken: Alloy.Globals.gcmRegId,
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

exports.deleteObject = function(_gid, callback) {
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

exports.logout = function(callback) {
	//Ti.API.info("ItemID = " + _gid);
	var retData = {};
	var url = SERVER_API + "users/sign_out";
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
				try {
					var json = JSON.parse(this.responseText);
					//this.responseData / this.responseXML
					//convert array/model as necessary
					if (!json.success) json.error = json.message ? errors2string(json.message.errors) : "";
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				if (callback)
					callback(json);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('GET', url+ "?auth_token="+SERVER_KEY, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		// var postData = {
			// model : {
				// id : _gid,
			// },
		// };
		//var jsonstr = postData;
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send();

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (var i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};