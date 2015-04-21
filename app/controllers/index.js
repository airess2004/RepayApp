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
	var actionBar = $.index.getActivity().getActionBar();
	// get a handle to the action bar
	actionBar.title = 'RepayApp';
	// change the App Title
	//actionBar.displayHomeAsUp = true; // back icon
	// Show the "angle" pointing back
	actionBar.onHomeIconItemSelected = function() {// what to do when the "home" icon is pressed
		Ti.API.info("Home icon clicked!");
	};
	// Make sure icons are updated
	$.index.activity.invalidateOptionsMenu();
	
	if (!Alloy.Globals.CURRENT_USER || Alloy.Globals.CURRENT_USER=="") {
		Alloy.Globals.CURRENT_USER = "Admin"; 
		//Alloy.Globals.login.getView().open();
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
