var args = arguments[0] || {};

Alloy.Globals.avatar = $.avatar;

//Alloy.Globals.avatar.image = Alloy.Globals.profileImage.image; //profileImage doesn't exist yet at this point (child controller created first before parent controller)


function signOutClick(e) {
	$.signOutButton.touchEnabled = false;
	Alloy.Globals.act.show();
	remoteUser.logout(function(result) {
		if (!result.error) {
			libgcm.unregGCM();
			Alloy.Globals.gcmRegId = "";
			lastDeviceToken = localConfig.createOrUpdateObject("lastDeviceToken", Alloy.Globals.gcmRegId, Alloy.Globals.CURRENT_USER);
			//TODO: delete records if it's already synchronized
			// var reimburse_ass = Alloy.createCollection('reimburse_ass');
			// reimburse_ass.fetch({query:"SELECT * FROM reimburse_ass WHERE isSync=1 and username='"+Alloy.Globals.CURRENT_USER+"'"});
			// for (var i = reimburse_ass.models.length-1; i >= 0; i--) {
  				// reimburse_ass.models[i].destroy();        
			// }
			Alloy.Globals.profileImage.image = "/icon/ic_action_user.png";
			Alloy.Globals.avatar.image = Alloy.Globals.profileImage.image;
			Alloy.Globals.CURRENT_NAME = "";
			lastToken = localConfig.createOrUpdateObject("lastToken", "", Alloy.Globals.CURRENT_USER);
			Alloy.Globals.CURRENT_USER = "";
			SERVER_KEY = "";
			syncReimburseLastTime = moment(minDate, dateFormat, lang).toISOString();
			syncReimburseDetLastTime = moment(minDate, dateFormat, lang).toISOString();
			$.email.text = "";
							
			Alloy.Globals.login.getView().open();
		} else {
			alert(result.error);
		}
		Alloy.Globals.act.hide();
	});
	$.signOutButton.touchEnabled = true;
}

function syncClick(e) {
	$.syncButton.touchEnabled = false;
	if (Alloy.Globals.CURRENT_USER && Alloy.Globals.CURRENT_USER != "") {
		enqueueAllUniqueDetails();
	} else {
		alert("Please login first!");
		Alloy.Globals.login.getView().open();
	}
	$.syncButton.touchEnabled = true;
}

function avatarClick(e) {
	if (!Alloy.Globals.cameraShown) {	
		if (Alloy.Globals.CURRENT_USER && Alloy.Globals.CURRENT_USER != "") {
			Alloy.Globals.cameraShown = true;
			//Create a dialog with options
			var dialog = Ti.UI.createOptionDialog({
				//title of dialog
				title : 'Choose an image source...',
				//options
				options : ['Camera', 'Photo Gallery', 'Cancel'],
				//index of cancel button
				cancel : 2
			});

			//add event listener
			dialog.addEventListener('click', function(e) {
				//if first option was selected
				if (e.index == 0) {
					var camera = require('camera').getImage(function(media) {
						if (media != null) {
							Ti.API.info("Click Image = " + media.nativePath);
							Alloy.Globals.fullImage.image = null;
							delete Alloy.Globals.fullImage.size;
							delete Alloy.Globals.fullImage.rect;
							delete Alloy.Globals.fullImage.center;
							delete Alloy.Globals.fullImage.left;
							delete Alloy.Globals.fullImage.top;
							delete Alloy.Globals.fullImage.width;
							//delete Alloy.Globals.fullImage.height;
							delete Alloy.Globals.cropperView.center;
							Alloy.Globals.fullImage.image = media.nativePath;
							//media;
							Alloy.Globals.fullImage.width = Ti.UI.FILL;
							Alloy.Globals.overlayView.show({
								modal : true
							});
						}
						Alloy.Globals.cameraShown = false;
					});
					//cameraShown = false;
				} else if (e.index == 1) {
					//obtain an image from the gallery
					var camera = require('camera').getImage(function(media) {
						if (media != null) {
							Ti.API.info("Click Image = " + media.nativePath);
							Alloy.Globals.fullImage.image = null;
							delete Alloy.Globals.fullImage.size;
							delete Alloy.Globals.fullImage.rect;
							delete Alloy.Globals.fullImage.center;
							delete Alloy.Globals.fullImage.left;
							delete Alloy.Globals.fullImage.top;
							delete Alloy.Globals.fullImage.width;
							//delete Alloy.Globals.fullImage.height;
							delete Alloy.Globals.cropperView.center;
							Alloy.Globals.fullImage.image = media.nativePath;
							//media;
							Alloy.Globals.fullImage.width = Ti.UI.FILL;
							Alloy.Globals.overlayView.show({
								modal : true
							});
						}
						Alloy.Globals.cameraShown = false;
					}, 1);
				} else {
					//cancel was tapped
					Alloy.Globals.cameraShown = false;
				}
			});
			dialog.show();
		} else {
			alert("Please login first!");
			Alloy.Globals.login.getView().open();
		}
	}
}

$.setting.addEventListener("refresh", function(e){
	Alloy.Globals.index.fireEvent("update", e);
	$.email.text = Alloy.Globals.CURRENT_USER.toLowerCase();
	$.versionLabel.text = "Version "+Titanium.App.version;
	$.avatar.image = Alloy.Globals.profileImage.image;
});

$.setting.addEventListener("open", function(e){
	e.bubbles = false;
	Alloy.Globals.index.getActivity().getActionBar().title = "Setting";
	Alloy.Globals.scrollableView.scrollToView($.setting);
	$.avatar.image = Alloy.Globals.profileImage.image;
	$.email.text = Alloy.Globals.CURRENT_USER.toLowerCase();
	$.versionLabel.text = "Version "+Titanium.App.version;
	e.cancelBubble = true;
});