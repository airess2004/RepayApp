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
	
	var isodd = ($model.get('userId') % 2) == 1;
	$.avatar.image = (isodd || Alloy.Globals.profileImage == null) ? "/icon/ic_action_user.png" : Alloy.Globals.profileImage.image;
	$.avatarView.left = isodd ? null : "0";
	$.avatarView.right = isodd ? "0" : null;
	$.username.left = isodd ? null : "0";
	$.username.right = isodd ? "0" : null;
	$.message.left = isodd ? "0" : "80dp";
	$.message.right = isodd ? "80dp" : "0";
	$.message.textAlign = isodd ? Titanium.UI.TEXT_ALIGNMENT_RIGHT : Titanium.UI.TEXT_ALIGNMENT_LEFT;
	$.commentDate.left = isodd ? "0" : "80dp";
	$.commentDate.right = isodd ? "80dp" : "0";
	$.commentDate.textAlign = isodd ? Titanium.UI.TEXT_ALIGNMENT_RIGHT : Titanium.UI.TEXT_ALIGNMENT_LEFT;
	
	// var avatar = $.createStyle({
		// classes : ["avatarView"],
		// apiName : 'View',
		// left: isodd ? null : "0",
		// right: isodd ? "0" : null,
	// });
	// $.avatarView.applyProperties(avatar);
	// var username = $.createStyle({
		// classes : ["username"],
		// apiName : 'Label',
		// left: isodd ? null : "0",
		// right: isodd ? "0" : null,
	// });
	// $.username.applyProperties(username);
	// var message = $.createStyle({
		// classes : ["message"],
		// apiName : 'Label',
		// left: isodd ? "0" : "80dp",
		// right: isodd ? "80dp" : "0",
		// textAlign: isodd ? Titanium.UI.TEXT_ALIGNMENT_RIGHT : Titanium.UI.TEXT_ALIGNMENT_LEFT,
	// });
	// $.message.applyProperties(message);
	// var date = $.createStyle({
		// classes : ["commentDate"],
		// apiName : 'Label',
		// left: isodd ? "0" : "80dp",
		// right: isodd ? "80dp" : "0",
		// textAlign: isodd ? Titanium.UI.TEXT_ALIGNMENT_RIGHT : Titanium.UI.TEXT_ALIGNMENT_LEFT,
	// });
	// $.commentDate.applyProperties(date);
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
	
	Alloy.Globals.dialogView3.removeAllChildren();
	Alloy.Globals.dialogView3.add(aview);
	Alloy.Globals.dialogView3.show();
}


