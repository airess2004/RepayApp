var args = arguments[0] || {};

var moment = require('alloy/moment');
//var reimburses = Alloy.Globals.homeListReimburse; //Alloy.Collections.reimburse; //
var reimburseDetails_ass = $.localReimburseDetail_ass; //Alloy.Collections.reimburseDetail_ass; //  
//$.localReimburseDetail = Alloy.Globals.homeListReimburseDetail;
//reimburseDetails_ass && reimburseDetails_ass.fetch({remove: false});
//Alloy.Globals.homeListReimburseDetail = $.localReimburseDetail;

var id;
var gid;

var section;
var itemIndex;

function whereFunction(collection) {
	if (!$.homeReimburseRow.rowgid) alert("invalid gid : "+gid);
	var ret = collection.where({
		//isDeleted : 0,
		reimburseGid : $.homeReimburseRow.rowgid
	});
	if (!ret)
		ret = [];
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
	transform.status = transform.isRejected == true ? Const.Rejected : Const.Approved;
	transform.urlImageOriginal = transform.urlImageOriginal || "/icon/thumb_receipt.png"; //"/icon/ic_receipt.png";
	transform.urlImageSmall = transform.urlImageSmall || "/icon/thumb_receipt.png"; //"/icon/ic_receipt.png";
	transform.receiptDate = moment.parseZone(transform.receiptDate).local().format(dateFormat);
	transform.amount = "Rp." + String.formatDecimal(transform.amount);// + " IDR";
	//transform.detailList = $.localReimburseDetail_ass;
	if (transform.name && String.format(transform.name).length > 25)
		transform.name = transform.name.substring(0, 22) + "...";
	return transform;
}

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id =  $model.id;
	gid = $model.get('reimburse_gid'); //'gid'
	$.homeReimburseRow.rowid = id;
	$.homeReimburseRow.rowgid = gid;
	var status = STATUSCODE[$model.get('reimburse_is_confirmed') == true ? Const.Closed : Const.Pending];
	$.homeReimburseRow.title = $model.get('reimburse_title') + " " + STATUS[status] + " " + $model.get('reimburse_total_approved') + " " + $model.get('reimburse_application_date');
	
	$.innerView.touchEnabled = (status == STATUSCODE[Const.Pending]);
	$.bottomView.touchEnabled = $.innerView.touchEnabled;
	$.confirmBtn.touchEnabled = (status == STATUSCODE[Const.Pending]); //Pending
	$.confirmBtn.backgroundColor = ($.confirmBtn.touchEnabled) ? Alloy.Globals.lightColor : Alloy.Globals.darkColor;
	$.confirmBtn.text = ($.confirmBtn.touchEnabled) ? "CONFIRM" : STATUS[status];
		
	// wait for parent id to be available before fetching details
	reimburseDetails_ass && reimburseDetails_ass.fetch({remove:false, query:"SELECT * FROM reimburseDetail_ass WHERE reimburseGid="+$model.get('reimburse_gid')});
} else {
	var $model = null;
	if (!reimburseDetails_ass) reimburseDetails_ass = Alloy.createCollection('reimburse_ass');
}

function thumbPopUp(e) {
	if (e.section) {
		var listItem = e.section.items[e.itemIndex];
	}
	var aview = Ti.UI.createView({
		width : "256dp",
		height : "256dp",
		backgroundColor : "#7777",
		borderColor : Alloy.Globals.lightColor,
		borderWidth : "1dp",
		touchEnabled: false,
	}); 
	aview.add(Ti.UI.createImageView({
		//width: "512dp",
		height : "512dp",
		touchEnabled: false,
		image: ($.avatar && $.avatar.imageOri) || listItem.avatar.imageOri,
	}));
	
	Alloy.Globals.dialogView.removeAllChildren();
	Alloy.Globals.dialogView.add(aview);
	Alloy.Globals.dialogView.show();
}

function rowClick(e) {
	id = e.source.parent.rowid;
	gid = e.source.parent.rowgid;
	
}

// confirm
function approveReimburse(id) {
	var dataItem = section && section.items[itemIndex];
	// find the todo task by id
	var reimburse = Alloy.Globals.homeListReimburse_ass.get(id);
	reimburse.fetch({id: id});
	
	// TODO: update detail's status
	var reimburseGid = reimburse.get('reimburse_gid'); //'gid'
	reimburseDetails_ass && reimburseDetails_ass.fetch({remove:false, query:"SELECT * FROM reimburseDetail_ass WHERE reimburseGid="+reimburseGid});
	var rejectedDetails = reimburseDetails_ass.where({isRejected:1, reimburseGid:reimburseGid});
	if (!rejectedDetails) rejectedDetails = [];
	var rejectedlist = [];
	rejectedDetails.forEach(function(det){
		rejectedlist.push(det.get('gid'));
	});
	remoteReimburse.confirmObject(reimburse.get('reimburse_gid'), rejectedlist, function(result) {
		if (result.error) {
			alert(result.error);
		} else {
			reimburse.set({
				"reimburse_is_confirmed" : result.isDone,
				reimburse_confirmed_at : result.doneDate,
			});
			reimburse.save();
			
			reimburse.fetch({
				id: id, //remove : false
			});
			
			if (result.isDone ) { //&& Alloy.Globals.gcmRegId
				// libgcm.sendGCM([Alloy.Globals.gcmRegId], {
					// title : "Reimburse ID:" + reimburse.get('reimburse_gid'),
					// message : "Reimburse Titled:'" + reimburse.get('reimburse_title') + "' has been approved by '" + Alloy.Globals.CURRENT_USER + "'",
					// date : reimburse.get('reimburse_confirmed_at'), //moment().toISOString(),
					// type : "confirm",
					// id : reimburse.get('reimburse_gid'),
				// }, function(ret) {
					// if (ret.error)
						// alert("Error : " + ret.error);
				// });
				var obj = Alloy.Globals.homeTransFunc && Alloy.Globals.homeTransFunc(reimburse);
				if (dataItem) {
					dataItem["innerView"].touchEnabled = obj.innerView_touchEnabled;
					dataItem["bottomView"].touchEnabled = obj.bottomView_touchEnabled;
					dataItem["confirmBtn"]= obj.confirmBtn;
				}
				section && section.updateItemAt(itemIndex, dataItem);
				notifBox("Reimburse has been successfully Confirmed.");
			}
		}
	});
	
	return reimburse;
}

function doApproveClick(e){
	if (e.index == 0) {
		// prevent bubbling up to the row
		e.cancelBubble = true;
    	approveReimburse(e.source.rowid);
	}
	Alloy.Globals.approveBtnUsed = false;
};

Alloy.Globals.approveBtnUsed = false;
function approveBtnClick(e) {
	if (!Alloy.Globals.approveBtnUsed) {
		Alloy.Globals.approveBtnUsed = true;
		id = e.source.parent.rowid;
		gid = e.source.parent.rowgid;
		if (!id && e.source.parent.parent) {
			id = e.source.parent.parent.rowid;
			gid = e.source.parent.parent.rowgid;
		}
		// for listview
		if (!id) {
			section = e.section;
			itemIndex = e.itemIndex;
			var listItem = e.section.items[e.itemIndex];
			id = parseInt(e.itemId);
			$model = Alloy.Globals.homeListReimburse_ass.get(id);
			$model.fetch({id: id});
			gid = $model.get('gid');
			//reimburseDetails_ass && reimburseDetails_ass.fetch({remove:false, query:"SELECT * FROM reimburseDetail_ass WHERE reimburseGid="+$model.get('reimburse_gid')});
		}
		
		if (!$model.get('reimburse_is_confirmed')) {
			// Creates AlertDialog on-the-fly to prevent crashing issue when showing alertdialog created in XML
			var approveDialog = Ti.UI.createAlertDialog({
				title : "Confirm",
				message : "Are you sure you want to approve/reject marked receipts?",
				buttonNames : ["Yes", "No"],
				cancel : 1
			});
			approveDialog.addEventListener('click', doApproveClick);

			approveDialog.rowid = id;
			//approveDialog.rowgid = gid;
			approveDialog.show({modal:true}); //Bug: this may crash app sometimes when creating AlertDialog in XML (or using local Collection?)
		}
	}
}


