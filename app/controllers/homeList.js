var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = $.localReimburse; //Alloy.Collections.reimburse;
//var reimburseDetails = Alloy.Collections.reimburseDetail;

// fetch existing todo items from storage
reimburses && reimburses.fetch({remove: false, query:"SELECT * FROM reimburse WHERE isDeleted=0 and status>="+STATUSCODE[Const.Open]});
//reimburseDetails && reimburseDetails.fetch({remove: false});

Alloy.Globals.homeListReimburse = $.localReimburse;
//Alloy.Globals.homeListReimburseDetail = $.localReimburseDetail;

// Sort Descending
// reimburses.comparator = function(model) {
  // return -(moment.parseZone(model.get('projectDate')).unix());
// };
//reimburses.sort();

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	var ret = collection.where({ isDeleted: 0});
	ret = _.filter(ret, function(model){
		return model.get('status') > STATUSCODE[Const.Open];
	});
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
	transform.total = "Rp." + String.formatDecimal(transform.total); //Number(transform.total.toFixed(2)).toLocaleString() + " IDR";
	transform.projectDate = moment.parseZone(transform.projectDate).local().format(dateFormat);
	//if (transform.title && String.format(transform.title).length > 30) transform.title = transform.title.substring(0,27)+"...";
	transform.userAvatar = "/icon/thumb_reimburse.png";
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
	reimburses && reimburses.fetch(e.param ? e.param : {remove:false});
	//reimburseDetails && reimburseDetails.fetch({remove: false});
	//comments && comments.fetch({remove: false});
}

$.homeList.addEventListener("refresh", function(e){
	Alloy.Globals.index.fireEvent("update", e);
	showList(e);
});

function thumbPopUp(e) {
	
}

$.homeList.addEventListener("open", function(e){
	e.bubbles = false;
	Alloy.Globals.index.getActivity().getActionBar().title = "Home";
	//Alloy.Globals.newMenu.visible = false;
	// Make sure icons are updated
	//Alloy.Globals.index.activity.invalidateOptionsMenu();
	$.tableView.search = Alloy.Globals.searchView;
	Alloy.Globals.scrollableView.scrollToView($.homeList);
	//showList(e);
	e.cancelBubble = true;
});
