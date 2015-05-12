//var fa = Alloy.createWidget("com.mattmcfarland.fontawesome");
//win.add(fa);

Alloy.Globals.login = Alloy.createController("login");

// use action bar search view
Alloy.Globals.searchView = Alloy.createController("searchView").getView();
Alloy.Globals.index = $.index;
Alloy.Globals.scrollableView = $.scrollableView;
Alloy.Globals.leftAction = $.leftAction;
Alloy.Globals.rightAction = $.rightAction;

var abx = require('com.alcoapps.actionbarextras');

libgcm.registerGCM(function(e) {
	Alloy.Globals.gcmRegId = e.deviceToken;
});

function doClick(e) {
    //alert($.label1.text);
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
		Alloy.createController("reimburseForm").getView().open();
		//Alloy.Globals.newBtnUsed = false;
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
	//if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[Alloy.Globals.scrollableView.currentPage].fireEvent("open");
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

function scrollableViewScrollEnd(e) {
	if (e.view && e.currentPage != e.source.prevPage) {
		$.activeTab.left = (e.currentPage == 0 ? $.tab1 : e.currentPage == 1 ? $.tab2 : $.tab3).getRect().x;  
		var style1 = $.createStyle({
			classes : "tabTitle",
			apiName : 'Label',
			//touchEnabled: false,
			//color: Alloy.Globals.darkColor,
			//backgroundColor:"transparent",
			font: {
				fontFamily: 'century-gothic',
				fontSize: "16dp",
				fontWeight: (e.currentPage == 0) ? "bold" : "normal",
			}
		});
		$.tab1title.applyProperties(style1);
		var style2 = $.createStyle({
			classes : "tabTitle",
			apiName : 'Label',
			//touchEnabled: false,
			//color: Alloy.Globals.darkColor,
			//backgroundColor:"transparent",
			font: {
				fontFamily: 'century-gothic',
				fontSize: "16dp",
				fontWeight: (e.currentPage == 1) ? "bold" : "normal",
			}
		});
		$.tab2title.applyProperties(style2);
		var style3 = $.createStyle({
			classes : "tabTitle",
			apiName : 'Label',
			//touchEnabled: false,
			//color: Alloy.Globals.darkColor,
			//backgroundColor:"transparent",
			font: {
				fontFamily: 'century-gothic',
				fontSize: "16dp",
				fontWeight: (e.currentPage == 2) ? "bold" : "normal",
			}
		});
		$.tab3title.applyProperties(style3);
		e.view.fireEvent("open");
		e.source.prevPage = e.currentPage;
	}
}

$.index.addEventListener('refresh', function(e) {
	$.scrollableView.views[$.scrollableView.currentPage].fireEvent("open", e);
	//$.index.getActiveTab().getWindow().fireEvent("open", e);
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


$.index.open();
