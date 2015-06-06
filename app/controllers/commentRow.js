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
	//var avatarOri = $model.get('original_avatar_url');
	//var avatar = $model.get('mini_avatar_url');
	//if (avatar == "") avatar = null;
	//if (avatarOri == "") avatarOri = null;
	var isowner = ((email ? email.trim().toUpperCase() : "") == Alloy.Globals.CURRENT_USER);
	//$.avatar.imageOri = isowner ? (Alloy.Globals.profileImage == null) ? "/icon/ic_action_user.png" : Alloy.Globals.profileImage.image : avatarOri ? avatarOri : "/icon/ic_action_user.png";
	//$.avatar.image = isowner ? (Alloy.Globals.profileImage == null) ? "/icon/ic_action_user.png" : Alloy.Globals.profileImage.image : avatar ? avatar : "/icon/ic_action_user.png";
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
		//width: "512dp",
		height : "512dp",
		touchEnabled: false,
		image: $.avatar.imageOri,
	}));
	
	Alloy.Globals.dialogView3.removeAllChildren();
	Alloy.Globals.dialogView3.add(aview);
	Alloy.Globals.dialogView3.show();
}


