var args = arguments[0] || {};
var moment = require('alloy/moment');
Alloy.Globals.cameraShown = false;

var reimburseDetails = Alloy.Collections.reimburseDetail;

var reimburses = Alloy.Collections.reimburse;
//reimburseDetails && reimburseDetails.fetch({remove: false});
var data;
var reimburse;

if (args.id != null) {
	data = reimburseDetails.get(args.id);
	reimburse = reimburses.get(data.get('reimburseId'));
}

function dateFieldClick(evt) {
	Ti.UI.Android.hideSoftKeyboard();
	
	var picker = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		value : ($.dateField.value == null || $.dateField.value == "") ? new Date() : moment($.dateField.value, dateFormat).toDate()
	});

	picker.showDatePickerDialog({
		value : ($.dateField.value == null || $.dateField.value == "") ? moment().toDate() : moment($.dateField.value, dateFormat).toDate(),
		callback : function(e) {
			if (e.cancel) {
			} else {
				$.dateField.value = moment(e.value).format(dateFormat);
			}
			$.dateField.blur();
		}
	});
}

function dialogViewClick(e) {
    $.dialogView3.hide(); //visible = false;
}

function fullClick(e) {
	var view = e.source;
    var img = e.source.children[0];
    view.width = undefined;
    view.height = Ti.UI.FILL;
    img.height = Ti.UI.FILL;
    img.enableZoomControls = true;
}

function thumbPopUp(e) {
	var aview = Ti.UI.createView({
		width : "256dp",
		height : "256dp",
		backgroundColor : "#7777",
		borderColor : Alloy.Globals.lightColor,
		borderWidth : "1dp",
		touchEnabled: true,
		bubbleParent: false,
	}); 
	aview.addEventListener("click", fullClick);
	
	aview.add(Ti.UI.createImageView({
		//width: "512dp",
		height : "512dp",
		touchEnabled: false,
		image: $.photo.imageOri,
	}));
	
	$.dialogView3.removeAllChildren();
	$.dialogView3.add(aview);
	$.dialogView3.show();
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
						var newWidth = media.width;
						var newHeight = media.height;
						var aspectRatio =  media.height / media.width;
						if (newWidth > 1024) {
							newWidth = 1024;
							newHeight = newWidth*aspectRatio;
						} else if (newHeight > 1024) {
							newHeight = 1024;
							newWidth = newHeight/aspectRatio;
						}
						var resizedImg = resizeImage(media, {width: newWidth, height: newHeight});
						var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, Ti.Utils.base64encode(media.nativePath).toString()+".jpg");
						file.write(resizedImg);
						$.photo.image = file.nativePath; //media.nativePath; //media;
						$.photo.imageOri = file.nativePath; //media.nativePath;
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
						var newWidth = media.width;
						var newHeight = media.height;
						var aspectRatio =  media.height / media.width;
						if (newWidth > 1024) {
							newWidth = 1024;
							newHeight = newWidth*aspectRatio;
						} else if (newHeight > 1024) {
							newHeight = 1024;
							newWidth = newHeight/aspectRatio;
						}
						var resizedImg = resizeImage(media, {width: newWidth, height: newHeight});
						var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, Ti.Utils.base64encode(media.nativePath).toString()+".jpg");
						file.write(resizedImg);
						$.photo.image = file.nativePath; //media.nativePath; //media;
						$.photo.imageOri = file.nativePath; //media.nativePath;
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

function winOpen(e) {
	if (data) {
		$.titleField.value = data.get('name');
		$.dateField.value = moment.parseZone(data.get('receiptDate')).local().format(dateFormat);
		$.amountField.value = data.get('amount');
		$.descriptionField.value = data.get('description');
		$.photo.image = data.get('urlImageSmall');
		$.photo.imageOri = data.get('urlImageOriginal');
		Ti.UI.Android.hideSoftKeyboard();
	}
	var unSent = !(reimburse && reimburse.get('isSent'));
	$.actionTitle.text = data ? reimburse.get('isSent') ? "EXPENSE" : "EDIT EXPENSE" : "NEW EXPENSE";
	$.titleField.editable = unSent;
	$.dateField.editable = unSent;
	$.amountField.editable = unSent;
	$.descriptionField.editable = unSent;
	if (unSent) {
		$.imageView.addEventListener("click", imageClick);
		$.dateField.addEventListener("focus", dateFieldClick);
	} else {
		$.imageView.addEventListener("click", thumbPopUp);
	};
	$.saveBtn.visible = unSent;
	//$.titleField.blur();
	//Ti.UI.Android.hideSoftKeyboard();
}

function winClose(e) {
	reimburseDetails = null;
	reimburses = null;
	if (data) {
		//Alloy.Globals.reimburseDetailList.fireEvent("refresh", {param:{remove:false/*, query:"SELECT * FROM reimburseDetail WHERE id="+args.id*/}});
		data = null;
	}
}

function doBack(evt) {// what to do when the "home" icon is pressed
	Ti.API.info("Home icon clicked!");
	$.reimburseDetailForm.fireEvent('android:back', evt);
}

function doMenuClick(evt) {
	switch(evt.source.title) {
	case "Menu":
		// in real life you probably wouldn't want to use the text of the menu option as your condition
		var activity = $.reimburseDetailForm.getActivity();
		activity.openOptionsMenu();
		break;
	default:
		alert(evt.source.title);
	}
}

function doSearch(e) {
	alert("Search Clicked");
}

function doSave(e) {
	$.act.show();
	var curTime = moment().utc().toISOString();
	var reimburses = Alloy.Collections.reimburse;
	var reimburseId = args.reimburseId;
	var reimburse = reimburses.get(reimburseId);
	if (args.id) {
		var reimburseDetail = reimburseDetails.get(args.id);
		if (reimburseDetail) {
			var amount = parseFloat($.amountField.value);
			if (isNaN(amount)) amount = 0;
			reimburseDetail.set({
				name : $.titleField.value,
				description : $.descriptionField.value,
				receiptDate : moment($.dateField.value, dateFormat, lang).utc().toISOString(),
				amount : amount,
				urlImageSmall : $.photo.image,
				urlImageOriginal : $.photo.imageOri,
				IsSync: 0,
				username: Alloy.Globals.CURRENT_USER,
				lastUpdate : curTime,
			});
			reimburseDetail.save();
			reimburseDetail.fetch({remove: false});
			reimburseId = reimburseDetail.get("reimburseId");
		}
	} else {
		var amount = parseFloat($.amountField.value);
		if (isNaN(amount)) amount = 0;
		var reimburseDetail = Alloy.createModel("reimburseDetail", {
			reimburseId : args.reimburseId,
			reimburseGid : reimburse.get('gid'),
			name : $.titleField.value,
			description : $.descriptionField.value,
			receiptDate : moment($.dateField.value, dateFormat, lang).utc().toISOString(),
			isDeleted : 0,
			amount : amount,
			urlImageSmall : $.photo.image,
			urlImageOriginal : $.photo.imageOri,
			IsSync: 0,
			status : DETAILSTATUSCODE[Const.Open],
			username: Alloy.Globals.CURRENT_USER,
			lastUpdate : curTime,
			dateCreated : curTime,
		});
		reimburseDetail.save();
		reimburseDetails.add(reimburseDetail);
		reimburseDetail.fetch({remove: false});
		reimburseId = args.reimburseId;
	}

	//-- start update parent
	var details = reimburseDetails.where({
		isDeleted : 0,
		reimburseId : reimburseId
	});

	var first_receipt_original_url = null;
	var first_receipt_mini_url = null;
	var total = 0;
	for (var i in details) {
		if (i == 0) {
			first_receipt_original_url = details[i].get("urlImageOriginal");
			first_receipt_mini_url = details[i].get("urlImageSmall");
		}
		total += parseFloat(details[i].get("amount"));
	}

	reimburse.set({
		"total" : parseFloat(total),
		first_receipt_original_url : first_receipt_original_url,
		first_receipt_mini_url : first_receipt_mini_url,
		//IsSync: 0,
	});
	reimburse.save();
	reimburse.fetch({remove: false});
	//details = null;
	//-- end update parent

	// reload the tasks
	//reimburseDetails.fetch({remove: false});
	if (reimburse.id) {
		Alloy.Globals.reimburseDetailList.fireEvent("open", {param:{remove:false/*, query:"SELECT * FROM reimburseDetail WHERE reimburseId="+reimburse.id*/}});
	}
	//Alloy.Globals.reimburseDetailList.fireEvent("refresh");
	$.act.hide();
	$.reimburseDetailForm.close();
}


$.reimburseDetailForm.addEventListener("android:back", function(e) {
	//$.tableView.search = Alloy.Globals.searchView;
	//Alloy.Globals.index.activity.actionBar.title = "Reimburse Detail";
	$.reimburseDetailForm.close(e);
});
