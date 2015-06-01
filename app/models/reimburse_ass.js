var moment = require('alloy/moment');

exports.definition = {
	config: {
		columns: {
			id: "INTEGER PRIMARY KEY AUTOINCREMENT",
			gid: "INTEGER",
			userId : "integer",
			username : "text",
			source_userId: "integer",
			source_userAvatar: "text",
			reimburse_gid: "integer",
		    reimburse_title: "text",
		    reimburse_description: "text",
		    reimburse_application_date: "datetime",
		    reimburse_is_submitted: "boolean",
		    reimburse_submitted_at: "datetime",
		    reimburse_is_confirmed: "boolean",
		    reimburse_confirmed_at: "datetime",
		    reimburse_total_approved: "double",
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
			// Implement the validate method						
            // validate: function (attrs) {
            	// this.error = null;
				// for (var key in attrs) {
					// var value = attrs[key];
					// if (key === "title") {
						// if (!value || value.length <= 0) {
							// this.error = "No Title!";
							// return this.error;
						// }
					// }
					// if (key === "projectDate") {
						// if (!value || value.length <= 0) {
							// this.error =  "No Project Date!";
							// return this.error;
						// }
					// }
				// }
			// },
			
			// save: function(atts, opts) {
            	// if (!this.get('status')) this.set('status', 0);
            	// if (!this.get('isSent')) this.set('isSent', 0);
 				// if (!this.get('isDeleted')) this.set('isDeleted', 0);
 				// if (!this.get('total')) this.set('total', 0);
 				// //if (!this.get('dateCreated')) this.set('dateCreated', moment.utc().toISOString());
 				// if (!this.get('id') && !this.get('alloy_id')) {
 					// this.set('dateCreated', moment.utc().toISOString());
 				// } else {
 					// this.set('lastUpdated', moment.utc().toISOString());
 				// }
 				// this.set('lastUpdate', moment.utc().toISOString());
//  		
                // Backbone.Model.prototype.save.call(this, atts, opts);
                // //this.save.call(this, atts, opts);
            // },
            
			// Extend Backbone.Model
		});

		return Model;
	},
	extendCollection: function(Collection) {        
        _.extend(Collection.prototype, {
            // extended functions (ie. get, add) and properties go here
            // initialize: function () {
                // //*** Default sort field.  
                // this.sortField = "projectDate"; //'id'
                // //*** Default sort direction
                // this.sortDirection = "DESC";                
                // // sort type
                // this.sortType = "natural";
            // },
//  
            // //*** Use setSortField to specify field and direction before calling sort method
            // setSortField: function (field, direction) {
                // this.sortField = field;
                // this.sortDirection = direction;
            // },
//  
            // comparator: function(collection) {
                // return collection.get(this.sortField);
            // },
            comparator : function(model) {
  				return -(moment.parseZone(model.get('reimburse_submitted_at')).unix());
			},
            // //*** Override sortBy to allow sort on any field, either direction 
            // sortBy: function (iterator, context) {
                // var obj = this.models;
                // var direction = this.sortDirection;
                // var type = this.sortType;
//  
                // return _.pluck(_.map(obj, function (value, index, list) {
                    // return {
                        // value: value,
                        // index: index,
                        // criteria: iterator.call(context, value, index, list)
                    // };
                // }).sort(
                    // function (left, right) {                    
                        // if (type == 'natural') {
                            // return require('naturalSort').naturalSort(left, right, direction);
                        // } else {
                            // return require('naturalSort').normalSort(left, right, direction);
                        // }
                    // }), 'value');
            // },
                            
        });
 
        return Collection;
    }
};

