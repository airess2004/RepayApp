exports.definition = {
	config: {
		columns: {
			id: "INTEGER PRIMARY KEY AUTOINCREMENT",
			gid: "INTEGER",
		    "username": "string",
		    "passwordHash": "string",
		    "fullname": "text",
		    "email": "text",
		    "original_avatar_url": "text",
     		"mini_avatar_url": "text",
     		device_id: "text",
     		role_id: "text",
     		login: "text",
     		is_main_user: "boolean",
     		"is_deleted": "boolean",
     		"isSync": "boolean",
     		"authentication_token": "text",
		    "dateCreated": "datetime",
		    "lastUpdated": "datetime",
		},
		adapter: {
			type: "sql",
			collection_name: "user",
			idAttribute: 'id'
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