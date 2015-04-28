exports.definition = {
	config : {
		columns : {
			"id": "INTEGER PRIMARY KEY",
			"reimburseId" : "bigint",
			"name" : "string",
			"receiptDate" : "datetime",
			"isDeleted" : "boolean",
			"amount" : "double",
			"description" : "string",
			"dateCreated" : "datetime",
			"lastUpdated" : "datetime",
			"lastUpdate" : "datetime",
			"urlImageMedium" : "string",
			"urlImageSmall" : "string",
			"urlImageOriginal" : "string"
		},
		adapter : {
			type : "sql",
			collection_name : "reimburseDetail",
			idAttribute: "id",
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
