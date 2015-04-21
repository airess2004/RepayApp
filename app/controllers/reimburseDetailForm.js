var args = arguments[0] || {};

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
