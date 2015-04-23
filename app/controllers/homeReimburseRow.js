var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = Alloy.Collections.reimburse;
var id;

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id = $model.id;
	$.homeReimburseRow.rowid = $model.id;
	var status = $model.get('status');
	$.reimburseRow.title = $model.get('title') + " " + STATUS[$model.get('status')] + " " + $model.get('total') + " " + $model.get('projectDate');
	if ($model.get('isDeleted') == 0) {
		$.homeReimburseRow.backgroundColor = STATUSCODE_COLOR[status];
		$.innerView.backgroundColor = 'lightgray';
		$.status.backgroundColor = STATUSCODE_COLOR[status];
		//$.avatar.image = '/tick_64.png';
	} else {
		$.homeReimburseRow.backgroundColor = status == 0 ? 'red' : 'purple';
		$.innerView.backgroundColor = 'white';
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
function approveReimburse(id) {
	// find the todo task by id
	var reimburse = reimburses.get(id);

	// destroy the model from persistence, which will in turn remove
	// it from the collection, and model-view binding will automatically
	// reflect this in the tableview
	reimburse.set("status", STATUSCODE["Approved"]);
	reimburse.save();
}

function doApproveClick(e){
	if (e.index == 0) {
		// prevent bubbling up to the row
		e.cancelBubble = true;
    	approveReimburse(e.source.rowid);
	}
};

function thumbPopUp(e) {
	
}

function rowClick(e) {
	id = e.source.parent.rowid;
	Alloy.createController("reimburseDetailList",{
					id : id
				}
	).getView().open();
}

function rowLongClick(e) {
	// id = e.source.parent.rowid;
	// $.deleteDialog.rowid = id;
	// $.deleteDialog.show();
}

