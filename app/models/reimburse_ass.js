var moment = require('alloy/moment');

exports.definition = {
	config: {
		columns: {
			id: "INTEGER PRIMARY KEY AUTOINCREMENT", //local reimburseAss_id
			gid: "INTEGER", //global reimburseAss_id
			userId : "integer",
			username : "text",
			source_userId: "integer",
			source_userAvatar: "text",
			source_userAvatarOri: "text",
			reimburse_gid: "integer", //global reimburse_id
		    reimburse_title: "text",
		    reimburse_description: "text",
		    reimburse_application_date: "datetime",
		    reimburse_is_submitted: "boolean",
		    reimburse_submitted_at: "datetime",
		    reimburse_is_confirmed: "boolean",
		    reimburse_confirmed_at: "datetime",
		    reimburse_total_approved: "double",
		    reimburseDetail_count: "integer",
		    isSync: "boolean"
		},
		adapter: {
			type: "sql",
			collection_name: "reimburse_ass",
			idAttribute: 'id'
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions (ie. save, toString) and properties go here

			// Extend Backbone.Model
		});

		return Model;
	},
	extendCollection: function(Collection) {        
        _.extend(Collection.prototype, {
            // extended functions (ie. get, add) and properties go here
            
            comparator : function(model) {
  				return -(moment.parseZone(model.get('reimburse_submitted_at')).unix());
			},
                            
        });
 
        return Collection;
    }
};

