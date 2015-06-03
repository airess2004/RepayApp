var DATABASE_NAME = "_alloy_"; //this.config.adapter.db_name
var table = "reimburseDetail";

exports.createDb = function() {
	//var db = Titanium.Database.install('repay.sqlite', DATABASE_NAME);
	//var db = Ti.Database.open(DATABASE_NAME);

	//db.execute("DROP TABLE IF EXISTS "+table);

	//db.execute("CREATE TABLE IF NOT EXISTS "+table+" (gid INTEGER, reimburse_gid INTEGER, name TEXT, description TEXT, lastError TEXT, amount DOUBLE, urlImageOri TEXT, urlImageMedium TEXT, urlImageSmall TEXT, isDeleted BOOLEAN, isSynced BOOLEAN, receiptDate DATETIME, dateDeleted DATETIME, lastUpdate DATETIME, dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP, reimburse_id INTEGER, FOREIGN KEY (reimburse_id) REFERENCES reimburse(id) ON DELETE CASCADE);");
	Alloy.Collections.reimburseDetail = Alloy.createCollection('reimburseDetail');
	//db.execute("CREATE TRIGGER "+table+"_update AFTER UPDATE ON "+table+" BEGIN update "+table+" SET updatedat = datetime('now') WHERE ROWID = NEW.ROWID; END;"); //updatedat = datetime('now')
	
	return Alloy.Collections.reimburseDetail; //db
};

exports.dropTable = function() {
	//var db = Ti.Database.open(DATABASE_NAME);
	//db.execute("DROP TABLE IF EXISTS "+table);
	//db.close();
	//return db;
};

exports.getDetailObjectByGID = function(_gid, callback) {
	Ti.API.info("ItemDetailID = " + _gid);
	var retData = {};
	var db = Ti.Database.open(DATABASE_NAME);
	try {
		var rows = db.execute("select ROWID, * from "+table+" where gid = ?", _gid);
		if (rows.isValidRow()) {
			retData = {
				name : rows.fieldByName('name'),
				description : rows.fieldByName('description'),
				amount : rows.fieldByName('amount'),
				receiptDate : rows.fieldByName('receiptDate'),
				urlImageOriginal : rows.fieldByName('urlImageOri'),
				urlImageMedium : rows.fieldByName('urlImageMedium'),
				urlImageSmall : rows.fieldByName('urlImageSmall'),
				isSynced : rows.fieldByName('isSynced'),
				isDeleted : rows.fieldByName('isDeleted'),
				lastUpdate : rows.fieldByName('lastUpdate'),
				reimburse_gid : rows.fieldByName('reimburse_gid'),
				gid : _gid, //rows.fieldByName('gid'),
				reimburse_id : rows.fieldByName('reimburse_id'),
				id : rows.fieldByName('ROWID')
			};
		}
	} catch(e) {
		retData.error = e.message; //e[0];
	}
	db.close();
	Ti.API.info("DB getDetailItem: ", retData);
	if (callback)
		callback(retData);
	return retData;
};

exports.getDetailList = function(_parentid, sortBy, order, start, count, filterCol, filterOp, filterVal, callback) {
	var retData = [];
	var db = Alloy.createCollection(table);
	try {
		var filter = "";
		if (filterCol) {
			var val = filterVal;
			if (typeof filterVal == 'string') val = "'"+filterVal+"'"; else 
			if (typeof filterVal == 'boolean') val = filterVal?1:0;
			filter = " and "+filterCol+filterOp+val;
		}
		var parfilter = _parentid ? " and reimburseId="+_parentid : "";
		db.fetch({remove:false, query:"select * from "+table+" where username='"+Alloy.Globals.CURRENT_USER+"' and isDeleted=0 "+ parfilter +filter+" ORDER BY "+sortBy+" "+order+" LIMIT "+count+" OFFSET "+start*count+";"});
		retData = db.toJSON();
		// for (i = 0, len = rows.length; len > i; i++) {
			// var obj = rows.models[i];
			// retData.push({
				// name : obj.get('name'),
				// description : obj.get('description'),
				// amount : obj.get('amount'),
				// receiptDate : obj.get('receiptDate'),
				// urlImageOriginal : obj.get('urlImageOri'),
				// urlImageMedium : rows.fieldByName('urlImageMedium'),
				// urlImageSmall : rows.fieldByName('urlImageSmall'),
				// isSynced : rows.fieldByName('isSynced'),
				// isDeleted : rows.fieldByName('isDeleted'),
				// lastUpdate : rows.fieldByName('lastUpdate'),
				// reimburse_gid : rows.fieldByName('reimburse_gid'),
				// gid : rows.fieldByName('gid'),
				// reimburse_id : _parentid, //rows.fieldByName('reimburse_id'),
				// id : rows.fieldByName('ROWID')
			// });
		// }
	} catch(e) {
		retData = {
			error : e.message //e[0];
		};
	}
	//db.close();
	//Ti.API.info("DB getListDetail Rows: ", retData.length);
	if (callback)
		callback(retData);
	return retData;
};

exports.getDetailListAll = function(_parentid, sortBy, order, start, count, filterCol, filterOp, filterVal, callback) {
	var retData = [];
	var db = Alloy.createCollection(table); //Alloy.Collections.instance(table);
	try {
		var filter = "";
		if (filterCol) {
			var val = filterVal;
			if (typeof filterVal == 'string') val = "'"+filterVal+"'"; else 
			if (typeof filterVal == 'boolean') val = filterVal?1:0;
			filter = " and "+filterCol+filterOp+val;
		}
		var parfilter = _parentid ? " and reimburseId="+_parentid : "";
		db.fetch({remove:false, query:"select * from "+table+" where username='"+Alloy.Globals.CURRENT_USER+"'" + parfilter + filter+" ORDER BY "+sortBy+" "+order+" LIMIT "+count+" OFFSET "+start*count+";"});
		retData = db.toJSON();
		// for (i = 0, len = rows.length; len > i; i++) {
			// var obj = rows.models[i];
			// retData.push({
				// name : obj.get('name'),
				// description : obj.get('description'),
				// amount : obj.get('amount'),
				// receiptDate : obj.get('receiptDate'),
				// urlImageOriginal : obj.get('urlImageOri'),
				// urlImageMedium : rows.fieldByName('urlImageMedium'),
				// urlImageSmall : rows.fieldByName('urlImageSmall'),
				// isSynced : rows.fieldByName('isSynced'),
				// isDeleted : rows.fieldByName('isDeleted'),
				// lastUpdate : rows.fieldByName('lastUpdate'),
				// reimburse_gid : rows.fieldByName('reimburse_gid'),
				// gid : rows.fieldByName('gid'),
				// reimburse_id : _parentid, //rows.fieldByName('reimburse_id'),
				// id : rows.fieldByName('ROWID')
			// });
		// }
	} catch(e) {
		retData = {
			error : e.message //e[0];
		};
	}
	//db.close();
	//Ti.API.info("DB getListDetail Rows: ", retData.length);
	if (callback)
		callback(retData);
	return retData;
};

exports.updateDetailObject = function(_item, callback) {
	var retData = {};
	Ti.API.info("Item Desc = " + _item.description);
	var list = Alloy.createCollection(table);
	list.fetch({remove:false}); //id:_item.id, 
	var obj = list.find(function(mdl){
		return mdl.get('id')==_item.id;
	});
	if (obj) {
		obj.save(_item);
		obj.fetch({remove:false});
		retData = obj.toJSON();
	} else {
		retData.error = "Record not found!";
	}
	if (callback)
		callback(retData);
	return retData;
};

exports.addDetailObject = function(_item, callback) {
	var orgItem = _item;
	var retData = {};
	Ti.API.info("Item Desc = " + _item.description);
	var list = Alloy.createCollection(table);
	list.fetch({remove:false});
	var obj = Alloy.createModel(table, _item);
	if (obj) {
		list.add(obj, {merge:true});
		obj.save(_item);
		obj.fetch({remove:false});
		retData = obj.toJSON();
	} else {
		retData.error = "Unable to create record!";
	}
	if (callback)
		callback(retData, orgItem);
	return retData;
};

exports.addOrUpdateDetailObject = function(_item, callback) {
	var orgItem = _item;
	var retData = {};
	Ti.API.info("Item Desc = " + _item.description);
	var list = Alloy.createCollection(table);
	list.fetch({remove:false});
	var obj = list.find(function(mdl){
		return mdl.get('gid') ==_item.gid;
	});
	if (!obj) {
		obj = Alloy.createModel(table, _item);
		list.add(obj, {merge:true});
	}
	if (_item.lastUpdate > obj.get('lastUpdate')) {
		obj.save(_item);
		obj.fetch({remove:false});
	}
	retData = obj.toJSON();
	if (callback)
		callback(retData, orgItem);
	return retData;
};

exports.deleteDetailObject = function(_id, callback) {
	var retData = {};
	Ti.API.info("Delete ItemDetailID = " + _id);
	var list = Alloy.createCollection(table);
	list.fetch({remove:false});
	var obj = list.find(function(mdl){
		return mdl.get('id') ==_id;
	});
	if (obj) {
		obj.destroy();
		obj = null; //.fetch({remove:false});
		//retData = obj.toJSON();
	} else {
		retData.error = "Record not found!";
	}
	if (callback)
		callback(retData);
	return retData;
};

exports.softDeleteDetailObject = function(_id, callback) {
	var retData = {};
	Ti.API.info("Delete ItemDetailID = " + _id);
	var list = Alloy.createCollection(table);
	list.fetch({remove:false});
	var obj = list.find(function(mdl){
		return mdl.get('id') ==_id;
	});
	if (obj) {
		obj.save({isDeleted:1, isSync:0});
		obj.fetch({remove:false});
		retData = obj.toJSON();
	} else {
		retData.error = "Record not found!";
	}
	if (callback)
		callback(retData);
	return retData;
};
