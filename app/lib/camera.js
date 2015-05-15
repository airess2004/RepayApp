// For BlackBerry, you need to add the `use_camera` and `access_shared` permission in your project's tiapp.xml file.
var maxImageResolution = 1280;

exports.getImage = function(callback, mode) {
	//var win = Titanium.UI.currentWindow;

	if (!Ti.Media.isCameraSupported || mode == 1) {
		Ti.API.debug('Camera not found!');
		if (mode != 1) alert('Camera Not Found!');
		if (Ti.Platform.name === 'mobileweb') {
			if (callback) callback(null);
			return null; // Mobile Web doesn't support camera/gallery? TODO: show dialog to browse for Image File
		}
		
		// Open gallery when no camera found
		Ti.Media.openPhotoGallery({
			success : callbackSuccess,
			cancel : callbackCancel,
			error : callbackError,
			showControls : true,
			saveToPhotoGallery : false,
			// allowEditing and mediaTypes are iOS-only settings
			//allowEditing:true,
			//mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
		});
	} else { // have camera
		var overlay = Ti.UI.createView({
			height : Ti.UI.SIZE,
			width : Ti.UI.SIZE,
			layout : 'vertical'
		});
		var cameraType = Ti.UI.createButton({
			title : 'Front'
		});

		var cameras = Ti.Media.availableCameras;
		if (cameras != null)
			for ( c = 0; c < cameras.length; c++) {
				// if we have a rear camera ... we add switch button
				if (cameras[c] == Ti.Media.CAMERA_REAR) {
					overlay.add(cameraType);
					cameraType.addEventListener('click', function() {
						Ti.API.info('Current camera is: ' + Ti.Media.camera + ' (Front=' + Ti.Media.CAMERA_FRONT + ')');
						// BUG: Couldn't switch back to Rear after switching from Rear to Front
						if (Ti.Media.camera == Ti.Media.CAMERA_FRONT) {
							cameraType.title = "Front";
							Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
						} else {
							cameraType.title = "Rear";
							Ti.Media.switchCamera(Ti.Media.CAMERA_FRONT);
						}
					});
					break;
				}
			}

		//Ti.Media.switchCamera(Ti.Media.CAMERA_REAR);
		Ti.Media.showCamera({//openPhotoGallery
			success : callbackSuccess,
			cancel : callbackCancel,
			error : callbackError,
			//overlay : overlay,
			showControls : true,
			saveToPhotoGallery : false,
			// allowEditing and mediaTypes are iOS-only settings
			//allowEditing:true,
			//mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
		}); 
	}

	function callbackSuccess(event) {
		// called when media returned from the camera/gallery
		Ti.API.info('Our type was: ' + event.mediaType);
		//Ti.API.info('Our media was: '+event.media);
		if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
			var media = event.media;
			// Must be less than 12Mp otherwise it won't shows (OutOfMemory or bug?)
			// Resize photo to prevent using too much memory, taking too long time & nativePath doesn't works yet
			// var imgOption = {image : media};
			// if (media.width > media.height && media.width > maxImageResolution) {
				// imgOption.width = maxImageResolution;
			// } else if (media.width < media.height && media.height > maxImageResolution) {
				// imgOption.height = maxImageResolution;
			// }
			// var image = Ti.UI.createImageView(imgOption).toImage();
			// var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "img_"+Date.now()+'.jpg');
			// f.write(image.media);
			// image = Ti.UI.createImageView({image : f.resolve()}); //f.nativePath
			// var imageView = Ti.UI.createImageView({
				// //width : _win.width,
				// //height : _win.height,
				// image : media,
				// //url : media.nativePath,
			// });
			//_win.removeAllChildren();
			//_win.add(imageView);
			//_path.value = media.nativePath;
			Ti.API.info('Our NativePath was: ' + media.nativePath); //image.nativePath
			//Ti.API.info('Our URL was: ' + imageView.url);
			Ti.API.info('Current camera is: ' + Ti.Media.camera + ' (Front='+Ti.Media.CAMERA_FRONT+')');
			if (callback) callback(media); //image.media
			return media.nativePath; //image.nativePath
		} else {
			alert("got the wrong type back =" + event.mediaType);
		}
		if (callback) callback(null);
		return null;
	};

	function callbackCancel(e) {
		// called when user cancels taking a picture
		if (callback) callback(null);
		return null;
	};

	function callbackError(error) {
		// called when there's an error
		var a = Ti.UI.createAlertDialog({
			title : 'Photo'
		});
		if (error.code == Titanium.Media.NO_CAMERA) {
			a.setMessage('Please run this test on device');
		} else {
			a.setMessage('Unexpected error: ' + error.code);
		}
		a.addEventListener('click', function(e) {
			if (callback) callback(null);
		});
		a.show();
		return null;
	};
	
	return null;
};
