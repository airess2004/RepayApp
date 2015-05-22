var args = arguments[0] || {};
var moment = require('alloy/moment');
Alloy.Globals.cameraShown = false;

var reimburseDetails = Alloy.Collections.reimburseDetail;
var comments = Alloy.Collections.comment; //$.localComment; //
//var reimburses = Alloy.Collections.reimburse;

//reimburseDetails && reimburseDetails.fetch({remove: false});

var data;

if (args.id != null) {
	data = reimburseDetails.get(args.id);
}

comments && comments.fetch({remove:false, query:"SELECT * FROM comment WHERE reimburseDetailId="+args.id});

// Sort Descending
// comments.comparator = function(model) {
  // return -(moment.parseZone(model.get('commentDate')).unix());
// };
//comments.sort();

function winOpen(e) {
	Alloy.Globals.dialogView3 = $.dialogView3;
	if (data) {
		$.titleField.text = data.get('name');
		$.dateField.text = moment.parseZone(data.get('receiptDate')).local().format(dateFormat);
		$.amountField.text = "Rp." + String.formatDecimal(data.get('amount'));// + " IDR";
		$.descriptionField.text = data.get('description');
		$.photo.image = data.get('urlImageOriginal');
		// var activity = $.comment.getActivity();
		// if (activity) {
		// var actionBar = activity.getActionBar();
		// // get a handle to the action bar
		// var title = data.get("title");
		// if (String.format(title).length > 30)
		// title = title.substring(0, 27) + "...";
		// actionBar.title = args.title;
		// $.totalField.value = data.get("total");
		// }
		//comments && comments.fetch({remove: false});
	}
	$.actionTitle.text = "EXPENSE";
	$.commentField.blur();
	Ti.UI.Android.hideSoftKeyboard();
}

function winClose(e) {
	$.destroy();
	comments = null;
	reimburseDetails = null;
	//reimburses = null;
	if (data) {
		Alloy.Globals.index.fireEvent("refresh", {param:{remove:false/*, query:"SELECT * FROM reimburse WHERE id="+data.get("reimburseId")*/}});
		data = null;
	}
}

function doBack(evt) {// what to do when the "home" icon is pressed
	Ti.API.info("Home icon clicked!");
	$.comment.fireEvent('android:back', evt);
}

function whereFunction(collection) {
	var ret = collection.where({
		reimburseDetailId : args.id
	});
	if (!ret)
		ret = [];
	return ret;
}

function transformFunction(model) {
	var transform = model.toJSON();
	transform.commentDate = moment.parseZone(transform.commentDate).local().format("YYYY-MM-DD HH:mm:ss");
	return transform;
}

function newCommentClick(e) {
	if ($.commentField.value != null && String.format($.commentField.value).trim().length > 0) {
		var isodd = (comments.where({reimburseDetailId : args.id}).length % 2) == 1;
		var comment = Alloy.createModel('comment', {
			message : $.commentField.value,
			commentDate : moment().utc().toISOString(),
			userId : isodd ? 1 : 2,
			username : isodd ? "Adam" : "Johan",
			reimburseDetailId : args.id,
		});
		comments.add(comment);
		comment.save();
		// reload the tasks
		comment.fetch({remove: false});
	}
	$.commentField.value = "";
	Ti.UI.Android.hideSoftKeyboard();
}

function doMenuClick(evt) {
	switch(evt.source.title) {
	case "Menu":
		// in real life you probably wouldn't want to use the text of the menu option as your condition
		var activity = $.reimburseDetailForm.getActivity();
		activity.openOptionsMenu();
		break;
	default:
		alert(evt.source.title);
	}
}

function doSearch(e) {
	alert("Search Clicked");
}

function dialogViewClick(e) {
    $.dialogView3.hide(); //visible = false;
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
		image: $.photo.image,
	}));
	
	$.dialogView3.removeAllChildren();
	$.dialogView3.add(aview);
	$.dialogView3.show();
}

function photoClick(e) {
	if (!Alloy.Globals.cameraShown) {
		Alloy.Globals.cameraShown = true;
		var camera = require('camera').getImage(function(media) {
			if (media != null) {
				Ti.API.info("Click Image = " + media.nativePath);
				$.photo.image = media.nativePath;
				//media;
			}
			Alloy.Globals.cameraShown = false;
		});
		//cameraShown = false;
	}
}

$.comment.addEventListener("android:back", function(e) {
	//$.tableView.search = Alloy.Globals.searchView;
	//Alloy.Globals.index.activity.actionBar.title = "Reimburse Detail";
	$.comment.close(e);
});
