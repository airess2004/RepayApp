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
	var email = $model.get('email');
	var isowner = ((email ? email.trim().toUpperCase() : "") == Alloy.Globals.CURRENT_USER);
	$.avatarView.left = isowner ? null : "0";
	$.avatarView.right = isowner ? "0" : null;
	$.username.left = isowner ? null : "0";
	$.username.right = isowner ? "0" : null;
	$.message.left = isowner ? "0" : "56dp";
	$.message.right = isowner ? "56dp" : "0";
	$.message.textAlign = isowner ? Titanium.UI.TEXT_ALIGNMENT_RIGHT : Titanium.UI.TEXT_ALIGNMENT_LEFT;
	$.commentDate.left = isowner ? "0" : "56dp";
	$.commentDate.right = isowner ? "56dp" : "0";
	$.commentDate.textAlign = isowner ? Titanium.UI.TEXT_ALIGNMENT_RIGHT : Titanium.UI.TEXT_ALIGNMENT_LEFT;
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
		//width: "512dp",
		height : "512dp",
		touchEnabled: false,
		image: $.avatar.imageOri,
	}));
	
	Alloy.Globals.dialogView3.removeAllChildren();
	Alloy.Globals.dialogView3.add(aview);
	Alloy.Globals.dialogView3.show();
}


