exports.definition = {
	config: {
		columns: {
		    "title": "string",
		    "total": "double",
		    "projectDate": "datetime",
		    "sentDate": "datetime",
		    "statusUpdateDate": "datetime",
		    "status": "integer",
		    "sentTo": "string",
		    "userId": "bigint",
		    "dateCreated": "datetime",
		    "lastUpdated": "datetime",
		    "lastUpdate": "datetime",
		    "isDeleted": "boolean"
		},
		adapter: {
			type: "sql",
			collection_name: "reimburse"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};