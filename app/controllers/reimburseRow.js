var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = Alloy.Globals.reimburseListReimburse; //Alloy.Collections.reimburse;
// fetch existing todo items from storage
//reimburses && reimburses.fetch({remove: false});

var id;

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id = $model.id;
	$.reimburseRow.rowid = $model.id;
	var status = $model.get('status');
	$.reimburseRow.title = $model.get('title') + " " + STATUS[$model.get('status')] + " " + $model.get('total') + " " + moment.parseZone($model.get('projectDate')).local().format(dateFormat);
	$.status.backgroundColor = STATUSCODE_COLOR[status];
	$.statusView.backgroundColor = $.status.backgroundColor;
}

// delete the IDed todo from the collection
function deleteItem(id) {
	var reimburses = Alloy.Globals.reimburseListReimburse; //Alloy.Collections.reimburse;
	// find by id
	var reimburse = reimburses.get(id);
	if (!reimburse) {
		alert("Record not found!");
	} else {
		remoteReimburse.deleteObject(reimburse.get('gid'), function(result) {
			if (result.error) {
				alert(result.error);
				// TODO : delete on local when no longer exist on server
				if (!result.message) {
					reimburse.destroy();
					reimburse = null;
					reimburses = null;
				}
			} else {
				// destroy the model from persistence, which will in turn remove
				// it from the collection, and model-view binding will automatically
				// reflect this in the tableview
				reimburse.destroy();
				reimburse = null;
				reimburses = null;
			}
		}); 
	}
}

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
		var item = e.section.items[e.itemIndex]; //$.avatar
	}
	var aview = Ti.UI.createView({
		width : "256dp",
		height : "256dp",
		backgroundColor : "#7000",
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
		image: ($.avatar && $.avatar.imageOri) || item.avatar.imageOri,
		autorotate: true,
	}));
	
	Alloy.Globals.dialogView.removeAllChildren();
	Alloy.Globals.dialogView.add(aview);
	Alloy.Globals.dialogView.show();
}

Alloy.Globals.rowClickUsed = false;
function rowClick(e) {
	if (!Alloy.Globals.rowClickUsed) {
		Alloy.Globals.rowClickUsed = true;
		id = parseInt(e.itemId);
		//id = e.source.parent.rowid;
		//id = $.reimburseRow.rowid;
		var reimburses = Alloy.Globals.reimburseListReimburse; //Alloy.Collections.reimburse;
		$model = reimburses.get(id);
		var detList = Alloy.createController("reimburseDetailList",{
			//"$model": $model,
			id : id,
		}).getView();
		detList.addEventListener("close", detListClose);
		detList.open();
		
		function detListClose(e) {
			this.removeEventListener("close", detListClose);
			Alloy.Globals.rowClickUsed = false;
			detList = null;
		}
	}
}

function doDeleteClick(e){
	if (e.index == 0) {
		// prevent bubbling up to the row
		e.cancelBubble = true;
    	deleteItem(e.source.rowid);
	}
	Alloy.Globals.rowLongClickUsed = false;
};

Alloy.Globals.rowLongClickUsed = false;
function rowLongClick(e) {
	if (!Alloy.Globals.rowLongClickUsed) {
		Alloy.Globals.rowLongClickUsed = true;
		id = parseInt(e.itemId);
		//id = e.source.parent.rowid;
		//id = $.reimburseRow.rowid;
		var reimburses = Alloy.Globals.reimburseListReimburse; //Alloy.Collections.reimburse;
		$model = reimburses.get(id);
		var status = $model.get('status');
		if (status == STATUSCODE[Const.Open]) {
			var deleteDialog = Ti.UI.createAlertDialog({
				title : "Confirm",
				message : "Are you sure you want to Delete this record?",
				buttonNames : ["Yes", "No"],
				cancel : 1
			});
			deleteDialog.addEventListener('click', doDeleteClick);

			deleteDialog.rowid = id;
			deleteDialog.show({modal:true});
		} else {
			var deleteDialog = Ti.UI.createAlertDialog({
				title : "Delete",
				message : "Pending/Closed records can't be Deleted!",
				buttonNames : ["OK"],
				cancel : 0
			});
			deleteDialog.addEventListener('click', function(evt) {
				e.cancelBubble = true;
				Alloy.Globals.rowLongClickUsed = false;
			});
			deleteDialog.rowid = id;
			deleteDialog.show({modal:true});
		}
	}
}
