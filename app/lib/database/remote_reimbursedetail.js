var ModelName = 'reimburse_details/';

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

exports.getDetailObject = function(_gid, callback) {
	Ti.API.info("ItemDetailID = " + _gid);
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
						name : json.model.name, //title,
						description : json.model.description, //description,
						amount : json.model.amount, //amount,
						receiptDate : json.model.receiptDate, //date,
						urlImageOriginal : json.model.urlImageOriginal, //pic
						urlImageMedium : json.model.urlImageMedium,
						urlImageSmall : json.model.urlImageSmall,
						gid : json.model.id,
						reimburse_gid : json.model.reimburse.id, //reimburseId,
						isDeleted : json.model.isDeleted ? 1:0,
						dateCreated : json.model.dateCreated,
						lastUpdate : json.model.lastUpdate,
						isSync : 1,
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
	Ti.API.info("DB getDetailItem: ", retData);
	return retData;
};

exports.getDetailList = function(_parentid, sortBy, order, start, count, filterCol, filterOp, filterVal, callback) {
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
					if (json.success) {
						retData = [];
						for ( i = 0,
						len = json.reimburse_details.length; i < len; i++) {
							var obj = json.reimburse_details[i];
							var obj2 = {
								name : obj.title,
								description : obj.description, //description,
								amount : parseFloat(obj.amount) || 0, //amount,
								receiptDate : obj.transaction_datetime, //date,
								urlImageOriginal : obj.receipt_original_url, //pic
								//urlImageMedium : obj.urlImageMedium,
								urlImageSmall : obj.receipt_mini_url,
								gid : obj.id,
								username : Alloy.Globals.CURRENT_USER,
								reimburseGid : obj.reimburse_id, //reimburseId,
								isDeleted : 0, //obj.isDeleted ? 1:0,
								isRejected : (obj.is_rejected == "true" || obj.is_rejected == "1") ? 1 : 0,
								//dateCreated : obj.created_at,
								lastUpdate : moment.parseZone(obj.updated_at).utc().toISOString(),
								isSync : 1,
							};
							obj2.status = obj2.isRejected ? DETAILSTATUSCODE[Const.Rejected] : DETAILSTATUSCODE[Const.Open];
							retData.push(obj2);
						};
					} else {
						retData = {
							error : errors2string(json.message.errors)
						};
					}
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary	
				//obj.tableView.setData(obj.getTableData(_done, retData));
				if (callback)
					callback(retData);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('GET', url + "?auth_token="+SERVER_KEY+"&reimburse_id="+_parentid, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
            sortBy: sortBy,
            order: order,
            page: start,
            limit: count,
            filter: {},
        };
        if (filterCol) {
            postData.filter.col = filterCol;
            postData.filter.op = filterOp;
            postData.filter.val = filterVal;
        }
		var jsonstr = JSON.stringify(postData);
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send();

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

exports.updateDetailObject = function(_item, callback) {
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
					retData = orgItem;					
					if (json.success) {
						var obj = json.reimburse_detail;
						retData = {
							name : obj.title,
							description : obj.description, //description,
							amount : parseFloat(obj.amount) || 0, //amount,
							receiptDate : obj.transaction_datetime, //date,
							urlImageOriginal : obj.receipt_original_url, //pic
							//urlImageMedium : obj.urlImageMedium,
							urlImageSmall : obj.receipt_mini_url,
							gid : obj.id || orgItem.gid,
							username : Alloy.Globals.CURRENT_USER,
							reimburseGid : obj.reimburse_id, //reimburseId,
							isDeleted : 0, //obj.isDeleted ? 1:0,
							isRejected : (obj.is_rejected == "true" || obj.is_rejected == "1") ? 1 : 0,
							dateCreated : obj.created_at,
							lastUpdate : moment.parseZone(obj.updated_at).utc().toISOString(),
							isSync : 1,
						};
						retData.status = retData.isRejected ? DETAILSTATUSCODE[Const.Rejected] : DETAILSTATUSCODE[Const.Open];
						if (orgItem.id)
							retData.id = orgItem.id;
					} else {
						retData.error = json.message ? errors2string(json.message.errors) : "Record not found!";
					} 
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

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('PUT', url + "/" + _item.gid + "?auth_token="+SERVER_KEY, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			reimburse_detail : {
				//id : _item.gid,
				reimburse_id : _item.reimburseGid,
				title : _item.name, //title,
				description : _item.description, //description,
				amount : _item.amount?_item.amount:0, //amount,
				transaction_datetime : _item.receiptDate, //date,
				receipt_original_url : _item.urlImageOriginal, //pic
				//urlImageMedium : _item.urlImageMedium,
				receipt_mini_url : _item.urlImageSmall,
				created_at : _item.dateCreated,
				updated_at : _item.lastUpdate,
				//isDeleted : false,
			},
		};
		var jsonstr = JSON.stringify(postData);
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

exports.addDetailObject = function(_item, callback) {
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
					retData = orgItem;					
					if (json.success) {
						var obj = json.reimburse_detail;
						retData = {
							name : obj.title,
							description : obj.description, //description,
							amount : parseFloat(obj.amount) || 0, //amount,
							receiptDate : obj.transaction_datetime, //date,
							urlImageOriginal : obj.receipt_original_url, //pic
							//urlImageMedium : obj.urlImageMedium,
							urlImageSmall : obj.receipt_mini_url,
							gid : obj.id,
							username : Alloy.Globals.CURRENT_USER,
							reimburseGid : obj.reimburse_id, //reimburseId,
							isDeleted : 0, //obj.isDeleted ? 1:0,
							isRejected : (obj.is_rejected == "true" || obj.is_rejected == "1") ? 1 : 0,
							dateCreated : obj.created_at,
							lastUpdate : moment.parseZone(obj.updated_at).utc().toISOString(),
							isSync : 1,
						};
						retData.status = retData.isRejected ? DETAILSTATUSCODE[Const.Rejected] : DETAILSTATUSCODE[Const.Open];
						if (orgItem.id)
							retData.id = orgItem.id;
					} else {
						retData.error = json.message ? errors2string(json.message.errors) : "Record not found!";
					}
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary 
				if (callback)
					callback(retData, orgItem);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('POST', url + "?auth_token="+SERVER_KEY, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			reimburse_detail : {
				//id : _item.gid,
				reimburse_id : _item.reimburseGid,
				title : _item.name, //title,
				description : _item.description, //description,
				amount : _item.amount?_item.amount:0, //amount,
				transaction_datetime : _item.receiptDate, //date,
				receipt_original_url : _item.urlImageOriginal, //pic
				//urlImageMedium : _item.urlImageMedium,
				receipt_mini_url : _item.urlImageSmall,
				created_at : _item.dateCreated,
				updated_at : _item.lastUpdate,
				//isDeleted : false,
			},
		};
		var jsonstr = JSON.stringify(postData);
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

exports.deleteDetailObject = function(_gid, callback) {
	Ti.API.info("ItemDetailID = " + _gid);
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
					if (!json.success) {
						retData.message = json.message;
						retData.error = json.message ? "Can't delete submitted record!" : "Record not found!";
					} else {
						retData = {};
					}
				} catch(ex) {
					retData = {
						error : ex.message
					};
				}
				//this.responseData / this.responseXML
				//convert array/model as necessary
				// if (json.model) {
					// retData = {
						// name : json.model.name, //title,
						// description : json.model.description, //description,
						// amount : json.model.amount, //amount,
						// receiptDate : json.model.receiptDate, //date,
						// urlImageOriginal : json.model.urlImageOriginal, //pic
						// urlImageMedium : json.model.urlImageMedium,
						// urlImageSmall : json.model.urlImageSmall,
						// gid : json.model.id,
						// reimburse_gid : json.model.reimburse.id, //reimburseId,
						// isDeleted : json.model.isDeleted ? 1:0,
						// dateCreated : json.model.dateCreated,
						// lastUpdate : json.model.lastUpdate,
						// isSync : 1,
					// };
				// };
				if (callback)
					callback(retData);
			}
			ready = true;
		},
	});

	// Prepare the connection, Async param/option Only used on iOS, Mobile Web and Tizen
	http.open('DELETE', url + _gid + "?auth_token="+SERVER_KEY, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		// var postData = {
			// model : {
				// id : _gid,
				// dateDeleted : moment().toISOString(),
				// //isDeleted : true,
			// },
		// };
		//var jsonstr = JSON.stringify(postData);
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		http.send();

		//while (/*http.status == 0 || http.statusText == null*/http.readyState != stateDONE) {;}
	} catch(e) {
		Ti.API.info("HTTPClient Exception");
		for (i in e.prototype) {
			Ti.API.info(i + ":" + e[i]);
		}
	}
	return (true);
};
