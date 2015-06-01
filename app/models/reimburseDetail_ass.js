exports.definition = {
	config : {
		columns : {
			id: "INTEGER PRIMARY KEY AUTOINCREMENT",
			gid: "INTEGER",
			reimburseId : "integer",
			reimburseGid: "INTEGER",
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
