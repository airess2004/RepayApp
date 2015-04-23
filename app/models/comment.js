exports.definition = {
	config: {
		columns: {
		    "reimburseDetailId": "string",
		    "message": "string",
		    "commentsDate": "datetime",
		    "userId": "bigint",
		    "username" : "string",
		    "dateCreated": "date"
		},
		adapter: {
			type: "sql",
			collection_name: "comment"
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