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
	$.reimburseRow.title = $model.get('title') + " " + STATUS[$model.get('status')] + " " + $model.get('total') + " " + $model.get('projectDate');
	if ($model.get('isDeleted') == 0) {
		//$.reimburseRow.backgroundColor = STATUSCODE_COLOR[status];
		//$.innerView.backgroundColor = 'lightgray';
		$.status.backgroundColor = STATUSCODE_COLOR[status];
		//$.avatar.image = '/tick_64.png';
	} else {
		//$.reimburseRow.backgroundColor = status == 0 ? 'red' : 'purple';
		//$.innerView.backgroundColor = 'white';
		$.status.backgroundColor = status == 0 ? 'red' : 'purple';
		//$.avatar.image = '/tick_64.png';
	}
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
	var reimburse = reimburses.get(id);

	// destroy the model from persistence, which will in turn remove
	// it from the collection, and model-view binding will automatically
	// reflect this in the tableview
	reimburse.destroy();
	reimburse = null;
	reimburses = null;
}

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

Alloy.Globals.rowClickUsed = false;
function rowClick(e) {
	if (!Alloy.Globals.rowClickUsed) {
		Alloy.Globals.rowClickUsed = true;
		id = e.source.parent.rowid;
		var detList = Alloy.createController("reimburseDetailList",{
			id : id,
			"$model": $model
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
		id = e.source.parent.rowid;
		
		var deleteDialog = Ti.UI.createAlertDialog({
			title : "Confirm",
			message : "Are you sure you want to delete this record?",
			buttonNames : ["Yes", "No"],
			cancel : 1
		});
		deleteDialog.addEventListener('click', doDeleteClick);

		deleteDialog.rowid = id;
		deleteDialog.show({modal:true});
	}
}
