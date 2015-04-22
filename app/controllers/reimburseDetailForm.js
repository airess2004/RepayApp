var args = arguments[0] || {};
var moment = require('alloy/moment');
Alloy.Globals.cameraShown = false;

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
				$.dateField.value =  moment(e.value).format("YYYY-MM-DD");
			}
		}
	});
}




