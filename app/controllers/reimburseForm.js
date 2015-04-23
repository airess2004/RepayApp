var args = arguments[0] || {};
var moment = require('alloy/moment');

var reimburses = Alloy.Collections.reimburse;
reimburses && reimburses.fetch();
var data = reimburses.get(args.id);

function winOpen(e) {
	if (data) {
		$.titleField.value = data.get('title');
		$.dateField.value = moment.parseZone(data.get('projectDate')).local().format("YYYY-MM-DD");
		// $.dateField.value = data.get('projectDate');
		
	}
}

function doMenuClick(evt) {
	switch(evt.source.title) {
	case "Menu":
		// in real life you probably wouldn't want to use the text of the menu option as your condition
		var activity = $.reimburseForm.getActivity();
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
	var reimburse;
	if (args == null || args.id == null) {
		reimburse = Alloy.createModel('reimburse', {
			userId : 1,
			title : $.titleField.value,
			projectDate : moment($.dateField.value).utc().toISOString(),
			total : 0,
			isSent : 0,
			//sentDate : item.sentDate,
			isDeleted : 0,
			status : 0,
		});
		reimburses.add(reimburse);
		reimburse.save();
	} else {
		reimburse = reimburses.get(args.id);
		if (reimburse) {
			reimburse.set({
				userId : 1,
				title : $.titleField.value,
				projectDate : moment($.dateField.value).utc().toISOString(),
			}).save();
		}
	}

	// reload the tasks
	reimburses.fetch();
	Alloy.createController("reimburseDetailList", {
		id : reimburse.id
	}).getView().open();
	$.reimburseForm.close();

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

