var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses_ass = $.localReimburse_ass; //Alloy.Collections.reimburse_ass; //
//var reimburseDetails_ass = Alloy.Collections.reimburseDetail_ass;

// fetch existing todo items from storage
reimburses_ass && reimburses_ass.fetch({remove: false, query:"SELECT * FROM reimburse_ass WHERE username='"+Alloy.Globals.CURRENT_USER+"'"});
//reimburseDetails_ass && reimburseDetails_ass.fetch({remove: false});

Alloy.Globals.homeListReimburse_ass = reimburses_ass; //$.localReimburse_ass;
//Alloy.Globals.homeListReimburseDetail_ass = $.localReimburseDetail_ass;

// Sort Descending
// reimburses.comparator = function(model) {
  // return -(moment.parseZone(model.get('projectDate')).unix());
// };
//reimburses.sort();

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	var ret = collection.where({ username: Alloy.Globals.CURRENT_USER });
	// ret = _.filter(ret, function(model){
		// return model.get('status') > STATUSCODE[Const.Open];
	// });
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
	transform.status = transform.reimburse_is_confirmed == true ? Const.Closed : Const.Pending; //transform.status
	transform.total = "Rp." + String.formatDecimal(transform.reimburse_total_approved); //Number(transform.total.toFixed(2)).toLocaleString() + " IDR";
	transform.projectDate = moment.parseZone(transform.reimburse_application_date).local().format(dateFormat);
	transform.title = transform.reimburse_title;
	//if (transform.title && String.format(transform.title).length > 30) transform.title = transform.title.substring(0,27)+"...";
	transform.userAvatar = transform.source_userAvatar || "/icon/thumb_reimburse.png";
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
	reimburses_ass && reimburses_ass.fetch({remove: false, query:"SELECT * FROM reimburse_ass WHERE username='"+Alloy.Globals.CURRENT_USER+"'"}); //fetch(e.param ? e.param : {remove:false});
	//reimburseDetails_ass && reimburseDetails_ass.fetch({remove: false});
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
