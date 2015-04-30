var args = arguments[0] || {};
var moment = require('alloy/moment');
Alloy.Globals.cameraShown = false;

var reimburseDetails = Alloy.Collections.reimburseDetail;

var reimburses = Alloy.Collections.reimburse;
//reimburseDetails && reimburseDetails.fetch({remove: false});
var data;

if (args.id != null) {
	data = reimburseDetails.get(args.id);
}

function winOpen(e) {
	if (data) {
		$.titleField.value = data.get('name');
		$.dateField.value = moment.parseZone(data.get('receiptDate')).local().format("YYYY-MM-DD");
		$.amountField.value = data.get('amount');
		$.descriptionField.value = data.get('description');
		$.image.image = data.get('urlImageOriginal');
	}
}

function winClose(e) {
	reimburseDetails = null;
	reimburses = null;
	if (data) {
		//Alloy.Globals.reimburseDetailList.fireEvent("refresh", {param:{remove:false/*, query:"SELECT * FROM reimburseDetail WHERE id="+args.id*/}});
		data = null;
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

function doSave(e) {
	var reimburses = Alloy.Collections.reimburse;
	var reimburseId;
	if (args.reimburseId == null) {
		var reimburseDetail = reimburseDetails.get(args.id);
		if (reimburseDetail) {
			reimburseDetail.set({
				name : $.titleField.value,
				description : $.descriptionField.value,
				receiptDate : moment($.dateField.value).utc().toISOString(),
				amount : parseFloat($.amountField.value),
				urlImageOriginal : $.image.image
			});
			reimburseDetail.save();
			reimburseId = reimburseDetail.get("reimburseId");
		}
	} else {
		var reimburseDetail = Alloy.createModel("reimburseDetail", {
			reimburseId : args.reimburseId,
			name : $.titleField.value,
			description : $.descriptionField.value,
			receiptDate : moment($.dateField.value).utc().toISOString(),
			isDeleted : 0,
			amount : parseFloat($.amountField.value),
			urlImageOriginal : $.image.image

		});
		reimburseDetail.save();
		reimburseDetails.add(reimburseDetail);
		reimburseId = args.reimburseId;
	}

	var detail = reimburseDetails.where({
		isDeleted : 0,
		reimburseId : reimburseId
	});

	var total = 0;

	for (var i in detail) {
		total += parseFloat(detail[i].get("amount"));
	}

	var reimburse = reimburses.get(reimburseId);

	reimburse.set({
		"total" : parseFloat(total)
	});
	reimburse.save();

	// reload the tasks
	//reimburseDetails.fetch({remove: false});
	if (reimburse.id) {
		Alloy.Globals.reimburseDetailList.fireEvent("open", {param:{remove:false/*, query:"SELECT * FROM reimburseDetail WHERE reimburseId="+reimburse.id*/}});
	}
	//Alloy.Globals.reimburseDetailList.fireEvent("refresh");
	$.reimburseDetailForm.close();
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

