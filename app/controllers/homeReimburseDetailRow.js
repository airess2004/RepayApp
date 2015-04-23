var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburseDetails = Alloy.Collections.reimburseDetail;
var comments = Alloy.Collections.comment;

var id;

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id = $model.id;
	$.homeReimburseDetailRow.rowid = $model.id;
	var status = $model.get('status');
	$.homeReimburseDetailRow.title = $model.get('title');
	$.commentLabel.text = comments.where({reimburseDetailId : id}).length;
	if ($model.get('isDeleted') == 0) {
		$.homeReimburseDetailRow.backgroundColor = STATUSCODE_COLOR[status];
		$.innerView.backgroundColor = 'lightgray';
		$.status.backgroundColor = STATUSCODE_COLOR[status];
		//$.avatar.image = '/tick_64.png';
	} else {
		$.homeReimburseDetailRow.backgroundColor = status == 0 ? 'red' : 'purple';
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
	
}

function rowClick(e) {
	id = e.source.parent.rowid;
	Alloy.createController("comment",{
					id : id , reimburseId : null
				}
	).getView().open();
}

function rowLongClick(e) {
	id = e.source.parent.rowid;
	//$.deleteDialog.show();
}

