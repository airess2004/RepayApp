var args = arguments[0] || {};

var moment = require('alloy/moment');
//var reimburses = Alloy.Globals.homeListReimburse; //Alloy.Collections.reimburse; //
var reimburseDetails_ass = $.localReimburseDetail_ass; //Alloy.Collections.reimburseDetail; //
//$.localReimburseDetail = Alloy.Globals.homeListReimburseDetail;
//reimburseDetails && reimburseDetails.fetch({remove: false});
//Alloy.Globals.homeListReimburseDetail = $.localReimburseDetail;
var id;
var gid;

// Sort Descending
// reimburseDetails.comparator = function(model) {
  // return -(moment.parseZone(model.get('receiptDate')).unix());
// };
//reimburseDetails.sort();

function whereFunction(collection) {
	if (!$.homeReimburseRow.rowgid) alert("invalid gid : "+gid);
	var ret = collection.where({
		//isDeleted : 0,
		reimburseGid : $.homeReimburseRow.rowgid
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
	transform.status = transform.isRejected == true ? Const.Rejected : Const.Approved;
	transform.urlImageOriginal = transform.urlImageOriginal || "/icon/thumb_receipt.png"; //"/icon/ic_receipt.png";
	transform.urlImageSmall = transform.urlImageSmall || "/icon/thumb_receipt.png"; //"/icon/ic_receipt.png";
	transform.receiptDate = moment.parseZone(transform.receiptDate).local().format(dateFormat);
	transform.amount = "Rp." + String.formatDecimal(transform.amount);// + " IDR";
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
	//if ($model.get('isDeleted') == 0) 
	{
		//$.homeReimburseRow.backgroundColor = STATUSCODE_COLOR[status];
		//$.innerView.backgroundColor = 'lightgray';
		// $.approveBtn.backgroundColor = STATUSCODE_COLOR[status];
		// $.approveBtn.touchEnabled = (status == STATUSCODE[Const.Pending]); //Pending
		// $.approveBtn.text = ($.approveBtn.touchEnabled) ? "CONFIRM" : STATUS[status];
		// $.approveBtn.borderRadius = (status == STATUSCODE[Const.Pending]) ? "8dp" : 0;
		$.innerView.touchEnabled = (status == STATUSCODE[Const.Pending]);
		$.bottomView.touchEnabled = $.innerView.touchEnabled;
		$.confirmBtn.touchEnabled = (status == STATUSCODE[Const.Pending]); //Pending
		$.confirmBtn.backgroundColor = ($.confirmBtn.touchEnabled) ? Alloy.Globals.lightColor : Alloy.Globals.darkColor;
		$.confirmBtn.text = ($.confirmBtn.touchEnabled) ? "CONFIRM" : STATUS[status];
		//$.avatar.image = '/tick_64.png';
	} 
	// wait for parent id to be available before fetching details
	reimburseDetails_ass && reimburseDetails_ass.fetch({remove:false, query:"SELECT * FROM reimburseDetail_ass WHERE reimburseGid="+$model.get('reimburse_gid')});
}

// reimburses.on('change:status', function(e){
 	// // custom function to update the content on the view
 	// // var status = e.source.get('status');
    // // $.homeReimburseRow.backgroundColor = STATUSCODE_COLOR[status];
	// // $.innerView.backgroundColor = 'lightgray';
	// // $.approveBtn.backgroundColor = STATUSCODE_COLOR[status];
	// // $.approveBtn.touchEnabled = (status == STATUSCODE[Const.Pending]);
	// // $.approveBtn.text = ($.approveBtn.touchEnabled) ? "APPROVE" : STATUS[status];
	// // $.innerView.touchEnabled = $.approveBtn.touchEnabled;
// });
// 
// reimburses.on('change', function(e){
	// //reimburses.fetch({remove: false});
// });

// toggle the "done" status of the IDed todo
// function toggleStatus(e) {
	// // find the todo task by id
	// var todo = todos.get(id);
// 
	// // set the current "done" and "date_completed" fields for the model,
	// // then save to presistence, and model-view binding will automatically
	// // reflect this in the tableview
	// todo.set({
		// "done": todo.get('done') ? 0 : 1,
		// "date_completed": moment().unix()
	// }).save();
// }

function thumbPopUp(e) {
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
		image: $.avatar.imageOri,
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
	// find the todo task by id
	var reimburse = Alloy.Globals.homeListReimburse_ass.get(id);

	// destroy the model from persistence, which will in turn remove
	// it from the collection, and model-view binding will automatically
	// reflect this in the tableview
	// var dets = reimburseDetails.where({
		// isDeleted : 0,
		// reimburseId : $.homeReimburseRow.rowid
	// });
	// if (!dets) dets = [];
	// TODO: update detail's status
	reimburseDetails_ass && reimburseDetails_ass.fetch({remove:false, query:"SELECT * FROM reimburseDetail_ass WHERE reimburseGid="+reimburse.get('gid')});
	var rejectedDetails = reimburseDetails_ass.where({isRejected:1});
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
			// reimburse.save(null, {
			// success: function(model, resp){
			// alert("Success saving.");
			// },
			// error: function(model, resp) {
			// alert("Error saving!");
			// }
			// });
			reimburse.fetch({
				remove : false
			});
			//reimburses.fetch({remove: false});
			//reimburseDetails && reimburseDetails.fetch({remove:false, query:"SELECT * FROM reimburseDetail WHERE isDeleted=0 and reimburseId="+id});
			if (result.isDone && Alloy.Globals.gcmRegId) {
				// libgcm.sendGCM([Alloy.Globals.gcmRegId], {
					// title : "Reimburse ID:" + reimburse.get('reimburse_gid'),
					// message : "Reimburse Titled:'" + reimburse.get('reimburse_title') + "' has been approved by '" + Alloy.Globals.CURRENT_USER + "'",
					// date : reimburse.get('reimburse_confirmed_at'), //moment().toISOString(),
				// }, function(ret) {
					// if (ret.error)
						// alert("Error : " + ret.error);
				// });
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
		if (!id) {
			id = e.source.parent.parent.rowid;
			gid = e.source.parent.parent.rowgid;
		}
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


