var args = arguments[0] || {};
var moment = require('alloy/moment');
Alloy.Globals.cameraShown = false;

function doSearch(e) {
	alert("Search Clicked");
}

function doSave(e) {
	alert("Save Clicked");
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
				$.dateField.value =  moment(e.value).format("YYYY-MM-DD");
			}
		}
	});
}

