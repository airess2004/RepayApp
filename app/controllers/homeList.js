var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses_ass = $.localReimburse_ass; //Alloy.Collections.reimburse_ass; //
var reimburseDetails_ass = Alloy.Collections.reimburseDetail_ass;

//reimburses_ass && reimburses_ass.fetch({remove: false, query:"SELECT * FROM reimburse_ass WHERE username='"+Alloy.Globals.CURRENT_USER+"'"});
//reimburseDetails_ass && reimburseDetails_ass.fetch({remove: false});

Alloy.Globals.homeListReimburse_ass = reimburses_ass; //$.localReimburse_ass;
//Alloy.Globals.homeListReimburseDetail_ass = $.localReimburseDetail_ass;

Alloy.Globals.homeAct = $.act;

// event when a model is added to a collection
reimburses_ass.on('add', function(model, collection, options){
	var listView = $.tableView; //$.homeListView.children[0]; 
	//TODO: add model into listView's items, might need to recreate new templace if number of details in the parent model is bigger than Alloy.Globals.homeMaxDetail;
	
});

// event when a model is destroyed (deleted from database)
reimburses_ass.on('destroy', function(model, collection, options){
	//var listView = $.tableView; //$.homeListView.children[0]; 
	
});

// Filter the fetched collection before rendering. Don't return the
// collection itself, but instead return an array of models
// that you would like to render.
function whereFunction(collection) {
	var ret = collection.where({ username: Alloy.Globals.CURRENT_USER });
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
	var transform = model ? model.toJSON() : this.toJSON();
	transform.status = transform.reimburse_is_confirmed == true ? Const.Closed : Const.Pending; //transform.status
	transform.total = "Rp." + String.formatDecimal(transform.reimburse_total_approved); //Number(transform.total.toFixed(2)).toLocaleString() + " IDR";
	transform.projectDate = moment.parseZone(transform.reimburse_application_date).local().format(dateFormat);
	transform.title = transform.reimburse_title;
	//if (transform.title && String.format(transform.title).length > 30) transform.title = transform.title.substring(0,27)+"...";
	transform.userAvatar = transform.source_userAvatar || "/icon/thumb_reimburse.png";
	transform.userAvatarOri = transform.source_userAvatarOri || transform.source_userAvatar;
	//additional properties
	transform.searchableText = transform.title + " " + transform.status + " " + transform.total + " " + transform.projectDate;
	transform.innerView_touchEnabled = (transform.status == Const.Pending);
	transform.bottomView_touchEnabled = transform.innerView_touchEnabled;
	transform.confirmBtn = {
		touchEnabled : transform.innerView_touchEnabled,
		text : (transform.innerView_touchEnabled) ? "CONFIRM" : transform.status,
		backgroundColor : (transform.innerView_touchEnabled) ? Alloy.Globals.lightColor : Alloy.Globals.darkColor,
	};
	return transform;
}
Alloy.Globals.homeTransFunc = transformFunction;

function detailTransformFunction(model) {
	var transform = model ? model.toJSON() : this.toJSON(); 
	transform.status = transform.isRejected == true ? Const.Rejected : Const.Approved;
	transform.urlImageOriginal = transform.urlImageOriginal || "/icon/thumb_receipt.png"; //"/icon/ic_receipt.png";
	transform.urlImageSmall = transform.urlImageSmall || "/icon/thumb_receipt.png"; //"/icon/ic_receipt.png";
	transform.receiptDate = moment.parseZone(transform.receiptDate).local().format(dateFormat);
	transform.amount = "Rp." + String.formatDecimal(transform.amount);// + " IDR";
	//transform.detailList = $.localReimburseDetail_ass;
	if (transform.name && String.format(transform.name).length > 25)
		transform.name = transform.name.substring(0, 22) + "...";
	//additional properties
	var val = (DETAILSTATUSCODE[transform.status] < DETAILSTATUSCODE[Const.Rejected]);
	transform.switchBtn = {
		touchEnabled : true,
		value : val,
		backgroundImage: val == false ? "/icon/sw_no.png" : "/icon/sw_yes.png",
	};
	return transform;
}
Alloy.Globals.homeDetTransFunc = detailTransformFunction;

function prefixBindId(prefix, temp) {
	if (temp.bindId) temp.bindId = prefix + temp.bindId;
	var childs = temp.childTemplates;
	if (childs) {
		var len = childs.length;
		for (var x = 0; x < len; x++) {
			prefixBindId(prefix, childs[x]);
		}
	}
}

// recreate listView, may takes a long time to loop each parents and their details
function createAssList(e) {
	if (Alloy.Globals.act) Alloy.Globals.act.show();
	// refresh collections
	reimburses_ass && reimburses_ass.fetch({remove: false, query:"SELECT * FROM reimburse_ass WHERE username='"+Alloy.Globals.CURRENT_USER+"'"});
	reimburseDetails_ass && reimburseDetails_ass.fetch({remove: false});
	// generate template upto max number of details
	Alloy.Globals.homeMaxDetail = 0;
	reimburses_ass.forEach(function(mdl) {
		if (mdl.get('reimburseDetail_count') > Alloy.Globals.homeMaxDetail) Alloy.Globals.homeMaxDetail = mdl.get('reimburseDetail_count');
	});
	var temps = {};
	for (var i = 0; i <= Alloy.Globals.homeMaxDetail; i++) {
		var temp = Alloy.createController("homeReimburseRow", {"__itemTemplate":{}}).getView();
		//customize each template
		var detailTemps = temp.childTemplates[2];
		detailTemps.childTemplates = [];
		for (var j = 0; j < i; j++) {
			var detailTemp = Alloy.createController("homeReimburseDetailRow", {"__itemTemplate":{}}).getView();
			// customize each detail template
			detailTemp.type = "Ti.UI.View";
			detailTemp.bindId = detailTemp.properties.bindId;
			prefixBindId("_"+i+"_"+j+"_", detailTemp);
			detailTemps.childTemplates.push(detailTemp);
		}
		temps["temp"+i] = temp;
	}
	// create listview
	var listView = Ti.UI.createListView({
    	// Maps Templates
    	templates: temps,
    	// Can be overridden by the item's template property
    	defaultItemTemplate: 'temp0',
    	searchView: Alloy.Globals.searchView,
	});
	// create section & init items
	var items = [];
	var parentLength = reimburses_ass.length;
	for (var i = 0; i < parentLength; i++) {
		var obj = transformFunction(reimburses_ass.models[i]);
		var item = {
			template: "temp"+obj.reimburseDetail_count,
			searchableText: obj.searchableText,
			properties: {
				itemId: obj.id,
			},
			avatar: {
				image: obj.userAvatar,
				imageOri: obj.userAvatarOri,
			},
			title: {
				text: obj.title,
			},
			total: {
				text: obj.total,
			},
			innerView: {
				touchEnabled: obj.innerView_touchEnabled,
			},
			bottomView: {
				touchEnabled: obj.bottomView_touchEnabled,
			},
			confirmBtn: obj.confirmBtn,
		};
		var details = reimburseDetails_ass.where({reimburseId:obj.id});
		var detailLength = details.length;
		var cnt = obj.reimburseDetail_count;
		for (var j = 0; j < detailLength; j++) {
			var detObj = detailTransformFunction(details[j]);
			var prx = "_"+cnt+"_"+j+"_";
			item[prx+"homeReimburseDetailRow"] = {
				itemId: detObj.id,
			};
			item[prx+"avatar"] = {
				image: detObj.urlImageSmall,
				imageOri: detObj.urlImageOriginal,
			};
			item[prx+"title"] = {
				text: detObj.name,
			};
			item[prx+"date"] = {
				text: detObj.receiptDate,
			};
			item[prx+"amount"] = {
				text: detObj.amount,
			};
			item[prx+"commentLabel"] = {
				text: detObj.totalComments,
			};
			item[prx+"switchBtn"] = detObj.switchBtn;
		}
		items.push(item);
	};
	$.homeListView.removeAllChildren(); //$.homeList.children[0].removeAllChildren(); //.remove($.homeList.children[0]); //
	$.tableView = listView; //
	if (!$.is) {
		$.is = Alloy.createWidget("nl.fokkezb.infiniteScroll");
		$.is.addEventListener("end", listLoader);
		$.tableView.add($.is);
	}
	$.homeListView.add(listView); //$.homeList.children[0].add(listView);
	var section = Ti.UI.createListSection();
	section.setItems(items);
	listView.sections = [section];
	//$.homeList.children[0] = listView;
	
	if ($.is) {
		$.is.init($.tableView);
		// if ($.tableView.sections && $.tableView.sections.length > 0) {
			// $.is.load(); //may cause exception if there are no sections on internal listview
			// $.is.mark(); //may cause exception if there are no sections on internal listview
		// }
	}
	if ($.ptr) $.ptr.refresh();
	if (Alloy.Globals.act) Alloy.Globals.act.hide();
}

function updateAssList(newList, newListDetail) {
	if ($.homeListView.children.length == 0) { //$.homeList.children.length
		createAssList();
	} else {
		// refresh collections
		reimburses_ass && reimburses_ass.fetch({remove: false, query:"SELECT * FROM reimburse_ass WHERE username='"+Alloy.Globals.CURRENT_USER+"'"});
		reimburseDetails_ass && reimburseDetails_ass.fetch({remove: false});
	}
	var listView = $.tableView; //$.homeListView.children[0]; //$.homeList.children[0].children[0];
	//TODO: update listItems of changed data instead of recreating the listview from scratch
	
}

// Show task list based on selected status type
function showList(e) {
	reimburses_ass && reimburses_ass.fetch({remove: false, query:"SELECT * FROM reimburse_ass WHERE username='"+Alloy.Globals.CURRENT_USER+"'"}); //fetch(e.param ? e.param : {remove:false});
	//reimburseDetails_ass && reimburseDetails_ass.fetch({remove: false});
	//comments && comments.fetch({remove: false});
	//createAssList(e);
}

function listLoader(e) {

    var ln = reimburses_ass.models.length; 

    reimburses_ass.fetch({

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



$.homeList.addEventListener("update", function(e){
	createAssList(e);
	Alloy.Globals.homeAct.hide();
});

$.homeList.addEventListener("refresh", function(e){
	Alloy.Globals.index.fireEvent("update", e);
	//showList(e);
});

$.homeList.addEventListener("open", function(e){
	e.bubbles = false;
	if (!Alloy.Globals.homeAct.visible) {	
		Alloy.Globals.index.getActivity().getActionBar().title = "Home";
		Alloy.Globals.scrollableView.scrollToView($.homeList);
		//showList(e);
	}
	e.cancelBubble = true;
});

