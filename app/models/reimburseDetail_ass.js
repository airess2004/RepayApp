exports.definition = {
	config : {
		columns : {
			id: "INTEGER PRIMARY KEY AUTOINCREMENT", //local reimburseDetailAss_id
			gid: "INTEGER", //global reimburseDetail_id
			reimburseId : "integer", //local reimburseAss_Id
			reimburseGid: "INTEGER", //global reimburse_id
			name : "string",
			receiptDate : "datetime",
			isRejected : "boolean",
			amount : "double",
			description : "string",
			totalComments: "integer",
			urlImageMedium : "string",
			urlImageSmall : "string",
			urlImageOriginal : "string",
			isSync: "boolean",
		},
		adapter : {
			type : "sql",
			collection_name : "reimburseDetail_ass",
			idAttribute: 'id'
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			comparator : function(model) {
  				return -(moment.parseZone(model.get('receiptDate')).unix());
			},
		});

		return Collection;
	}
}; 
