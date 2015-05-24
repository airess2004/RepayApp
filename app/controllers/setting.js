var args = arguments[0] || {};

Alloy.Globals.avatar = $.avatar;


function signOutClick(e) {
	Alloy.Globals.login.getView().open();;
}

function syncClick(e) {
	
}

function avatarClick(e) {
	if (!Alloy.Globals.cameraShown) {
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
						Alloy.Globals.fullImage.image = media.nativePath; //media;
						Alloy.Globals.fullImage.width = Ti.UI.FILL;
						Alloy.Globals.overlayView.show({modal:true});
						//Alloy.Globals.profileImage.image = media.nativePath;
					}
					Alloy.Globals.cameraShown = false;
				});
				//cameraShown = false;
			} 
			else if(e.index == 1) {
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
						Alloy.Globals.fullImage.image = media.nativePath; //media;
						Alloy.Globals.fullImage.width = Ti.UI.FILL;
						Alloy.Globals.overlayView.show({modal:true});
						//Alloy.Globals.profileImage.image = media.nativePath;
					}
					Alloy.Globals.cameraShown = false;
				}, 1);
			}
			else {
				//cancel was tapped
				Alloy.Globals.cameraShown = false;
			}
		}); 
		dialog.show();
	}
}

$.setting.addEventListener("refresh", function(e){
	Alloy.Globals.index.fireEvent("update", e);
	//showList(e);
});

$.setting.addEventListener("open", function(e){
	e.bubbles = false;
	Alloy.Globals.index.getActivity().getActionBar().title = "Setting";
	//Alloy.Globals.newMenu.visible = false;
	// Make sure icons are updated
	//Alloy.Globals.index.activity.invalidateOptionsMenu();
	//$.tableView.search = Alloy.Globals.searchView;
	Alloy.Globals.scrollableView.scrollToView($.setting);
	$.avatar.image = Alloy.Globals.profileImage.image;
	
	//showList(e);
	e.cancelBubble = true;
	//Alloy.Globals.dialogView.show();
});