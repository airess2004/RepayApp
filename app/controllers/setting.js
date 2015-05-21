var args = arguments[0] || {};


function signOutClick(e) {
	Alloy.Globals.login.getView().open();;
}

function syncClick(e) {
	
}

function imageClick(e) {
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
						delete $.image.left;
						delete $.image.top;
						delete $.image.width;
						delete $.image.height;
						delete $.image.rect;
						$.image.image = media.nativePath; //media;
						Alloy.Globals.profileImage.image = media.nativePath;
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
						delete $.image.left;
						delete $.image.top;
						delete $.image.width;
						delete $.image.height;
						delete $.image.size;
						delete $.image.rect;
						$.image.image = media.nativePath; //media;
						Alloy.Globals.profileImage.image = media.nativePath;
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

function touchStart(e) {
	e.cancelBubble = true;
	e.bubbles = false;
	var rect = $.image.getRect();
	
	rectStartX = rect.x;
	rectStartY = rect.y;
	touchStartX = e.x;
	touchStartY = e.y;
}

function touchMove(e) {
	e.cancelBubble = true;
	e.bubbles = false;
	var rect = $.image.getRect();
	
	$.image.left = rectStartX + (e.x - touchStartX);
	$.image.top = rectStartY + (e.y - touchStartY);
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
	//showList(e);
	e.cancelBubble = true;
});