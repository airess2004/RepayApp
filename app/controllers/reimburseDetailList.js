var args = arguments[0] || {};

var reimburseDetails = Alloy.Collections.reimburseDetail; //$.localReimburseDetails; //
var reimburses = Alloy.Collections.reimburse; //$.localReimburses; //
// fetch existing todo items from storage
//reimburses && reimburses.fetch({remove: false});
var data = reimburses.get(args.id);
reimburseDetails && reimburseDetails.fetch({remove:false, query:"SELECT * FROM reimburseDetail WHERE isDeleted=0 and reimburseId="+args.id});

//var abx = require('com.alcoapps.actionbarextras');

function windowOpen(e) {
	Alloy.Globals.reimburseDetailList = $.reimburseDetailList;
	Alloy.Globals.dialogView2 = $.dialogView2;
	Alloy.Globals.act2 = $.act;
	data = reimburses.get(args.id);
	var activity = $.reimburseDetailList.getActivity();
	if (activity) {
		var actionBar = activity.getActionBar();
		actionBar.hide();
		actionBar.icon = "/icon/ic_back.png";
		// Show the "angle" pointing back
		actionBar.onHomeIconItemSelected = doBack;
		var title = data.get("title");
		if (String.format(title).length > 30) title = title.substring(0,27)+"...";
		actionBar.title = "Expense List"; //title;
		actionBar.subtitle = title;
		$.actionTitle.text = "Expense List";
		$.actionSubtitle.text = title;
		$.total.text = "Rp." + String.formatDecimal(data.get("total")); // +" IDR";; //data.get("total");
		activity.invalidateOptionsMenu();
	}
	
	showList(e);
	var isopen = data.get('status') == STATUSCODE[Const.Open];
	$.editMenu.visible = isopen;
	$.addNewButton.visible = isopen;
	$.submitBtn.visible = isopen;
}

function windowClose(e) {
	if (data) {		
		//-- start update parent
		var details = reimburseDetails.where({
			isDeleted : 0,
			reimburseId : args.id
		});

		var first_receipt_original_url = null;
		var first_receipt_mini_url = null;
		var total = 0;
		for (var i in details) {
			if (i == 0) {
				first_receipt_original_url = details[i].get("urlImageOriginal");
				first_receipt_mini_url = details[i].get("urlImageSmall");
			}
			total += parseFloat(details[i].get("amount"));
		}

		data.set({
			"total" : parseFloat(total),
			"first_receipt_original_url" : first_receipt_original_url,
			"first_receipt_mini_url" : first_receipt_mini_url,
			//IsSync: 0,
		});
		data.save();
		data.fetch({
			remove : false
		});
		//-- end update parent

		Alloy.Globals.reimburseListReimburse.fetch({remove:false});
		Alloy.Globals.scrollableView.views[1].fireEvent("open", e);
		Alloy.Globals.index.fireEvent("refresh", {param:{remove:false/*, query:"SELECT * FROM reimburse WHERE id="+args.id*/}});
		$.destroy();
		data = null;
		reimburseDetails = null;
		reimburses = null;
		details = null;
	}
}

function doBack(evt) {// what to do when the "home" icon is pressed
	Ti.API.info("Home icon clicked!");
	$.reimburseDetailList.fireEvent('android:back', evt);
}


function dialogViewClick(e) {
    $.dialogView2.hide(); //visible = false;
}

function submitViewClick(e) {
    $.submitDialog.hide(); //visible = false;
}

function dialogSendClick(e) {
    sendReimburse(args.id, function(result) {
    	
    }); 
}

function newDetailClick(e) {
	Alloy.createController("reimburseDetailForm", {reimburseId : args.id, id : null}).getView().open();
}

function doEdit(e) {
	var newview = Alloy.createController("reimburseForm", {id : args.id}).getView(); //.open();
	Alloy.Globals.dialogView2.removeAllChildren();
	Alloy.Globals.dialogView2.add(newview);
	newview.fireEvent("open");
}

// confirm
function sendReimburse(id, callback) {
	// find by id
	Ti.UI.Android.hideSoftKeyboard();
	var reimburse = reimburses.get(id);
	if (reimburseDetails.length > 0) {
		var foundUnsync = reimburseDetails.find(function(mdl){
			return (mdl.get('isSync') == 0); // && (mdl.get('reimburseId') == id);
		});
		if (foundUnsync || Alloy.Globals.Uploading > 0) {
			if (Alloy.Globals.CURRENT_USER && Alloy.Globals.CURRENT_USER != "") {
				enqueueUniqueDetails(reimburse.toJSON());
			}
			alert("Data are not fully synchronized yet!\nPlease wait a moment.");
		} else {	
			var tolist = string2array($.toField.value);
			var cclist = string2array($.ccField.value);
			var bcclist = string2array($.bccField.value);
			if (tolist == null)
				tolist = [];
			if (cclist == null)
				cclist = [];
			if (bcclist == null)
				bcclist = [];
			$.act.show();
			remoteReimburse.sendObject(reimburse.get('gid'), tolist, cclist, bcclist, function(result) {
				if (result.error) {
					alert(result.error);
				} else {
					// TODO: update detail's status
					reimburse.set({
						"status" : result.status, //STATUSCODE[result.isSent ? Const.Pending : Const.Open],
						isSent : result.isSent,
						sentDate : result.sentDate,
						sentTo : result.sentTo,
					});
					reimburse.save();
					
					reimburse.fetch({
						remove : false
					});
					
					if (result.isSent) {//&& Alloy.Globals.gcmRegId
						// libgcm.sendGCM([Alloy.Globals.gcmRegId], {
						// title : "Pending Approval ID:" + reimburse.get('gid'),
						// message : "You have new pending Reimburse Approval Titled:'" + reimburse.get('title') + "' from '" + Alloy.Globals.CURRENT_USER + "'",
						// date : reimburse.get('sentDate'), //moment().toISOString(),
						// type : "submit",
						// id : reimburse.get('gid'),
						// }, function(ret) {
						// if (ret.error)
						// alert("Error : " + ret.error);
						// });
						notifBox("Reimburse has been successfully Submitted.");
						$.submitDialog.hide();
						$.reimburseDetailList.close();
					}
				}
				$.act.hide();
			}); 
		}
	} else {
		alert("You don't have any Expense!");
	}
	return reimburse;
}

function doSubmit(e) {
	$.submitDialog.show();
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
		reimburseId : parseInt(args.id) //id need to be integer/can't auto cast?
	});
	if (!ret)
		ret = [];
	return ret;
}

function transformFunction(model) {
	var transform = model.toJSON(); 
	transform.status = DETAILSTATUS[transform.status];
	transform.receiptDate = moment.parseZone(transform.receiptDate).local().format("DD-MM-YYYY"); //dateFormat
	transform.amount = "Rp." + String.formatDecimal(transform.amount); // +" IDR";
	if (transform.name && String.format(transform.name).length > 23)
		transform.name = transform.name.substring(0, 20) + "...";
	return transform;
}


// Show task list based on selected status type
function showList(e) {
	var foundUnsync = reimburseDetails.find(function(mdl){
		return mdl.get('isSync') == 0;
	});
	// don't fetch data from server if newly created local record hasn't been fully synced (in middle of sync), otherwise new record could be duplicated
	if (!foundUnsync) {	
		$.act.show();
		remoteReimburseDetail.getDetailList(data.get('gid'), "updated_at", "desc", 0, 20, null, null, null, function(ret) {
			if (!ret.error) {
				for (var key in ret) {
					//localReimburseDetail.addOrUpdateDetailObject(ret[key]); //will overwrite local data with server data regardless which one newer
					var obj = ret[key];
					obj.reimburseId = args.id;
					var found = reimburseDetails.find(function(mdl) {
						return mdl.get('gid') == obj.gid;
					});
					if (!found) {
						localReimburseDetail.addDetailObject(obj);
					} else if (found.get('lastUpdate') < obj.lastUpdate) {
						localReimburseDetail.updateDetailObject(obj);
					}
					;
				}
				reimburseDetails && reimburseDetails.fetch({
					remove : false,
					query : "SELECT * FROM reimburseDetail WHERE isDeleted=0 and reimburseId=" + args.id
				});
			} else {
				notifBox(ret.error);
			}
			$.act.hide();
		}); 
	}
	reimburseDetails && reimburseDetails.fetch({remove:false, query:"SELECT * FROM reimburseDetail WHERE isDeleted=0 and reimburseId="+args.id}); //fetch(e.param ? e.param : {remove:false});
}

$.reimburseDetailList.addEventListener('refresh', function(e) {
	showList(e);
});

$.reimburseDetailList.addEventListener("android:back", function(e) {
	if ($.dialogView2.visible) {
		$.dialogView2.hide();
	} else if($.submitDialog.visible) {
		$.submitDialog.hide();
	} else {
		$.reimburseDetailList.close(e);
	}
});
