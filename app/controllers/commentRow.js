var args = arguments[0] || {};

var moment = require('alloy/moment');
//var comments = Alloy.Collections.comment;
var id;

// $model represents the current model accessible to this
// controller from the markup's model-view binding. $model
// will be null if there is no binding in place.

if ($model) {
	id = $model.id;
	$.commentRow.rowid = $model.id;
}


function thumbPopUp(e) {
	
}


