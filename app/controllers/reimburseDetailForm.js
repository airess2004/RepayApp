var args = arguments[0] || {};
var moment = require('alloy/moment');
Alloy.Globals.cameraShown = false;

function winOpen(e) {

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

function doSave(e) {
	var reimburses = Alloy.Collections.reimburse;
	var reimburseDetails = Alloy.Collections.reimburseDetail;
	var reimburseDetail = Alloy.createModel("reimburseDetail", {
		reimburseId : args.reimburseId,
		name : $.titleField.value,
		description : $.descriptionField.value,
		receiptDate : moment($.dateField.value).utc().toISOString(),
		isDeleted : 0,
		amount :  parseFloat($.amountField.value),
		urlImageOriginal : $.image.image

	});

	reimburseDetail.save();
	reimburseDetails.add(reimburseDetail);
	var detail = reimburseDetails.where({
		isDeleted : 0,
		reimburseId : args.reimburseId
	});
	
	var total = 0 ;  
	
	if (detail != null) {
		_.each(detail,function(model) {
			total += parseFloat(model.amount);
		});
	}

	var reimburse = reimburses.get(args.reimburseId);

	reimburse.set({
		"total" : total
	}).save();

	// reload the tasks
	reimburseDetails.fetch();
	$.reimburseDetailForm.close();
}

function imageClick(e) {
	if (!Alloy.Globals.cameraShown) {
		Alloy.Globals.cameraShown = true;
		var camera = require('/lib/camera').getImage(function(media) {
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

var picker = Ti.UI.createPicker({
	type : Ti.UI.PICKER_TYPE_DATE,
	value : new Date()
});

function dateFieldClick(e) {
	picker.showDatePickerDialog({
		value : moment().toDate(),
		callback : function(e) {
			if (e.cancel) {
			} else {
				$.dateField.value = moment(e.value).format("YYYY-MM-DD");
			}
		}
	});
}

