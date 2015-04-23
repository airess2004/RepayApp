var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = Alloy.Collections.reimburse;

// fetch existing todo items from storage
reimburses && reimburses.fetch();

// Sort Descending
reimburses.comparator = function(model) {
  return -(moment.parseZone(model.get('projectDate')).unix());
};
//reimburses.sort();

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	var ret = collection.where({ isDeleted: 0, isSent: 1 });
	if (!ret) ret = [];
	// ret = _.sortBy(ret, function(model){
		 // return -(moment.parseZone(model.get('projectDate')).unix());
	// });
	return ret; //!whereIndex ?
		//collection.models :
		//collection.where({ isDeleted: false });
}

// Perform transformations on each model as it is processed. Since
// these are only transformations for UI representation, we don't
// actually want to change the model. Instead, return an object
// that contains the fields you want to use in your bindings. The
// easiest way to do that is to clone the model and return its
// attributes with the toJSON() function.
function transformFunction(model) {
	var transform = model.toJSON();
	transform.status = STATUS[transform.status];
	transform.total = transform.total + " IDR";
	if (String.format(transform.title).length > 30) transform.title = transform.title.substring(0,27)+"...";
	return transform;
}

// open the "add item" window
function addItem() {
	
}

// Show task list based on selected status type
function showList(e) {
	// if (typeof e.index !== 'undefined' && e.index !== null) {
		// whereIndex = e.index; // TabbedBar
	// } else {
		// whereIndex = INDEXES[e.source.title]; // Android menu
	// }
	reimburses.fetch();
}

function thumbPopUp(e) {
	
}

$.homeList.addEventListener("open", function(e){
	Alloy.Globals.index.activity.actionBar.title = "Home";
	$.tableView.search = Alloy.Globals.searchView;
	//showList(e);
});