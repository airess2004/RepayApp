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

function windowOpen(e) {
	Alloy.Globals.reimburseDetailList = $.reimburseDetailList;
	data = reimburses.get(args.id);
	var activity = $.reimburseDetailList.getActivity();
	if (activity) {
		var actionBar = activity.getActionBar();
		// get a handle to the action bar
		var title = data.get("title");
		if (String.format(title).length > 30) title = title.substring(0,27)+"...";
		actionBar.title = title;
		$.totalField.value = data.get("total");
	}
	
}

function newDetailClick(e) {
	Alloy.createController("reimburseDetailForm", {reimburseId : args.id, id : null}).getView().open();
}

function doEdit() {
	Alloy.createController("reimburseForm", {id : args.id}).getView().open();
	$.reimburseDetailList.close();
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
		isDeleted : 0,
		reimburseId : args.id
	});
	if (!ret)
		ret = [];
	return ret;
}

function transformFunction(model) {
	var transform = model.toJSON(); 
	transform.receiptDate = moment.parseZone(transform.receiptDate).local().format("YYYY-MM-DD");
	transform.amount = transform.amount + " IDR";
	if (String.format(transform.name).length > 30)
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
	//$.tableView.search = Alloy.Globals.searchView;
	//Alloy.Globals.index.activity.actionBar.title = "Reimburse Detail";
	//showList(e);
});
