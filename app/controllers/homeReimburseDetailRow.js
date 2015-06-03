var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses_ass = Alloy.Collections.reimburse_ass; //Alloy.Globals.homeListReimburse; //
var reimburseDetails_ass = Alloy.Collections.reimburseDetail_ass; //$.localReimburseDetail; //Alloy.Globals.homeListReimburseDetail; //
//var comments = Alloy.Collections.comment;
//reimburseDetails && reimburseDetails.fetch({remove: false});
//comments && comments.fetch({remove: false});
var id;
var gid;

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id = $model.id;
	gid = $model.get('gid');
	$.homeReimburseDetailRow.rowid = id;
	$.homeReimburseDetailRow.rowgid = gid;
	var status = DETAILSTATUSCODE[$model.get('isRejected') == true ? Const.Rejected : Const.Approved];
	$.homeReimburseDetailRow.title = $model.get('name')+" "+$model.get('amount')+" "+moment.parseZone($model.get('receiptDate')).local().format(dateFormat);
	//comments && comments.fetch({remove:false, query:"SELECT * FROM comment WHERE reimburseDetailGid="+$model.get("gid")});
	$.commentLabel.text = $model.get('totalComments'); //comments.where({reimburseDetailId : id}).length;
	//if ($model.get('isDeleted') == 0) 
	{
		//$.homeReimburseDetailRow.backgroundColor = STATUSCODE_COLOR[status];
		//$.innerView.backgroundColor = 'lightgray';
		//$.status.backgroundColor = STATUSCODE_COLOR[status];
		//$.avatar.image = '/tick_64.png';
	} 
	// wait for parent id to be available before fetching details
	//comments && comments.fetch({remove: false});
	//$.switchBtn.removeEventListener("change", switchChange);
	//$.switchBtn.addEventListener("change", switchChange);
	if ($.switchBtn.value == null) $.switchBtn.value = (status < DETAILSTATUSCODE[Const.Rejected]);
	updateSwitch($.switchBtn, $.switchBtn.value);
	var reimburse = reimburses_ass.find(function(mdl) {
			return mdl.get('reimburse_gid') == $model.get('reimburseGid');
	}); //findWhere({reimburse_gid: $model.get('reimburseGid')}); //reimburses_ass.get($model.get('reimburseId'));
	//if (reimburse && reimburse.length > 0) reimburse = reimburse[0];
	var parentstatus = STATUSCODE[reimburse.get('reimburse_is_confirmed') == true ? Const.Closed : Const.Pending];
	$.switchBtn.touchEnabled = true; //(parentstatus <= STATUSCODE[Const.Pending]);
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
	var reimburseDetail = reimburseDetails_ass.get(id);

	// destroy the model from persistence, which will in turn remove
	// it from the collection, and model-view binding will automatically
	// reflect this in the tableview
	reimburseDetail.destroy();
	reimburseDetail = null;
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
		image: $.avatar.imageOri,
	}));
	
	Alloy.Globals.dialogView.removeAllChildren();
	Alloy.Globals.dialogView.add(aview);
	Alloy.Globals.dialogView.show();
}

function rowClick(e) {
	id = e.source.parent.rowid;
	gid = e.source.parent.rowgid;
	Alloy.createController("comment",{
					id : id , 
					gid : gid,
					reimburseId : $model.get('reimburseId'),
					reimburseGid : $model.get('reimburseGid'),
					"$model": $model
				}
	).getView().open();
}

function rowLongClick(e) {
	id = e.source.parent.rowid;
	gid = e.source.parent.rowgid;
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
			var reimburseDetail = reimburseDetails_ass.get(id);
			var reimburse = Alloy.Globals.homeListReimburse_ass.find(function(mdl) {
				return mdl.get('reimburse_gid') == reimburseDetail.get('reimburseGid');
			}); //findWhere({reimburse_gid: reimburseDetail.get('reimburseGid')});
			//if (reimburse && reimburse.length>0) reimburse = reimburse[0];
			var status = STATUSCODE[reimburse.get('reimburse_is_confirmed') == true ? Const.Closed : Const.Pending]; //reimburse.get('status');
			if (status <= STATUSCODE[Const.Pending]) {
				Alloy.Globals.act.show({modal:true});
				$.switchBtn.value = !$.switchBtn.value;
				updateSwitch($.switchBtn, $.switchBtn.value);

				// reimburseDetail.set({
					// "status" : DETAILSTATUSCODE[$.switchBtn.value ? Const.Approved : Const.Rejected]
				// });
				reimburseDetail.save({
					"isRejected" : !$.switchBtn.value, //DETAILSTATUSCODE[$.switchBtn.value ? Const.Approved : Const.Rejected],
					"isSync" : 0,
				}, {success :function(mdl){
					// mdl.fetch({
						// remove : false
					// });
					var amount = parseFloat(mdl.get('amount'));
					var reimburse = Alloy.Globals.homeListReimburse_ass.find(function(mdl2) {
						return mdl2.get('reimburse_gid') == mdl.get('reimburseGid');
					}); //findWhere({reimburse_gid: mdl.get('reimburseGid')});
					//if (reimburse && reimburse.length>0) reimburse = reimburse[0];
					// reimburse.set({
						// "total" : parseFloat(reimburse.get('total')) + ($.switchBtn.value ? amount : -amount)
					// });
					reimburse.save({
						"reimburse_total_approved" : parseFloat(reimburse.get('reimburse_total_approved')) + ($.switchBtn.value ? amount : -amount),
						"isSync" : 0,
					}, {success :function(parmdl){
						// parmdl.fetch({
							// remove : false
						// });
						Alloy.Globals.act.hide();
						Alloy.Globals.toggleUsed = false;
					}, error: function(){
						Alloy.Globals.act.hide();
						Alloy.Globals.toggleUsed = false;
					}});
					//Alloy.Globals.homeListReimburse.fetch({remove: false, query:"SELECT * FROM reimburse WHERE isDeleted=0 and status>="+STATUSCODE[Const.Open]});
				}, error: function(){
					Alloy.Globals.toggleUsed = false;
				}});
			} else {
				var switchDialog = Ti.UI.createAlertDialog({
					title : "Toggle",
					message : "Closed records can't be Changed!",
					buttonNames : ["OK"],
					cancel : 0
				});
				switchDialog.addEventListener('click', function(evt) {
					e.cancelBubble = true;
					Alloy.Globals.toggleUsed = false;
				});
				switchDialog.rowid = id;
				switchDialog.show({modal:true});
				//Alloy.Globals.toggleUsed = false;
			}
		} else {
			Alloy.Globals.toggleUsed = false;
		}
	}
}

