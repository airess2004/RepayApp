var args = arguments[0] || {};

var reimburseDetails = Alloy.Collections.reimburseDetail;
var reimburses = Alloy.Collections.reimburse;
// fetch existing todo items from storage
reimburses && reimburses.fetch();
reimburseDetails && reimburseDetails.fetch();
var data = reimburses.get(args.id);

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.

function windowOpen(collection) {
	Alloy.Globals.index = $.reimburseDetailList;
	//Alloy.Globals.abx = require('com.alcoapps.actionbarextras');
	var activity = $.reimburseDetailList.getActivity();
	if (activity) {
		// var actionBar = activity.getActionBar();
		// get a handle to the action bar
		// actionBar.title = data.title;
	}
	
}

function doSave() {
	// Alloy.createController("reimburseDetailForm").getView().open();
}

function doMenuClick(evt) {
  switch(evt.source.title){
		case "Menu": // in real life you probably wouldn't want to use the text of the menu option as your condition
			var activity = $.reimburseDetailList.getActivity();
			activity.openOptionsMenu();
			break;
		default:
			alert(evt.source.title);	
	}
}

function whereFunction(collection) {
	var ret = collection.where({
		isDeleted : 0
	});
	if (!ret)
		ret = [];
	return ret;
	//!whereIndex ?
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
	transform.status = STATUS[transform.desctiption];
	transform.total = transform.amount + " IDR";
	if (String.format(transform.title).length > 30)
		transform.name = transform.name.substring(0, 27) + "...";
	return transform;
}

// open the "add item" window
function addItem() {
	Alloy.createController("reimburseDetailForm").getView().open();
}

// Show task list based on selected status type
function showList(e) {
	// if (typeof e.index !== 'undefined' && e.index !== null) {
	// whereIndex = e.index; // TabbedBar
	// } else {
	// whereIndex = INDEXES[e.source.title]; // Android menu
	// }
	reimburseDetails.fetch();
}

function thumbPopUp(e) {

}

$.reimburseDetailList.addEventListener("open", function(e) {
	$.tableView.search = Alloy.Globals.index.searchView;
	Alloy.Globals.index.activity.actionBar.title = "Reimburse Detail";
	//showList(e);
});
