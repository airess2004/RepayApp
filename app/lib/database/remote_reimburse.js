var ModelName = 'reimburses/';

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

exports.getAssList = function(sortBy, order, start, count, filterCol, filterOp, filterVal, callback) {
    var retData = [];
    var retDetailData = [];
    var url = SERVER_API + "reimburse_associations/";
    var ready = false;
    var http = Ti.Network.createHTTPClient({
        timeout: 5000,
        onerror: function(e) {
            Ti.API.debug(e.error);
            retData = {
                error: e.source.status > 0 ? e.error : "Connection Timed out"
            };
            callback && callback(retData, retDetailData);
            ready = true;
        },
        onload: function() {
            Ti.API.debug(this.status);
            if (this.status == HTTP_OK) {
                retData = {
                    error: "Unknown Error"
                };
                var json = {};
                try {
                    json = JSON.parse(this.responseText);                   
					if (json.success) {
						retData = [];
						for ( i = 0,
						len = json.reimburse_associations.length; len > i; i++) {
							var obj = json.reimburse_associations[i];
							retData.push({
								username : Alloy.Globals.CURRENT_USER,
								gid : obj.id,
								source_userId : obj.user_id,
								source_userAvatar : obj.user_mini_avatar_url,
								source_userAvatarOri : obj.user_original_avatar_url,
								reimburse_gid : obj.reimburse_id,
								reimburse_title : obj.reimburse_title,
								reimburse_description : obj.reimburse_description,
								reimburse_total : parseFloat(obj.reimburse_total) || 0,
								reimburse_application_date : obj.reimburse_application_date,
								reimburse_is_submitted : (obj.reimburse_is_submitted == "true" || obj.reimburse_is_submitted == "1") ? 1 : 0,
								reimburse_submitted_at : obj.reimburse_submitted_at,
								reimburse_is_confirmed : (obj.reimburse_is_confirmed == "true" || obj.reimburse_is_confirmed == "1") ? 1 : 0,
								reimburse_confirmed_at : obj.reimburse_confirmed_at,
								reimburse_total_approved : parseFloat(obj.reimburse_total_approved) || 0,
								reimburseDetail_count: obj.reimburse_details.length,
								isSync : 1
							});
							for ( j = 0,
							len2 = obj.reimburse_details.length; len2 > j; j++) {
								var obj2 = obj.reimburse_details[j];
								retDetailData.push({
									gid : obj2.id,
									reimburseGid : obj2.reimburse_id,
									name : obj2.title,
									description : obj2.description,
									receiptDate : obj2.transaction_datetime,
									amount : parseFloat(obj2.amount),
									urlImageSmall : obj2.receipt_mini_url,
									urlImageOriginal : obj2.receipt_original_url,
									isRejected : (obj2.is_rejected == "true" || obj2.is_rejected == "1") ? 1 : 0,
									totalComments : parseInt(obj2.total_comment) || 0,
								});
							}
						};
					} else {
						retData = {
							error : errors2string(json.message.errors)
						};
					}
                } catch (ex) {
                    retData = {
                        error: ex.message
                    };
                }
                
                callback && callback(retData, retDetailData);
            }
            ready = true;
        }
    });
    http.open("GET", url + "?auth_token=" + SERVER_KEY, false);
    http.setRequestHeader("Content-Type", "application/json");
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
        http.send(/*jsonstr*/);
    } catch (e) {
        Ti.API.info("HTTPClient Exception");
        for (i in e.prototype) Ti.API.info(i + ":" + e[i]);
    }
    Ti.API.info("Cloud Selected Rows: ", retData.length);
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
					if (json.success) {
						retData = [];
						for ( i = 0,
						len = json.reimburses.length; i < len; i++) {
							var obj = json.reimburses[i];
							var obj2 = {
								username : Alloy.Globals.CURRENT_USER,
								title : obj.title, //title,
								description : obj.description, //description,
								total : parseFloat(obj.total_approved) || 0, //amount,
								projectDate : obj.application_date, //date,
								gid : obj.id,
								//idx : obj.idx ? json.model[i].idx : 0,
								first_receipt_mini_url : obj.first_receipt_mini_url,
								first_receipt_original_url : obj.first_receipt_original_url,
								sentDate : obj.submitted_at,
								doneDate : obj.confirmed_at,
								isDone : (obj.is_confirmed == "true" || obj.is_confirmed == "1") ? 1 : 0,
								isSent : (obj.is_submitted == "true" || obj.is_submitted == "1") ? 1 : 0,
								isDeleted : 0, //obj.isDeleted ? 1 : 0,
								dateCreated : obj.created_at, //moment.parseZone(obj.created_at).utc().toISOString(),
								lastUpdate : moment.parseZone(obj.updated_at).utc().toISOString(),
								isSync : 1,
							};
							obj2.status = obj2.isDone ? STATUSCODE[Const.Closed] : obj2.isSent ? STATUSCODE[Const.Pending] : STATUSCODE[Const.Open];
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
	http.open('GET', url + "?auth_token="+SERVER_KEY, false);
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
						retData = {
							username : Alloy.Globals.CURRENT_USER,
							userId : json.reimburse.user_id,
							title : json.reimburse.title, //title,
							description : json.reimburse.description, //description,
							total : parseFloat(json.reimburse.total_approved) || 0, //amount,
							projectDate : json.reimburse.application_date, //date,
							gid : json.reimburse.id || orgItem.gid,
							//idx : json.reimburses[0].idx ? json.reimburses[0].idx : 0,
							//first_receipt_mini_url : json.reimburse.first_receipt_mini_url,
							//first_receipt_original_url : json.reimburse.first_receipt_original_url,
							isDone : (json.reimburse.is_confirmed == "true" || json.reimburse.is_confirmed == "1") ? 1 : 0,
							doneDate : json.reimburse.confirmed_at,
							isSent : (json.reimburse.is_submitted == "true" || json.reimburse.is_submitted == "1") ? 1 : 0,
							sentDate : json.reimburse.submitted_at,
							sendTo : json.reimburse.destination_email,
							isDeleted : 0, //json.reimburses[0].isDeleted ? 1:0,
							dateCreated : json.reimburse.created_at,
							lastUpdate : moment.parseZone(json.reimburse.updated_at).utc().toISOString(),
							isSync : 1,
						};
						retData.status = retData.isDone ? STATUSCODE[Const.Closed] : retData.isSent ? STATUSCODE[Const.Pending] : STATUSCODE[Const.Open];
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
	http.open('PUT', url + "/" + _item.gid + "?auth_token="+SERVER_KEY, false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			reimburse : {
				//id : _item.gid,
				title : _item.title, //title,
				description : _item.description, //description,
				application_date : _item.projectDate, //date,
				//sentDate : null, //_item.sentDate,
				// total : _item.total ? _item.total : 0,
				// idx : 0,
				// isSent : false, //_item.isSent,
				// isDone : false, //_item.isDone,
				// isDeleted : false, //_item.isDeleted,
				// dateCreated : _item.dateCreated,
				// lastUpdate : _item.lastUpdate,
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
					retData = orgItem;//json					
					if (json.success) {
						retData = {
							username : Alloy.Globals.CURRENT_USER,
							userId : json.reimburse.user_id,
							title : json.reimburse.title, //title,
							description : json.reimburse.description, //description,
							total : parseFloat(json.reimburse.total) || 0, //amount,
							projectDate : json.reimburse.application_date, //date,
							gid : json.reimburse.id,
							//idx : json.reimburses[0].idx ? json.reimburses[0].idx : 0,
							//first_receipt_mini_url : json.reimburse.first_receipt_mini_url,
							//first_receipt_original_url : json.reimburse.first_receipt_original_url,
							isDone : (json.reimburse.is_confirmed == "true" || json.reimburse.is_confirmed == "1") ? 1 : 0,
							doneDate : json.reimburse.confirmed_at,
							isSent : (json.reimburse.is_submitted == "true" || json.reimburse.is_submitted == "1") ? 1 : 0,
							sentDate : json.reimburse.submitted_at,
							sendTo : json.reimburse.destination_email,
							isDeleted : 0, //json.reimburses[0].isDeleted ? 1:0,
							dateCreated : json.reimburse.created_at,
							lastUpdate : moment.parseZone(json.reimburse.updated_at).utc().toISOString(),
							isSync : 1,
						};
						retData.status = retData.isDone ? STATUSCODE[Const.Closed] : retData.isSent ? STATUSCODE[Const.Pending] : STATUSCODE[Const.Open];
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
			reimburse : {
				//id : _item.gid,
				title : _item.title, //title,
				description : _item.description, //description,
				application_date : _item.projectDate, //date,
				//sentDate : null, //_item.sentDate,
				// total : _item.total ? _item.total : 0,
				// idx : 0,
				// isSent : false, //_item.isSent,
				// isDone : false, //_item.isDone,
				// isDeleted : false, //_item.isDeleted,
				created_at : _item.dateCreated,
				updated_at : _item.lastUpdate,
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
						// title : json.model.title, //title,
						// description : json.model.description, //description,
						// total : json.model.total, //amount,
						// projectDate : json.model.projectDate, //date,
						// sentDate : json.model.sentDate,
						// gid : json.model.id,
						// idx : json.model.idx ? json.model.idx : 0,
						// isDone : json.model.isDone ? 1:0,
						// isSent : json.model.isSent ? 1:0,
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
			// token : SERVER_KEY,
			// method : 'delete',
			// model : {
				// id : _gid,
				// dateDeleted : moment().toISOString(),
				// //isDeleted : true,
			// },
		// };
		// // Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		// var jsonstr = JSON.stringify(postData);
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
					retData = json;					
					if (json.success) {
						var obj = json.reimburse;
						retData = {
							title : obj.title, //title,
							description : obj.description, //description,
							//total : parseFloat(obj.total_approved) || 0, //amount,
							projectDate : obj.application_date, //date,
							gid : obj.id || _gid,
							//idx : json.model.idx ? json.model.idx : 0,
							//first_receipt_mini_url : json.first_receipt_mini_url,
							//first_receipt_original_url : json.first_receipt_original_url,
							isDone : (obj.is_confirmed == "true" || obj.is_confirmed == "1") ? 1 : 0,
							doneDate : obj.confirmed_at,
							isSent : (obj.is_submitted == "true" || obj.is_submitted == "1") ? 1 : 0,
							sentDate : obj.submitted_at,
							sentTo : tolist ? tolist[0] : null,
							//isDeleted : 0,
							//dateCreated : json.model.dateCreated,
							lastUpdate : obj.updated_at,
							isSync : 1,
						};
						retData.status = retData.isDone ? STATUSCODE[Const.Closed] : retData.isSent ? STATUSCODE[Const.Pending] : STATUSCODE[Const.Open];
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
	http.open('PUT', url + _gid + "?auth_token="+SERVER_KEY+"&submit=true", false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			//to : tolist,
			//cc : cclist,
			//bcc : bcclist,
			destination_email: tolist ? tolist[0] : null,
			submitted_at: moment().utc().toISOString(),
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		var jsonstr = JSON.stringify(postData);
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

exports.confirmObject = function(_gid, rejectedlist, callback) {
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
					retData = json;				
					if (json.success) {
						var obj = json.reimburse;
						retData = {
							title : obj.title, //title,
							description : obj.description, //description,
							//total : parseFloat(obj.total_approved) || 0, //amount,
							projectDate : obj.application_date, //date,
							gid : obj.id || _gid,
							//idx : json.model.idx ? json.model.idx : 0,
							//first_receipt_mini_url : json.first_receipt_mini_url,
							//first_receipt_original_url : json.first_receipt_original_url,
							isDone : (obj.is_confirmed == "true" || obj.is_confirmed == "1") ? 1 : 0,
							doneDate : obj.confirmed_at,
							isSent : (obj.is_submitted == "true" || obj.is_submitted == "1") ? 1 : 0,
							sentDate : obj.submitted_at,
							//sentTo : tolist ? tolist[0] : null,
							//isDeleted : 0,
							//dateCreated : json.model.dateCreated,
							lastUpdate : obj.updated_at,
							isSync : 1,
						};
						retData.status = retData.isDone ? STATUSCODE[Const.Closed] : retData.isSent ? STATUSCODE[Const.Pending] : STATUSCODE[Const.Open];
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
	http.open('PUT', url + _gid + "?auth_token="+SERVER_KEY+"&confirm=true", false);
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	http.setRequestHeader('Content-Type','application/json');
	try {
		var postData = {
			//to : tolist,
			//cc : cclist,
			//bcc : bcclist,
			//destination_email: tolist ? tolist[0] : null,
			reimburse: {
				confirmed_at: moment().utc().toISOString(),
				rejected_id_list: rejectedlist,
			},
		};
		// Send the request, put object/string content to be sent as parameter (ie. on POST/PUT)
		var jsonstr = JSON.stringify(postData);
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
