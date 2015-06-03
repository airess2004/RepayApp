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

