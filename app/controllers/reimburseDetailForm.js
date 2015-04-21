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
