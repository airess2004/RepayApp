//var fa = Alloy.createWidget("com.mattmcfarland.fontawesome");
//win.add(fa);

Alloy.Globals.login = Alloy.createController("login");

// use action bar search view
Alloy.Globals.searchView = Alloy.createController("searchView").getView();

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

function doNew(e) {
	Alloy.createController("reimburseForm").getView().open();
}

function doLoginClick(e) {
    Alloy.Globals.login.getView().open();
}


function homeBtnClick(e) {
	var page = 0;
	$.scrollableView.scrollToView(page);
	//$.scrollableView.setCurrentPage(page);
	var actionBar = $.index.getActivity().getActionBar();
	actionBar.title = 'Home';
	$.scrollableView.views[page].fireEvent("open");

}

function reimburseBtnClick(e) {
	var page = 1;
	$.scrollableView.scrollToView(page);
	//$.scrollableView.setCurrentPage(page);
	var actionBar = $.index.getActivity().getActionBar();
	actionBar.title = 'Reimburse';
	$.scrollableView.views[page].fireEvent("open");
	
}

function settingBtnClick(e) {
	var page = 2;
	$.scrollableView.scrollToView(page);
	//$.scrollableView.setCurrentPage(page);
	$.scrollableView.views[page].fireEvent("open");
	var actionBar = $.index.getActivity().getActionBar();
	actionBar.title = 'Setting';
}

function mainViewOpen(e) {
	Alloy.Globals.index = $.index;
	//Alloy.Globals.searchView = $.searchView;
	//Alloy.Globals.abx = require('com.alcoapps.actionbarextras');
	var activity = $.index.getActivity();
	if (activity) {
		var actionBar = activity.getActionBar();
		// get a handle to the action bar
		actionBar.title = 'RepayApp';
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
	} else {
		$.scrollableView.views[$.scrollableView.currentPage].fireEvent("open");
	}
}

function scrollableViewScrollEnd(e) {
	if (e.view) e.view.fireEvent("open");
}

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

// Need to destroy when binding to data collection to prevent memory leaks
function cleanUp() {
    $.destroy();
}

$.index.open();
