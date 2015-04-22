var args = arguments[0] || {};

var reimburseDetails = Alloy.Collections.reimburseDetail;

// fetch existing todo items from storage
reimburseDetails && reimburseDetails.fetch();

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	var ret = collection.where({ isDeleted: 0 });
	if (!ret) ret = [];
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
	transform.status = STATUS[transform.desctiption];
	transform.total = transform.amount + " IDR";
	if (String.format(transform.title).length > 30) transform.name = transform.name.substring(0,27)+"...";
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

$.reimburseDetailList.addEventListener("open", function(e){
	$.tableView.search = Alloy.Globals.index.searchView;
	Alloy.Globals.index.activity.actionBar.title = "Reimburse Detail";
	//showList(e);
});
