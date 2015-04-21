var args = arguments[0] || {};

var moment = require('alloy/moment');
var reimburses = Alloy.Collections.reimburse;
var id;

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id = $model.id;
	if ($model.get('isDeleted')) {
		$.reimburseRow.backgroundColor = $model.status == 0 ? '#0be' : 'lightgray';
		$.innerView.backgroundColor = 'white';
		$.status.backgroundColor = $model.status == 0 ? '#0be' : 'lightgray';
		//$.avatar.image = '/tick_64.png';
	} else {
		$.reimburseRow.backgroundColor = $model.status == 0 ? 'red' : 'purple';
		$.innerView.backgroundColor = 'white';
		$.status.backgroundColor = $model.status == 0 ? 'red' : 'purple';
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
function deleteItem(e) {
	// prevent bubbling up to the row
	e.cancelBubble = true;

	// find the todo task by id
	var reimburse = reimburses.get(id);

	// destroy the model from persistence, which will in turn remove
	// it from the collection, and model-view binding will automatically
	// reflect this in the tableview
	reimburse.destroy();
}