//var fa = Alloy.createWidget("com.mattmcfarland.fontawesome");
//win.add(fa);

Alloy.Globals.login = Alloy.createController("login");

function doClick(e) {
    alert($.label1.text);
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

function doSave(e) {
	alert("Save Clicked");
}

function doLoginClick(e) {
    Alloy.Globals.login.getView().open();
}


function homeBtnClick(e) {
	var page = 0;
	$.scrollableView.scrollToView(page);
	//$.scrollableView.setCurrentPage(page);
	$.scrollableView.views[page].fireEvent("open");
	var actionBar = $.index.getActivity().getActionBar();
	actionBar.title = 'Home';

}

function reimburseBtnClick(e) {
	var page = 1;
	$.scrollableView.scrollToView(page);
	//$.scrollableView.setCurrentPage(page);
	$.scrollableView.views[page].fireEvent("open");
	var actionBar = $.index.getActivity().getActionBar();
	actionBar.title = 'Reimburse';

	Alloy.createController("reimburseForm").getView().open();
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
	//Alloy.Globals.abx = require('com.alcoapps.actionbarextras');
	var activity = $.index.getActivity();
		if (activity) {
		var actionBar = activity.getActionBar();
		// get a handle to the action bar
		actionBar.title = 'RepayApp';
		// change the App Title
		//actionBar.displayHomeAsUp = true; // back icon
		// Show the "angle" pointing back
		actionBar.onHomeIconItemSelected = function() {// what to do when the "home" icon is pressed
			Ti.API.info("Home icon clicked!");
		};
	
		activity.onCreateOptionsMenu = function(e) {
        	e.menu.add({
            	title: "Table Search",
            	icon: (Ti.Android.R.drawable.ic_menu_search ? Ti.Android.R.drawable.ic_menu_search : "/icon/ic_action_search.png"),
            	actionView: $.searchView,
            	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        	});
        	e.menu.add({
            	title: "Save",
            	icon: (Ti.Android.R.drawable.ic_menu_search ? Ti.Android.R.drawable.ic_menu_search : "/icon/ic_action_search.png"),
            	actionView: $.saveMenu,
            	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        	});
    };
		// Make sure icons are updated
		$.index.activity.invalidateOptionsMenu();
	}
	
	if (!Alloy.Globals.CURRENT_USER || Alloy.Globals.CURRENT_USER=="") {
		//Alloy.Globals.CURRENT_USER = "Admin"; 
		Alloy.Globals.login.getView().open();
	}
}

function scrollableViewScrollEnd(e) {
	e.view.fireEvent("open");
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

$.index.open();
