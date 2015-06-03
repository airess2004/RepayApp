//var fa = Alloy.createWidget("com.mattmcfarland.fontawesome");
//win.add(fa);

Alloy.Globals.login = Alloy.createController("login");

// use action bar search view
Alloy.Globals.searchView = Alloy.createController("searchView").getView();
Alloy.Globals.index = $.index;
Alloy.Globals.scrollableView = $.scrollableView;
Alloy.Globals.leftAction = $.leftAction;
Alloy.Globals.rightAction = $.rightAction;
Alloy.Globals.dialogView = $.dialogView;
Alloy.Globals.profileImage = $.profile;
Alloy.Globals.overlayView = $.overlayView;
Alloy.Globals.fullImage = $.fullImage;
Alloy.Globals.cropperView = $.cropperView;
Alloy.Globals.act = $.act;

var abx = require('com.alcoapps.actionbarextras');

// libgcm.registerGCM(function(e) {
	// Alloy.Globals.gcmRegId = e.deviceToken;
// });

$.scrollableView.prevPage = -1;

function doClick(e) {
    //alert($.label1.text);
}

function dialogViewClick(e) {
    $.dialogView.hide(); //visible = false;
}

function doMenuClick(evt) {
  switch(evt.source.title){
		case "Menu": // in real life you probably wouldn't want to use the text of the menu option as your condition
			var activity = $.index.getActivity();
			activity.openOptionsMenu();
			break;
		default:
			alert(evt.source.title);	
	}
}

function doSearch(e) {
	alert("Search Clicked");
}

Alloy.Globals.newBtnUsed = false;
function doNew(e) {
	if (!Alloy.Globals.newBtnUsed) {
		Alloy.Globals.newBtnUsed = true;
		if (Alloy.Globals.CURRENT_USER && Alloy.Globals.CURRENT_USER!="") {
			var newview = Alloy.createController("reimburseForm").getView(); //.open();
			Alloy.Globals.dialogView.removeAllChildren();
			Alloy.Globals.dialogView.add(newview);
			newview.fireEvent("open");
			//Alloy.Globals.dialogView.show();
		} else {
			alert("Please login first!");
			Alloy.Globals.login.getView().open();
		}
		Alloy.Globals.newBtnUsed = false;
	}
}

function doLoginClick(e) {
    Alloy.Globals.login.getView().open();
}

Alloy.Globals.bottomBtnUsed = false;
function homeBtnClick(e) {
	if (!Alloy.Globals.bottomBtnUsed) {
		Alloy.Globals.bottomBtnUsed = true;
		var page = 0;
		$.scrollableView.prevPage = $.scrollableView.currentPage;
		$.scrollableView.scrollToView(page);
		Alloy.Globals.bottomBtnUsed = false;
	}
}

function reimburseBtnClick(e) {
	if (!Alloy.Globals.bottomBtnUsed) {
		Alloy.Globals.bottomBtnUsed = true;
		var page = 1;
		$.scrollableView.prevPage = $.scrollableView.currentPage;
		$.scrollableView.scrollToView(page);
		Alloy.Globals.bottomBtnUsed = false;
	}
}

function settingBtnClick(e) {
	if (!Alloy.Globals.bottomBtnUsed) {
		Alloy.Globals.bottomBtnUsed = true;
		var page = 2;
		$.scrollableView.prevPage = $.scrollableView.currentPage;
		$.scrollableView.scrollToView(page);
		Alloy.Globals.bottomBtnUsed = false;
	}
}

function mainViewOpen(e) {
	//Alloy.Globals.index = $.index;
	//Alloy.Globals.searchView = $.searchView;
	//Alloy.Globals.abx = require('com.alcoapps.actionbarextras');
	var activity = $.index.getActivity();
	if (activity) {
		var actionBar = activity.getActionBar();
		actionBar.hide();
		// get a handle to the action bar
		actionBar.title = 'RepayApp';
		actionBar.logo = "smalllogo.png";
		//abx.backgroundColor = "white";
		// change the App Title
		//actionBar.displayHomeAsUp = true; // back icon
		// Show the "angle" pointing back
		// actionBar.onHomeIconItemSelected = function() {// what to do when the "home" icon is pressed
			// Ti.API.info("Home icon clicked!");
			//$.index.fireEvent('android:back');
		// };
	
		activity.onCreateOptionsMenu = function(e) {
			e.menu.clear();
        	e.menu.add({
            	title: "List Search",
            	icon: (Ti.Android.R.drawable.ic_menu_search ? Ti.Android.R.drawable.ic_menu_search : "/icon/ic_action_search.png"),
            	actionView: Alloy.Globals.searchView,
            	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        	});
        	Alloy.Globals.newMenu = e.menu.add({
            	title: "NEW",
            	//icon: (Ti.Android.R.drawable.ic_menu_search ? Ti.Android.R.drawable.ic_menu_search : "/icon/ic_action_search.png"),
            	actionView: $.itemNew,
            	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        	});
        	Alloy.Globals.newMenu.addEventListener("click", doNew);
    	};
    	// Make sure icons are updated
		$.index.activity.invalidateOptionsMenu();
	}
	
	if (!Alloy.Globals.CURRENT_USER || Alloy.Globals.CURRENT_USER=="") {
		//Alloy.Globals.CURRENT_USER = "Admin"; 
		Alloy.Globals.login.getView().open();
	}
	
	//Alloy.Collections.reimburse.fetch({remove: false});
	//Alloy.Collections.reimburseDetail.fetch({remove: false});
	//Alloy.Collections.comment.fetch({remove: false});
	if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[Alloy.Globals.scrollableView.currentPage].fireEvent("refresh");
	//updateTitle($.scrollableView.currentPage);
	updateModule.check();
}

// Need to destroy when binding to data collection to prevent memory leaks
function mainViewClose() {
    $.destroy();
}

function refreshTab(e) {
	if (e.source == $.tab1 || e.source == $.tab2 || e.source == $.tab3) {
		e.source.getWindow().fireEvent("open", e);
	}
}

function scrollableViewScroll(e) {
	var val = e.currentPageAsFloat;
	var lowval = Math.floor(val);
	var hival = Math.ceil(val);
	var frac = val - lowval;
	var prevtab = lowval == 0 ? $.tab1 : lowval == 1 ? $.tab2 : $.tab3;
	var nexttab = hival == 0 ? $.tab1 : hival == 1 ? $.tab2 : $.tab3;
	if (prevtab != nexttab) {
		var prevrect = prevtab && prevtab.getRect();
		var nextrect = nexttab && nexttab.getRect();
		if (prevtab && nexttab) {
			$.activeTab.left = Math.round((nextrect.x - prevrect.x)*frac + prevrect.x);
		}
	}
}

function updateTitle(currentPage) {
	$.activeTab.left = (currentPage == 0 ? $.tab1 : currentPage == 1 ? $.tab2 : $.tab3).getRect().x;
	var style1 = $.createStyle({
		classes : ["tabTitle"],
		apiName : 'Label',
		//touchEnabled: false,
		//color: Alloy.Globals.darkColor,
		//backgroundColor:"transparent",
		font : {
			fontFamily : 'century-gothic',
			fontSize : "18dp", //"16dp",
			fontWeight : (currentPage == 0) ? "bold" : "normal",
		}
	});
	$.tab1title.applyProperties(style1);
	var style2 = $.createStyle({
		classes : ["tabTitle"],
		apiName : 'Label',
		//touchEnabled: false,
		//color: Alloy.Globals.darkColor,
		//backgroundColor:"transparent",
		font : {
			fontFamily : 'century-gothic',
			fontSize : "18dp", //"16dp",
			fontWeight : (currentPage == 1) ? "bold" : "normal",
		}
	});
	$.tab2title.applyProperties(style2);
	var style3 = $.createStyle({
		classes : ["tabTitle"],
		apiName : 'Label',
		//touchEnabled: false,
		//color: Alloy.Globals.darkColor,
		//backgroundColor:"transparent",
		font : {
			fontFamily : 'century-gothic',
			fontSize : "18dp", //"16dp",
			fontWeight : (currentPage == 2) ? "bold" : "normal",
		}
	});
	$.tab3title.applyProperties(style3); 
}

function scrollableViewScrollEnd(e) {
	if (e.view && e.currentPage != e.source.prevPage) {
		updateTitle(e.currentPage);
		e.view.fireEvent("refresh"); //"open"
		e.source.prevPage = e.currentPage;
	}
}

function fullClick(e) {
	if (e.source == $.fullView) {
		e.cancelBubble = true;
		e.bubbles = false;
		var dpPoint = { // convert coordinate from "pt" to "dp"
        	"x" : (e.x / Ti.Platform.displayCaps.logicalDensityFactor), //  / parseInt(e.source.rect.width), //normalize to 0..1
            "y" : (e.y / Ti.Platform.displayCaps.logicalDensityFactor), //  / parseInt(e.source.rect.height) //normalize to 0..1
        };
		//var parsz = $.fullView.getSize();
		var center = {x: dpPoint.x, y: dpPoint.y}; //{x: parsz.width/2, y: parsz.height/2};
		// $.cropperView.center = center; //setCenter(center);
		// var style = $.createStyle({
			// classes : ["cropperView"],
			// apiName : 'View',
			// center: center,
		// });
		//$.cropperView.applyProperties(style); 
		$.cropperView.animate({center: center});
	}
}

function touchStart(e) {
	if (e.source == $.fullView) {
		e.cancelBubble = true;
		e.bubbles = false;
		var dpPoint = { // convert coordinate from "pt" to "dp"
        	"x" : (e.x / Ti.Platform.displayCaps.logicalDensityFactor), //  / parseInt(e.source.rect.width), //normalize to 0..1
            "y" : (e.y / Ti.Platform.displayCaps.logicalDensityFactor), //  / parseInt(e.source.rect.height) //normalize to 0..1
        };
		// var center = $.cropperView.center; //getCenter();
		// if (!center) 
		// {
			// var parsz = $.cropperView.parent.getSize();
			// center = {x: parsz.width/2, y: parsz.height/2};
			// $.cropperView.center = center; //setCenter(center);
			// var style = $.createStyle({
				// classes : ["cropperView"],
				// apiName : 'View',
				// center: center,
			// });
			// $.cropperView.applyProperties(style); 
		// }
		var newcenter = {x: dpPoint.x, y: dpPoint.y}; //
		$.cropperView.animate({center: newcenter});
		// centerStartX = center.x;
		// centerStartY = center.y;
		// touchStartX = e.x;
		// touchStartY = e.y;
		$.cropperView.ox = dpPoint.x - newcenter.x;
  		$.cropperView.oy = dpPoint.y - newcenter.y;
	}
}

function touchMove(e) {
	if (e.source == $.fullView) {
		e.cancelBubble = true;
		e.bubbles = false;
		var dpPoint = { // convert coordinate from "pt" to "dp"
        	"x" : (e.x / Ti.Platform.displayCaps.logicalDensityFactor), //  / parseInt(e.source.rect.width), //normalize to 0..1
            "y" : (e.y / Ti.Platform.displayCaps.logicalDensityFactor), //  / parseInt(e.source.rect.height) //normalize to 0..1
        };
		var center = {x: (dpPoint.x - $.cropperView.ox), y: (dpPoint.y - $.cropperView.oy)}; //{x: centerStartX + (e.x - touchStartX), y: centerStartY + (e.y - touchStartY)};
		// $.cropperView.center = center; //setCenter(center);
		// var style = $.createStyle({
			// classes : ["cropperView"],
			// apiName : 'View',
			// center: center,
		// });
		//$.cropperView.applyProperties(style); 
		//if ($.cropperView.center) 
		$.cropperView.animate({center: center});
	}
}

function okClick(e) {
	$.act.show();
	$.cropperView.hide();
	// var rect = $.cropperView.getRect();
	//$.cropperView.borderWidth = 0;
	//$.cropperView.borderRadius = 0;
	// $.croppedImage.image = $.fullView.toImage();
	// $.croppedImage.top = -rect.y;
	// $.croppedImage.left = -rect.x;
	// $.croppedImage.visible = true;
	Alloy.Globals.profileImage.image = null;
	Alloy.Globals.avatar.image = null;
	var croppedImg = cropImage($.fullView.toImage(), $.cropperView.getRect());
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, Ti.Utils.base64encode(Alloy.Globals.CURRENT_USER).toString()+".jpg");
	file.write(croppedImg);
	Alloy.Globals.profileImage.image = file.nativePath; //croppedImg; //$.fullImage.toBlob() //$.fullView.toImage();  //$.cropperView.toImage(); //
	Alloy.Globals.avatar.image = Alloy.Globals.profileImage.image;
	upload2trans(file.nativePath, function(asm) {
		if (typeof asm == "object") {
			if (asm.ok == "ASSEMBLY_COMPLETED") { //ASSEMBLY_CANCELED, ASSEMBLY_COMPLETED, REQUEST_ABORTED, or error means done
				Alloy.Globals.profileImage.image = asm.results.optimized[0].url; //asm.results.thumb[0].url;
				Alloy.Globals.avatar.image = asm.results.optimized[0].url;
				//Ti.API.info(JSON.stringify(asm.results));
				var item = {
					email: Alloy.Globals.CURRENT_USER,
					original_avatar_url: asm.results.optimized[0].url,
					mini_avatar_url: asm.results.thumb[0].url,
				};
				remoteUser.updateObject(item, function(result) {
					if(!result.error) {
						var users = Alloy.Collections.user;
						var user = users.find(function(mdl){
							return mdl.get('email').trim().toUpperCase() == result.email.trim().toUpperCase();
						});
						if (!user) {
							user = Alloy.createModel("user", result);
							users.add(user, {merge:true});
						}
						user.save(result);
						user.fetch({remove:false});
					}
				});
			}
		}
	}, function(asm) {
		// if (typeof asm == "object") {
			// var rv = asm.bytes_received;
			// var sz = asm.bytes_expected;
		// }
	});
	$.cropperView.show();
	$.act.hide();
	$.overlayView.hide();
	// $.croppedImage.visible = false;
	//$.cropperView.borderWidth = "1";
	//$.cropperView.borderRadius = "64dp";
	//$.croppedImage.image = null;
}

function cancelClick(e) {
	$.overlayView.hide();
	$.fullImage.image = null;
}

$.index.addEventListener('update', function(e) {
	updateTitle($.scrollableView.currentPage);
});

$.index.addEventListener('refresh', function(e) {
	$.scrollableView.views[$.scrollableView.currentPage].fireEvent("refresh", e);
	//$.index.getActiveTab().getWindow().fireEvent("open", e);
});

$.index.addEventListener("android:back", function(e) {
	//$.tableView.search = Alloy.Globals.searchView;
	//Alloy.Globals.index.activity.actionBar.title = "Reimburse Detail";
	if ($.overlayView.visible) {
		$.overlayView.hide();
	} else if ($.dialogView.visible) {
		$.dialogView.hide();
	} else {
		$.index.close(e);
	}
});

// $.index.addEventListener('open', function() {
	// var actionBar = $.index.getActivity().getActionBar();
	// // get a handle to the action bar
	// actionBar.title = 'RepayApp';
	// // change the App Title
	// actionBar.displayHomeAsUp = true;
	// // Show the "angle" pointing back
	// actionBar.onHomeIconItemSelected = function() {// what to do when the "home" icon is pressed
		// Ti.API.info("Home icon clicked!");
	// };
// });

startSyncReimburseDet($.index);

$.index.open();
