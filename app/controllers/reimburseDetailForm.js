var args = arguments[0] || {};

function imageClick(e) {
	var cameraShown = false;
	if (!cameraShown) {
		cameraShown = true;
		var camera = require('/lib/camera').getImage(function(media) {
			if (media != null) {
				Ti.API.info("Click Image = " + media.nativePath);
				$.image.image = media.nativePath;
				//media;
			}
			cameraShown = false;
		});
		//cameraShown = false;
	}
}

// var picker = Ti.UI.createPicker({
	// type : Ti.UI.PICKER_TYPE_DATE,
	// value : new Date()
// });
// 
// function dateFieldClick(e) {
	// picker.showDatePickerDialog({
		// value : new Date(2010, 8, 1),
		// callback : function(e) {
			// if (e.cancel) {
			// } else {
				// $.dateField.value = e.value;
			// }
		// }
	// });
// }




