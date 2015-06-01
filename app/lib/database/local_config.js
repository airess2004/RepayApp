var DATABASE_NAME = "_alloy_"; //this.config.adapter.db_name
var table = "config";

exports.createDb = function() {
	//var db = Titanium.Database.install('repay.sqlite', DATABASE_NAME);
	
	//db.execute("DROP TABLE IF EXISTS "+table);

	//db.execute("CREATE TABLE IF NOT EXISTS "+table+" (username TEXT, key TEXT, val TEXT, lastUpdate DATETIME, dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (username, key), UNIQUE (username COLLATE NOCASE, key COLLATE NOCASE))");
	Alloy.Collections.config = Alloy.createCollection('config');
	//db.execute("CREATE TRIGGER IF NOT EXISTS "+table+"_update AFTER UPDATE ON "+table+" BEGIN update "+table+" SET lastUpdate = datetime('now') WHERE ROWID = NEW.ROWID; END;"); //updatedat = datetime('now')
	
	//db.close();
	return Alloy.Collections.config;
};

exports.dropTable = function() {
	//var db = Ti.Database.open(DATABASE_NAME);
	//db.execute("DROP TABLE IF EXISTS "+table);
	//db.close();
	//return db;
};

exports.getObject = function(_id, callback) {
	Ti.API.info("Get ItemID = " + _id);
	var retData = {};
	var db = Ti.Database.open(DATABASE_NAME);
	try {
		var rows = db.execute("select ROWID, * from "+table+" where ROWID = ?", _id);
		if (rows.isValidRow()) {
			retData = {
				username : rows.fieldByName('username'),
				key : rows.fieldByName('key'),
				val : rows.fieldByName('val'),
				lastUpdate : rows.fieldByName('lastUpdate'),
				id : rows.fieldByName('ROWID')
			};
		}
	} catch (e) {
		retData = {
			error : e.message //e[0];
		};
	}
	db.close();
	//Ti.API.info("DB getItem: ", retData);
	if (callback)
		callback(retData);
	return retData;
};

exports.getObjectByKey = function(key, callback) {
	Ti.API.info("Get ItemID = " + key);
	var retData = {};
	var db = Ti.Database.open(DATABASE_NAME);
	try {
		var rows = db.execute("select ROWID, * from "+table+" where key=? and username=?", key, CURRENT_USER);
		if (rows.isValidRow()) {
			retData = {
				username : rows.fieldByName('username'),
				key : rows.fieldByName('key'),
				val : rows.fieldByName('val'),
				lastUpdate : rows.fieldByName('lastUpdate'),
				id : rows.fieldByName('ROWID')
			};
		}
	} catch (e) {
		retData = {
			error : e.message //e[0];
		};
	}
	db.close();
	//Ti.API.info("DB getItem: ", retData);
	if (callback)
		callback(retData);
	return retData;
};

exports.findOrCreateObject = function(key, val, username, callback) {
	var retData = {};
	var list = Alloy.createCollection(table);
	list.fetch({remove:false});
	var obj = list.find(function(mdl){
		return mdl.get('key')==key && mdl.get('username')==(username || Alloy.Globals.CURRENT_USER);
	});
	if (!obj) {
		obj = Alloy.createModel(table, {key:key, val:val, username:username || Alloy.Globals.CURRENT_USER}); 
		list.add(obj, {merge:true});
		obj.save({key:key, val:val, username:username || Alloy.Globals.CURRENT_USER});
		obj.fetch({remove:false});
	}
	retData = obj.toJSON();
	if (callback)
		callback(retData);
	return retData;
};

exports.getList = function(sortBy, order, start, count, filterCol, filterOp, filterVal, callback) {
	var retData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	try {
		var filter = "";
		if (filterCol) {
			var val = filterVal;
			if (typeof filterVal == 'string') val = "'"+filterVal+"'"; else 
			if (typeof filterVal == 'boolean') val = filterVal?1:0;
			filter = " and "+filterCol+filterOp+val;
		}
		var rows = db.execute("select ROWID, * from "+table+" where username=? "+filter+" ORDER BY "+sortBy+" "+order+",ROWID "+order+" LIMIT "+count+" OFFSET "+start+";", CURRENT_USER);
		while (rows.isValidRow()) {
			retData.push({
				username : rows.fieldByName('username'),
				key : rows.fieldByName('key'),
				val : rows.fieldByName('val'),
				lastUpdate : rows.fieldByName('lastUpdate'),
				id : rows.fieldByName('ROWID')
			});
			rows.next();
		}
	} catch(e) {
		retData = {
			error : e.message //e[0]
		};
	}
	db.close();
	//Ti.API.info("DB getList Rows: ", retData.length);
	if (callback)
		callback(retData);
	return retData;
};

exports.updateObject = function(_item, callback) {
	var retData = {};
	Ti.API.info("Item Desc = " + _item.key);
	var mydb = Ti.Database.open(DATABASE_NAME);
	var keyvals = "";
	try {
		for (key in _item) {
			if (key!='id' && _item.hasOwnProperty(key)) {
				var val = _item[key];
				if (val !== undefined) {
					if ( typeof val == 'string') {
						keyvals += key + "='" + val + "',";
					} else if ( typeof val == 'boolean') {
						keyvals += key + "=" + val ? 1 : 0 + ",";
					} else {
						keyvals += key + "=" + val + ",";
					}
				}
			}
		}
		//keyvals = keyvals.substring(0, keyvals.length - 1);
		keyvals += "lastUpdate='"+moment().toISOString()+"'";
		mydb.execute("update "+table+" set " + keyvals + " where ROWID = ?;", _item.id);
		//mydb.execute('update reimburse set done = ? where ROWID = ?', _done, _id);
		//if (mydb.rowsAffected > 0) 
		{
			var rows = mydb.execute("select ROWID, * from "+table+" where ROWID = ?;", _item.id);
			//var rows = db.execute("select ROWID, * from reimburse ORDER BY ROWID DESC LIMIT 1;");
			if (rows.isValidRow()) {
				retData = {
					username : rows.fieldByName('username'),
					key : rows.fieldByName('key'),
					val : rows.fieldByName('val'),
					lastUpdate : rows.fieldByName('lastUpdate'),
					id : rows.fieldByName('ROWID')
				};
			} else retData = _item;
		}
	} catch(e) {
		retData.error = e.message; //e[0];
	}
	var affected = mydb.rowsAffected;
	Ti.API.info("updated affected = " + affected);
	//var rows = mydb.execute('select * from reimburse where done = ?', _done);
	mydb.close();
	if (callback)
		callback(retData);
	return retData;
};

exports.addObject = function(_item, callback) {
	var retData = {};
	Ti.API.info("Item Desc = " + _item.key);
	var mydb = Ti.Database.open(DATABASE_NAME);
	//mydb.execute('insert into reimburseit values (?,?)', _item, 0);
	var keys = "";
	var vals = "";
	try {
		for (key in _item) {
			if (key!='id' && _item.hasOwnProperty(key)) {
				var val = _item[key];
				if (val !== undefined) {
					if ( typeof val == 'string') {
						vals += "'" + val + "',";
					} else if ( typeof val == 'boolean') {
						vals += val ? 1 : 0 + ",";
					} else {
						vals += val + ",";
					}
					keys += key + ",";
				}
			}
		}
		keys += "username,lastUpdate";
		vals += "'"+CURRENT_USER+"','"+moment().toISOString()+"'";
		mydb.execute("insert into "+table+" (" + keys + ") values (" + vals + ");");
		//var lastID = mydb.execute('insert into reimburse (title, description, done, sent, sentdate) values (?,?,?,?,?); select last_insert_rowid();', _item.title, _item.description, false, false, _item.sentdate);
		//datetime(?,"localtime")
		if (mydb.rowsAffected > 0) {
			var rows = mydb.execute("select ROWID, * from "+table+" where ROWID = ?;", mydb.lastInsertRowId);
			//var rows = db.execute("select ROWID, * from reimburse ORDER BY ROWID DESC LIMIT 1;");
			if (rows.isValidRow()) {
				retData = {
					username : rows.fieldByName('username'),
					key : rows.fieldByName('key'),
					val : rows.fieldByName('val'),
					lastUpdate : rows.fieldByName('lastUpdate'),
					id : rows.fieldByName('ROWID')
				};
			}
		} else retData = _item;
	} catch(e) {
		retData.error = e.message; //e[0];
	}
	var affected = mydb.rowsAffected;
	_item.id = mydb.lastInsertRowId;
	// presumes `reimburseit` has an auto-increment column
	//Ti.API.info("lastID = " + lastID);
	Ti.API.info("insert affected = " + affected);
	mydb.close();
	if (callback)
		callback(retData, _item);
	return retData;
};

exports.addOrUpdateObject = function(_item, callback) {
	var retData = {};
	Ti.API.info("Item Desc = " + _item.key);
	var mydb = Ti.Database.open(DATABASE_NAME);
	//mydb.execute('insert into reimburseit values (?,?)', _item, 0);
	var keys = "";
	var vals = "";
	try {
		for (key in _item) {
			if (_item.hasOwnProperty(key)) {
				var val = _item[key];
				if (key == 'id') key = 'ROWID';
				if (val !== undefined) {
					if ( typeof val == 'string') {
						vals += "'" + val + "',";
					} else if ( typeof val == 'boolean') {
						vals += val ? 1 : 0 + ",";
					} else {
						vals += val + ",";
					}
					keys += key + ",";
				}
			}
		}
		keys += "username,lastUpdate";
		vals += "'"+CURRENT_USER+"','"+moment().toISOString()+"'";
		mydb.execute("insert or replace into "+table+" (" + keys + ") values (" + vals + ");");
		//var lastID = mydb.execute('insert into reimburse (title, description, done, sent, sentdate) values (?,?,?,?,?); select last_insert_rowid();', _item.title, _item.description, false, false, _item.sentdate);
		//datetime(?,"localtime")
		if (mydb.rowsAffected > 0) {
			var rowid = mydb.lastInsertRowId;
			if (rowid == null || rowid == 0) rowid = _item.id;
			var rows = mydb.execute("select ROWID, * from "+table+" where ROWID = ?;", rowid);
			//var rows = db.execute("select ROWID, * from reimburse ORDER BY ROWID DESC LIMIT 1;");
			if (rows.isValidRow()) {
				retData = {
					username : rows.fieldByName('username'),
					key : rows.fieldByName('key'),
					val : rows.fieldByName('val'),
					lastUpdate : rows.fieldByName('lastUpdate'),
					id : rows.fieldByName('ROWID')
				};
			}
		} else retData = _item;
	} catch(e) {
		retData.error = e.message; //e[0];
	}
	var affected = mydb.rowsAffected;
	_item.id = mydb.lastInsertRowId;
	// presumes `reimburseit` has an auto-increment column
	//Ti.API.info("lastID = " + lastID);
	Ti.API.info("insert affected = " + affected);
	mydb.close();
	if (callback)
		callback(retData, _item);
	return retData;
};

exports.createOrUpdateObject = function(key, val, username, callback) {
	var retData = {};
	var list = Alloy.createCollection(table);
	list.fetch({remove:false});
	var obj = list.find(function(mdl){
		return mdl.get('key')==key && mdl.get('username')==(username || Alloy.Globals.CURRENT_USER);
	});
	if (!obj) {
		obj = Alloy.createModel(table, {key:key, val:val, username:username || Alloy.Globals.CURRENT_USER});
		list.add(obj, {merge:true});
	}
	obj.save({key:key, val:val, username:username || Alloy.Globals.CURRENT_USER});
	obj.fetch({remove:false});
	retData = obj.toJSON();
	return retData;
};

exports.deleteObject = function(_id, callback) {
	var retData = {};
	Ti.API.info("Delete ItemID = " + _id);
	var mydb = Ti.Database.open(DATABASE_NAME);
	try {
		mydb.execute("delete from "+table+" where ROWID = ?", _id);
	} catch(e) {
		retData.error = e.message; //e[0];
	}
	var affected = mydb.rowsAffected;
	Ti.API.info("deleted affected = " + affected);
	mydb.close();
	if (callback)
		callback(retData);
	return retData;
};

