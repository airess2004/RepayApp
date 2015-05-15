var args = arguments[0] || {};


function signOutClick(e) {
	Alloy.Globals.login.getView().open();;
}

function syncClick(e) {
	
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