var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = $.localReimburse; //Alloy.Collections.reimburse;
var filter = { isDeleted: 0 };

// fetch existing todo items from storage
reimburses && reimburses.fetch({remove: false, query:"SELECT * FROM reimburse WHERE isDeleted=0 and username='"+Alloy.Globals.CURRENT_USER+"'"});

Alloy.Globals.reimburseListReimburse = $.localReimburse;
Alloy.Globals.reimburseAct = $.act;

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	if (filter) filter.username = Alloy.Globals.CURRENT_USER;
	var ret = collection.where(filter);
	if (!ret) ret = [];
	return ret; 
}

// Perform transformations on each model as it is processed. Since
// these are only transformations for UI representation, we don't
// actually want to change the model. Instead, return an object
// that contains the fields you want to use in your bindings. The
// easiest way to do that is to clone the model and return its
// attributes with the toJSON() function.
function transformFunction(model) {
	var transform = model.toJSON();
	var stat = model.get('status'); //BUG with listview? when using "var status =" it's content will be undefined, and when using global var "status =" the content is the same as "transform.status" (uppercased)
	transform.status = STATUS[stat].toUpperCase();
	transform.projectDate = moment.parseZone(transform.projectDate).local().format(dateFormat);
	transform.total = "Rp." + String.formatDecimal(transform.total); // + " IDR"; //Number(transform.total.toFixed(2)).toLocaleString() + " IDR";
	if (transform.title && String.format(transform.title).length > 25) transform.title = transform.title.substring(0,22)+"...";
	//-- workaround to customize ItemTemplate component's style on-the-fly
	transform.searchableText = model.get('title') + " " + STATUS[stat] + " " + model.get('total') + " " + model.get('projectDate');
	transform.status_backgroundColor = STATUSCODE_COLOR[stat];
	transform.statusView_backgroundColor = transform.status_backgroundColor;
	transform.avatar = transform.first_receipt_mini_url && transform.first_receipt_mini_url!="" ? transform.first_receipt_mini_url : "/icon/thumb_receipt.png"; //"/icon/ic_action_copy.png"; //
	transform.avatarOri = transform.first_receipt_original_url && transform.first_receipt_original_url!="" ? transform.first_receipt_original_url : "/icon/thumb_receipt.png"; //"/icon/ic_action_copy.png";
	//-- end of workaround
	return transform;
}

// Show task list based on selected status type
function showList(e) {
	reimburses && reimburses.fetch({remove:false, query:"SELECT * FROM reimburse WHERE isDeleted=0 and username='"+Alloy.Globals.CURRENT_USER+"'"}); //fetch(e.param ? e.param : {remove:false});
}

function showAllClick(e) {
	filter = { isDeleted: 0 };
	showList(e);
	updateBorder(e);
}

function openBtnClick(e) {
	filter = { isDeleted: 0, status: STATUSCODE[Const.Open] };
	showList(e);
	updateBorder(e);
}

function pendBtnClick(e) {
	filter = { isDeleted: 0, status: STATUSCODE[Const.Pending] };
	showList(e);
	updateBorder(e);
}

function closedBtnClick(e) {
	filter = { isDeleted: 0, status: STATUSCODE[Const.Closed] };
	showList(e);
	updateBorder(e);
}

function updateBorder(e) {
	$.pendBtn.borderWidth = "0";
	$.openBtn.borderWidth = "0";
	$.closedBtn.borderWidth = "0";
	$.showAll.borderWidth = "0";
	
	$.pendBtn.borderRadius = "0";
	$.openBtn.borderRadius = "0";
	$.closedBtn.borderRadius = "0";
	$.showAll.borderRadius = "0";
	
	switch (e.source) {
		case $.pendBtn: $.pendBtn.borderWidth = "3dp"; $.pendBtn.borderRadius = "3dp"; break;
		case $.openBtn: $.openBtn.borderWidth = "3dp"; $.openBtn.borderRadius = "3dp"; break;
		case $.closedBtn: $.closedBtn.borderWidth = "3dp"; $.closedBtn.borderRadius = "3dp"; break;
		//case $.showAll: $.showAll.borderWidth = "3dp"; $.showAll.borderRadius = "3dp"; break;
	}
}

function listItemHandler(e) {
	//var section = $.tableView.sections[e.sectionIndex];
	var item = $.listSection.getItemAt(e.itemIndex); //e.section.items[e.itemIndex];
	//alert("Clicked Item Idx:"+e.itemIndex+" (rowid:"+item.properties.itemId+")");
	
	//handling event of binded component
    // if (e.bindId === 'avatarView') {
    	// var img = item.avatar;
    	// thumbPopUp(e, img);
    // }
    
    //section.updateItemAt(e.itemIndex, item);
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

if ($.is) {
	$.is.init($.tableView);
	// if ($.tableView.sections && $.tableView.sections.length > 0) {
		// $.is.load(); //may cause exception if there are no sections on internal listview
		// $.is.mark(); //may cause exception if there are no sections on internal listview
	// }
}
if ($.ptr) $.ptr.refresh();

$.reimburseList.addEventListener("refresh", function(e){
	Alloy.Globals.index.fireEvent("update", e);
	showList(e);
});

$.reimburseList.addEventListener("open", function(e){
	e.bubbles = false;
	Alloy.Globals.index.getActivity().getActionBar().title = "Reimburse";
	$.tableView.search = Alloy.Globals.searchView;
	showAllClick(e);
	Alloy.Globals.scrollableView.scrollToView($.reimburseList);
	e.cancelBubble = true;
});
