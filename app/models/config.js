exports.definition = {
	config: {
		columns: {
			//id: "INTEGER PRIMARY KEY AUTOINCREMENT",
			username : "TEXT",
		    key : "TEXT PRIMARY KEY",
		    val : "TEXT",
		    "dateCreated": "datetime",
		    "lastUpdated": "datetime",
		    
		    //"PRIMARY KEY" : "(username, key)",
		    //UNIQUE : "(username COLLATE NOCASE, key COLLATE NOCASE)",
		},
		adapter: {
			type: "sql",
			collection_name: "config",
			idAttribute: 'key'
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