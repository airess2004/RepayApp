var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = Alloy.Collections.reimburse; //Alloy.Globals.homeListReimburse; //
var reimburseDetails = Alloy.Collections.reimburseDetail; //$.localReimburseDetail; //Alloy.Globals.homeListReimburseDetail; //
var comments = Alloy.Collections.comment;
//reimburseDetails && reimburseDetails.fetch({remove: false});
//comments && comments.fetch({remove: false});
var id;

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id = $model.id;
	$.homeReimburseDetailRow.rowid = $model.id;
	var status = $model.get('status');
	$.homeReimburseDetailRow.title = $model.get('title');
	comments && comments.fetch({remove:false, query:"SELECT * FROM comment WHERE reimburseDetailId="+id});
	$.commentLabel.text = comments.where({reimburseDetailId : id}).length;
	if ($model.get('isDeleted') == 0) {
		//$.homeReimburseDetailRow.backgroundColor = STATUSCODE_COLOR[status];
		//$.innerView.backgroundColor = 'lightgray';
		//$.status.backgroundColor = STATUSCODE_COLOR[status];
		//$.avatar.image = '/tick_64.png';
	} else {
		//$.homeReimburseDetailRow.backgroundColor = status == 0 ? 'red' : 'purple';
		//$.innerView.backgroundColor = 'white';
		//$.status.backgroundColor = status == 0 ? 'red' : 'purple';
		//$.avatar.image = '/tick_64.png';
	}
	// wait for parent id to be available before fetching details
	//comments && comments.fetch({remove: false});
	//$.switchBtn.removeEventListener("change", switchChange);
	//$.switchBtn.addEventListener("change", switchChange);
	if ($.switchBtn.value == null) $.switchBtn.value = (status < DETAILSTATUSCODE[Const.Rejected]);
	updateSwitch($.switchBtn, $.switchBtn.value);
	var reimburse = reimburses.get($model.get('reimburseId'));
	var parentstatus = reimburse.get('status');
	$.switchBtn.touchEnabled = (parentstatus <= STATUSCODE[Const.Pending]);
	//$.rightView.touchEnabled = $.switchBtn.touchEnabled;
}

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

// delete the IDed todo from the collection
function deleteItem(id) {
	// find the todo task by id
	var reimburseDetail = reimburseDetails.get(id);

	// destroy the model from persistence, which will in turn remove
	// it from the collection, and model-view binding will automatically
	// reflect this in the tableview
	reimburseDetail.destroy();
}

function doDeleteClick(e){
	if (e.index == 0) {
		// prevent bubbling up to the row
		e.cancelBubble = true;
    	deleteItem(id);
	}
};

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
		width: "256dp",
		height : "256dp",
		touchEnabled: false,
		image: $.avatar.image,
	}));
	
	Alloy.Globals.dialogView.removeAllChildren();
	Alloy.Globals.dialogView.add(aview);
	Alloy.Globals.dialogView.show();
}

function rowClick(e) {
	id = e.source.parent.rowid;
	Alloy.createController("comment",{
					id : id , reimburseId : null,
					"$model": $model
				}
	).getView().open();
}

function rowLongClick(e) {
	id = e.source.parent.rowid;
	//$.deleteDialog.show();
}

function updateSwitch(sw, val) {
	var style = $.createStyle({
		classes : ["switch"],
		apiName : 'Switch',
		//backgroundImage: val == false ? "/icon/sw_no.png" : "/icon/sw_yes.png",
		backgroundImage: val == false ? "/icon/sw_no.png" : "/icon/sw_yes.png",
	});
	sw.applyProperties(style); //bug? seems to cause other row's switch background to be changing on the first 3 rows, triggering some other's switch change event
}

Alloy.Globals.toggleUsed = false;
function switchChange(e) {
	if (!Alloy.Globals.toggleUsed) {
		Alloy.Globals.toggleUsed = true;
		if ($.switchBtn.touchEnabled) {
			var reimburseDetail = reimburseDetails.get(id);
			var reimburse = Alloy.Globals.homeListReimburse.get(reimburseDetail.get('reimburseId'));
			if (reimburse.get('status') <= STATUSCODE[Const.Pending]) {	
				$.switchBtn.value = !$.switchBtn.value;
				updateSwitch($.switchBtn, $.switchBtn.value);

				// reimburseDetail.set({
					// "status" : DETAILSTATUSCODE[$.switchBtn.value ? Const.Approved : Const.Rejected]
				// });
				reimburseDetail.save({
					"status" : DETAILSTATUSCODE[$.switchBtn.value ? Const.Approved : Const.Rejected]
				}, {success :function(mdl){
					mdl.fetch({
						remove : false
					});
					var amount = parseFloat(mdl.get('amount'));
					var reimburse = Alloy.Globals.homeListReimburse.get(mdl.get('reimburseId'));
					// reimburse.set({
						// "total" : parseFloat(reimburse.get('total')) + ($.switchBtn.value ? amount : -amount)
					// });
					reimburse.save({
						"total" : parseFloat(reimburse.get('total')) + ($.switchBtn.value ? amount : -amount)
					}, {success :function(parmdl){
						parmdl.fetch({
							remove : false
						});
						Alloy.Globals.toggleUsed = false;
					}, error: function(){
						Alloy.Globals.toggleUsed = false;
					}});
					//Alloy.Globals.homeListReimburse.fetch({remove: false, query:"SELECT * FROM reimburse WHERE isDeleted=0 and status>="+STATUSCODE[Const.Open]});
				}, error: function(){
					Alloy.Globals.toggleUsed = false;
				}});
			} else {
				Alloy.Globals.toggleUsed = false;
			}
		} else {
			Alloy.Globals.toggleUsed = false;
		}
	}
}

