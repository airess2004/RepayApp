var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = $.localReimburse; //Alloy.Collections.reimburse;
var filter = { isDeleted: 0 };

// fetch existing todo items from storage
reimburses && reimburses.fetch({remove: false, query:"SELECT * FROM reimburse WHERE isDeleted=0"});
Alloy.Globals.reimburseListReimburse = $.localReimburse;

// Sort Descending
// reimburses.comparator = function(model) {
  // return -(moment.parseZone(model.get('projectDate')).unix());
// };
//reimburses.sort();

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	var ret = collection.where(filter);
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
	var stat = model.get('status'); //BUG? when using "var status =" it's content will be undefined, and when using global var "status =" the content is the same as "transform.status" (uppercased)
	//alert("stat = "+stat);
	transform.status = STATUS[stat].toUpperCase();
	transform.projectDate = moment.parseZone(transform.projectDate).local().format(dateFormat);
	transform.total = "Rp." + String.formatDecimal(transform.total); // + " IDR"; //Number(transform.total.toFixed(2)).toLocaleString() + " IDR";
	if (transform.title && String.format(transform.title).length > 25) transform.title = transform.title.substring(0,22)+"...";
	//alert("stat = "+stat + "\nSTATUS[stat] = "+STATUS[stat]+"\nSTATUS[model.get('status')] = "+STATUS[model.get('status')]+"\nSTATUS[model.get('status')] = "+STATUS[model.get('status')]);
	//-- workaround to customize ItemTemplate component's style on-the-fly
	transform.searchableText = model.get('title') + " " + STATUS[stat] + " " + model.get('total') + " " + model.get('projectDate');
	transform.status_backgroundColor = STATUSCODE_COLOR[stat];
	transform.statusView_backgroundColor = transform.status_backgroundColor;
	//-- end of workaround
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
}

function showAllClick(e) {
	filter = { isDeleted: 0 };
	showList(e);
}

function openBtnClick(e) {
	filter = { isDeleted: 0, status: STATUSCODE[Const.Open] };
	showList(e);
}

function pendBtnClick(e) {
	filter = { isDeleted: 0, status: STATUSCODE[Const.Pending] };
	showList(e);
}

function closedBtnClick(e) {
	filter = { isDeleted: 0, status: STATUSCODE[Const.Closed] };
	showList(e);
}

function thumbPopUp(e) {
	
}

function listItemHandler(e) {
	var item = $.listSection.getItemAt(e.itemIndex);
	//alert("Clicked Item Idx:"+e.itemIndex+" (rowid:"+item.properties.itemId+")");
}

function doRefresh(e) {
    reimburses.fetch({
    	//remove: false,
        success: e.hide,
        error: e.hide
    });
}

function listLoader(e) {

    var ln = reimburses.models.length; 

    reimburses.fetch({

        // whatever your sync adapter needs to fetch the next page
        data: { offset: ln },

        // don't reset the collection, but add to it
        add: true,
        
        //remove: false,

        success: function (col) {

            // call done() when we received last page - else success()
            (col.models.length === ln) ? e.done() : e.success(); //col.length

        },

        // call error() when fetch fails
        error: function(col) {
            // pass optional error message to display
            e.error(L('isError', 'Tap to try again...'));
        }
    });
}

if ($.is) $.is.init($.tableView);
if ($.ptr) $.ptr.refresh();

$.reimburseList.addEventListener("refresh", function(e){
	Alloy.Globals.index.fireEvent("update", e);
	showList(e);
});

$.reimburseList.addEventListener("open", function(e){
	e.bubbles = false;
	Alloy.Globals.index.getActivity().getActionBar().title = "Reimburse";
	//Alloy.Globals.newMenu.visible = true;
	// Make sure icons are updated
	//Alloy.Globals.index.activity.invalidateOptionsMenu();
	$.tableView.search = Alloy.Globals.searchView;
	Alloy.Globals.scrollableView.scrollToView($.reimburseList);
	//showList(e);
	e.cancelBubble = true;
});
