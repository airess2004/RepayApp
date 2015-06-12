var args = arguments[0] || {};

var moment = require('alloy/moment');
//Alloy.Globals.homeListReimburse_ass might not be existed yet at this point, since parent controller is created after all it's childens are created
//var reimburses_ass = Alloy.Collections.reimburse_ass; //Alloy.Globals.homeListReimburse_ass; //
var reimburseDetails_ass = Alloy.Collections.reimburseDetail_ass; //args.detailList; //$.localReimburseDetail; //Alloy.Globals.homeListReimburseDetail; //
//var comments = Alloy.Collections.comment;
//reimburseDetails && reimburseDetails.fetch({remove: false});
//comments && comments.fetch({remove: false});

var id;
var gid;
var reimburse;

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
	$.switchBtn.value = (status < DETAILSTATUSCODE[Const.Rejected]);
	updateSwitch($.switchBtn, $.switchBtn.value);
	$.switchBtn.touchEnabled = true; //(parentstatus <= STATUSCODE[Const.Pending]);
} else {
	$model = null;
}

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

function fullClick(e) {
	var view = e.source;
    var img = e.source.children[0];
    view.width = undefined;
    view.height = Ti.UI.FILL;
    img.height = Ti.UI.FILL;
    img.enableZoomControls = true;
}

function thumbPopUp(e) {
	if (e.section) {
		var listItem = e.section.items[e.itemIndex];
		var ar = e.bindId.split("_");
		var prx = "_"+ar[1]+"_"+ar[2]+"_";
	}
	var aview = Ti.UI.createView({
		width : "256dp",
		height : "256dp",
		backgroundColor : "#7777",
		borderColor : Alloy.Globals.lightColor,
		borderWidth : "1dp",
		touchEnabled: true,
		bubbleParent: false,
	}); 
	aview.addEventListener("click", fullClick);
	
	aview.add(Ti.UI.createImageView({
		//width: "512dp",
		height : "512dp",
		touchEnabled: false,
		image: ($.avatar && $.avatar.imageOri) || listItem[prx+"avatar"].imageOri,
	}));
	
	Alloy.Globals.dialogView.removeAllChildren();
	Alloy.Globals.dialogView.add(aview);
	Alloy.Globals.dialogView.show();
}

function rowClick(e) {
	id = e.source.parent.rowid;
	gid = e.source.parent.rowgid;
	if (!id) {
		if (e.section) {
			var listItem = e.section.items[e.itemIndex];
			var reimburseAssId = parseInt(e.itemId);
			var ar = e.bindId.split("_");
			var prx = "_"+ar[1]+"_"+ar[2]+"_";
			var detItem = listItem[prx+"homeReimburseDetailRow"];
			id = parseInt(detItem.itemId);
			$model = reimburseDetails_ass.get(id);
			$model.fetch({id: id});
			gid = $model.get('gid');
		}
	}
	Alloy.createController("comment",{
					id : id , 
					gid : gid,
					reimburseId : $model.get('reimburseId'),
					reimburseGid : $model.get('reimburseGid'),
					"$model": $model,
					section: e.section,
					itemIndex: e.itemIndex,
					dataItem: listItem,
					prefix: prx,
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
	sw.applyProperties(style); //BUG on tableView? seems to cause other row's switch background to be changing on the first 3 rows, triggering some other's switch change event
}

Alloy.Globals.toggleUsed = false;
function switchChange(e) {
	if (!Alloy.Globals.toggleUsed) {
		Alloy.Globals.toggleUsed = true;
		if (e.section) {
			var listItem = e.section.items[e.itemIndex];
			var reimburseAssId = parseInt(e.itemId);
			var ar = e.bindId.split("_");
			var prx = "_"+ar[1]+"_"+ar[2]+"_";
			var detItem = listItem[prx+"homeReimburseDetailRow"];
			id = parseInt(detItem.itemId);
			$model = reimburseDetails_ass.get(id);
			$model.fetch({id: id});
		}
		if (($.switchBtn && $.switchBtn.touchEnabled) || listItem[prx+"switchBtn"].touchEnabled) { //switchBtn
			var reimburseDetail = reimburseDetails_ass.get(id);
			reimburseDetail.fetch({id: id});
			reimburse = /*Alloy.Globals.homeListReimburse_ass*/Alloy.Collections.reimburse_ass.find(function(mdl) {
				return mdl.get('reimburse_gid') == reimburseDetail.get('reimburseGid');
			}); 
			reimburse.fetch({id: reimburse.get('id')});
			var status = STATUSCODE[reimburse.get('reimburse_is_confirmed') == true ? Const.Closed : Const.Pending]; //reimburse.get('status');
			if (status <= STATUSCODE[Const.Pending]) {
				Alloy.Globals.act.show({modal:true});
				var val = false;
				if ($.switchBtn) {
					$.switchBtn.value = !$.switchBtn.value;
					updateSwitch($.switchBtn, $.switchBtn.value);
					val = $.switchBtn.value;
				} else 
				if (listItem) {
					listItem[prx+"switchBtn"].value = !listItem[prx+"switchBtn"].value;
					val = listItem[prx+"switchBtn"].value;
				}

				reimburseDetail.save({
					"isRejected" : (!val) ? 1 : 0, 
					"isSync" : 0,
				}, {success :function(mdl){
					var detObj = Alloy.Globals.homeDetTransFunc && Alloy.Globals.homeDetTransFunc(mdl);
					if (listItem) {
						listItem[prx+"switchBtn"]= detObj.switchBtn;
					}
					
					var amount = parseFloat(mdl.get('amount'));
					
					var newTotal = parseFloat(reimburse.get('reimburse_total_approved')) + (mdl.get('isRejected') ? -amount : amount);
					
					reimburse.save({
						"reimburse_total_approved" : newTotal,
						"isSync" : 0,
					}, {success :function(parmdl){
						
						var obj = Alloy.Globals.homeTransFunc && Alloy.Globals.homeTransFunc(parmdl);
						if (listItem) {
							listItem["total"].text = obj.total;
						}
						
						e.section && e.section.updateItemAt(e.itemIndex, listItem);
						Alloy.Globals.homeListReimburse_ass.fetch({remove:false});
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

