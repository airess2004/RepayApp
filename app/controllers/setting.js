var args = arguments[0] || {};


function signOutClick(e) {
	Alloy.Globals.login.getView().open();;
}

function syncClick(e) {
	
}

$.setting.addEventListener("open", function(e){
	Alloy.Globals.index.getActivity().getActionBar().title = "Setting";
	//Alloy.Globals.newMenu.visible = false;
	// Make sure icons are updated
	//Alloy.Globals.index.activity.invalidateOptionsMenu();
	//$.tableView.search = Alloy.Globals.searchView;
	//showList(e);
});