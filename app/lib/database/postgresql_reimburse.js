var ModelName = 'reimburse/';

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
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = {
						title : json.model.title, //title,
						description : json.model.description, //description,
						total : json.model.total, //amount,
						projectDate : json.model.projectDate, //date,
						sentDate : json.model.sentDate,
						gid : json.model.id,
						idx : json.model.idx ? json.model.idx : 0,
						isDone : json.model.isDone ? 1:0,
						isSent : json.model.isSent ? 1:0,
						isDeleted : json.model.isDeleted ? 1:0,
						dateCreated : json.model.dateCreated,
						lastUpdate : json.model.lastUpdate,
						isSynced : 1,
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
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'get',
			model : {
				id : _gid,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	Ti.API.info("DB getItem: ", retData);
	return retData;
};

exports.getList = function(sortBy, order, start, count, filterCol, filterOp, filterVal, callback) {
	var retData = [];
	var url = SERVER_API + ModelName;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary	
				if (json.model) {
					retData = [];
					for ( i = 0,
					len = json.model.length; i < len; i++) {
						retData.push({
							title : json.model[i].title, //title,
							description : json.model[i].description, //description,
							total : json.model[i].total, //amount,
							projectDate : json.model[i].projectDate, //date,
							sentDate : json.model[i].sentDate,
							gid : json.model[i].id,
							idx : json.model[i].idx ? json.model[i].idx : 0,
							isDone : json.model[i].isDone ? 1 : 0,
							isSent : json.model[i].isSent ? 1 : 0,
							isDeleted : json.model[i].isDeleted ? 1 : 0,
							dateCreated : json.model[i].dateCreated,
							lastUpdate : json.model[i].lastUpdate,
							isSynced : 1,
						});
					};
				}
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
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'get',
			sortBy : sortBy,
			order : order,
			offset : start,
			max : count,
			filter : {},
			model : {

			},
		};
		if (filterCol) {
			postData.filter.col = filterCol;
			postData.filter.op = filterOp;
			postData.filter.val = filterVal;
		}
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	Ti.API.info("Cloud Selected Rows: ", retData.length);
	return retData;
};

exports.getListFrom = function(fromDate, sortBy, order, start, count, callback) {
	var retData = [];
	var url = SERVER_API + ModelName;
	var ready = false;
	//function to use HTTP to connect to a web server and transfer the data.
	var http = Ti.Network.createHTTPClient({
		timeout : 5000,
		// Function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = [];
					for ( i = 0,
					len = json.model.length; i < len; i++) {
						retData.push({
							title : json.model[i].title, //title,
							description : json.model[i].description, //description,
							total : json.model[i].total, //amount,
							projectDate : json.model[i].projectDate, //date,
							sentDate : json.model[i].sentDate,
							gid : json.model[i].id,
							idx : json.model[i].idx ? json.model[i].idx : 0,
							isDone : json.model[i].isDone ? 1 : 0,
							isSent : json.model[i].isSent ? 1 : 0,
							isDeleted : json.model[i].isDeleted ? 1 : 0,
							dateCreated : json.model[i].dateCreated,
							lastUpdate : json.model[i].lastUpdate,
							isSynced : 1,
						});
					};
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
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'getFrom',
			sortBy : sortBy,
			order : order,
			offset : start,
			max : count,
			filter : {},
			model : {
				dateCreated : fromDate,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
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
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = {
						title : json.model.title, //title,
						description : json.model.description, //description,
						total : json.model.total, //amount,
						projectDate : json.model.projectDate, //date,
						sentDate : json.model.sentDate,
						gid : json.model.id,
						idx : json.model.idx ? json.model.idx : 0,
						isDone : json.model.isDone ? 1:0,
						isSent : json.model.isSent ? 1:0,
						isDeleted : json.model.isDeleted ? 1:0,
						dateCreated : json.model.dateCreated,
						lastUpdate : json.model.lastUpdate,
						isSynced : 1,
					};
					if (_item.id) retData.id = _item.id;
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
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'update',
			model : {
				id : _item.gid,
				idx : _item.idx ? _item.idx : 0,
				title : _item.title, //title,
				description : _item.description, //description,
				projectDate : _item.projectDate, //date,
				sentDate : _item.sentDate,
				isSent : _item.isSent == 1 ? true:false,
				isDone : _item.isDone == 1 ? true:false,
				isDeleted : _item.isDeleted == 1 ? true:false,
				lastUpdate : _item.lastUpdate,
				total : _item.total?_item.total:0,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
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
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
			};
			if (callback)
				callback(retData, orgItem);
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = {
						title : json.model.title, //title,
						description : json.model.description, //description,
						total : json.model.total, //amount,
						projectDate : json.model.projectDate, //date,
						sentDate : json.model.sentDate,
						gid : json.model.id,
						idx : json.model.idx ? json.model.idx : 0,
						isDone : json.model.isDone ? 1:0,
						isSent : json.model.isSent ? 1:0,
						isDeleted : json.model.isDeleted ? 1:0,
						dateCreated : json.model.dateCreated,
						lastUpdate : json.model.lastUpdate,
						isSynced : 1,
					};
					if (_item.id) retData.id = _item.id;
				};
				if (callback)
					callback(retData, orgItem);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'create',
			model : {
				//id : _item.gid,
				title : _item.title, //title,
				description : _item.description, //description,
				projectDate : _item.projectDate, //date,
				//sentDate : null, //_item.sentDate,
				total : _item.total ? _item.total : 0,
				idx : 0,
				isSent : false, //_item.isSent,
				isDone : false, //_item.isDone,
				isDeleted : false, //_item.isDeleted,
				dateCreated : _item.dateCreated,
				lastUpdate : _item.lastUpdate,
			},
		};
		var jsonstr = JSON.stringify(postData);
		//alert(jsonstr);
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(jsonstr);

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};

exports.AddOrUpdateObject = function(_item, callback) {
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
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = {
						title : json.model.title, //title,
						description : json.model.description, //description,
						total : json.model.total, //amount,
						projectDate : json.model.projectDate, //date,
						sentDate : json.model.sentDate,
						gid : json.model.id,
						idx : json.model.idx ? json.model.idx : 0,
						isDone : json.model.isDone ? 1:0,
						isSent : json.model.isSent ? 1:0,
						isDeleted : json.model.isDeleted ? 1:0,
						dateCreated : json.model.dateCreated,
						lastUpdate : json.model.lastUpdate,
						isSynced : 1,
					};
					if (_item.id) retData.id = _item.id;
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
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'addUpdate',
			model : {
				id : _item.gid ? _item.gid : 0,
				idx : _item.idx ? _item.idx : 0,
				title : _item.title ? _item.title : "", //title,
				description : _item.description ? _item.description : "", //description,
				projectDate : _item.projectDate ? _item.projectDate : null, //date,
				sentDate : _item.sentDate ? _item.sentDate : null,
				isSent : _item.isSent == 1 ? true:false,
				isDone : _item.isDone == 1 ? true:false,
				isDeleted : _item.isDeleted == 1 ? true:false,
				lastUpdate : _item.lastUpdate ? _item.lastUpdate : null,
				total : _item.total?_item.total:0,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};

exports.softDeleteObject = function(_gid, callback) {
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
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = {
						title : json.model.title, //title,
						description : json.model.description, //description,
						total : json.model.total, //amount,
						projectDate : json.model.projectDate, //date,
						sentDate : json.model.sentDate,
						gid : json.model.id,
						idx : json.model.idx ? json.model.idx : 0,
						isDone : json.model.isDone ? 1:0,
						isSent : json.model.isSent ? 1:0,
						isDeleted : json.model.isDeleted ? 1:0,
						dateCreated : json.model.dateCreated,
						lastUpdate : json.model.lastUpdate,
						isSynced : 1,
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
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'delete',
			model : {
				id : _gid,
				dateDeleted : moment().toISOString(),
				//isDeleted : true,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};


exports.sendObject = function(_gid, tolist, cclist, bcclist, callback) {
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
			//alert('Connection error : ' + e.error);
			retData = {
				error : (e.source.status > 0) ? e.error : 'Connection Timed out'
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
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				if (json.model) {
					retData = {
						title : json.model.title, //title,
						description : json.model.description, //description,
						total : json.model.total, //amount,
						projectDate : json.model.projectDate, //date,
						sentDate : json.model.sentDate,
						gid : json.model.id,
						idx : json.model.idx ? json.model.idx : 0,
						isDone : json.model.isDone ? 1:0,
						isSent : json.model.isSent ? 1:0,
						isDeleted : json.model.isDeleted ? 1:0,
						dateCreated : json.model.dateCreated,
						lastUpdate : json.model.lastUpdate,
						isSynced : 1,
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
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			token : SERVER_KEY,
			method : 'send',
			model : {
				id : _gid,
				sentDate : moment().toISOString(),
				//isSent : true,
			},
			to : tolist,
			cc : cclist,
			bcc : bcclist,
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send(JSON.stringify(postData));

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};
