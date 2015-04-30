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
  // return -(moment.parseZone(model.get('commentsDate')).unix());
// };
//comments.sort();

function winOpen(e) {
	if (data) {
		$.titleField.text = data.get('name');
		$.dateField.text = moment.parseZone(data.get('receiptDate')).local().format("YYYY-MM-DD");
		$.amountField.text = data.get('amount');
		$.descriptionField.text = data.get('description');
		$.image.image = data.get('urlImageOriginal');
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

function newDetailClick(e) {
	if (String.format($.commentField.value).trim().length > 0) {
		var comment = Alloy.createModel('comment', {
			message : $.commentField.value,
			commentDate : moment().utc().toISOString(),
			userId : 1,
			username : "Johan",
			reimburseDetailId : args.id,
		});
		comments.add(comment);
		comment.save();
		$.commentField.value = "";
		// reload the tasks
		//comments.fetch({remove: false});
	}
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

function imageClick(e) {
	if (!Alloy.Globals.cameraShown) {
		Alloy.Globals.cameraShown = true;
		var camera = require('camera').getImage(function(media) {
			if (media != null) {
				Ti.API.info("Click Image = " + media.nativePath);
				$.image.image = media.nativePath;
				//media;
			}
			Alloy.Globals.cameraShown = false;
		});
		//cameraShown = false;
	}
}
