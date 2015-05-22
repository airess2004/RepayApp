var args = arguments[0] || {};
var moment = require('alloy/moment');

var reimburses = Alloy.Collections.reimburse;
//reimburses && reimburses.fetch({remove: false});
var data = reimburses.get(args.id);

function winOpen(e) {
	if (data) {
		$.titleField.value = data.get('title');
		$.dateField.value = moment.parseZone(data.get('projectDate')).local().format(dateFormat);
		// $.dateField.value = data.get('projectDate');
		
	}
	$.reimburseForm.parent.show();
}

function winClose(e) {
	reimburses = null;
	data = null;
	Alloy.Globals.newBtnUsed = false;
	$.reimburseForm.parent.hide();
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

function dialogCancelClick(e) {
	$.reimburseForm.fireEvent("close");
}

function dialogSaveClick(e) {
	doSave(e);
}

function doSave(e) {
	var reimburse;
	if (args == null || args.id == null) {
		reimburse = Alloy.createModel('reimburse', {
			userId : 1,
			title : $.titleField.value,
			projectDate : moment($.dateField.value, dateFormat, lang).utc().toISOString(),
			total : 0,
			isSent : 0,
			//sentDate : item.sentDate,
			isDeleted : 0,
			status : 0,
		});
		reimburses.add(reimburse);
		reimburse.save();
		reimburse.fetch({remove:false});
	} else {
		reimburse = reimburses.get(args.id);
		if (reimburse) {
			reimburse.set({
				userId : 1,
				title : $.titleField.value,
				projectDate : moment($.dateField.value, dateFormat, lang).utc().toISOString(),
			});
			reimburse.save();
			reimburse.fetch({remove:false});
		}
	}

	// reload the tasks
	//reimburses.fetch({remove: false});
	if ($.reimburseForm.parent == Alloy.Globals.dialogView) {
		Alloy.createController("reimburseDetailList", {
			id : reimburse.id
		}).getView().open();
	};
	$.reimburseForm.fireEvent("close"); //close();

}

function dateFieldClick(evt) {
	Ti.UI.Android.hideSoftKeyboard();
	//var picker = 
	Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		value : ($.dateField.value == null || $.dateField.value == "") ? new Date() : moment($.dateField.value, dateFormat).toDate() //
	}).showDatePickerDialog({
		value : ($.dateField.value == null || $.dateField.value == "") ? moment().toDate() : moment($.dateField.value, dateFormat).toDate(), //,
		callback : function (e) {
			if (e.cancel) {
			} else {
				$.dateField.value = moment(e.value).format(dateFormat);
			}
			$.dateField.blur();
		}
	});
}

