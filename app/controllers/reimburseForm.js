var args = arguments[0] || {};
var moment = require('alloy/moment');
Alloy.Globals.cameraShown = false;

function reimburseFormViewOpen(e) {
	var activity = $.reimburseFormView.getActivity();
		if (activity) {
		var actionBar = activity.getActionBar();
		// get a handle to the action bar
		actionBar.title = 'Reimburse';
		// change the App Title
		actionBar.displayHomeAsUp = true; // back icon
		// Show the "angle" pointing back
		actionBar.onHomeIconItemSelected = function() {// what to do when the "home" icon is pressed
			Ti.API.info("Home icon clicked!");
		};
	
		activity.onCreateOptionsMenu = function(e) {
        	e.menu.add({
            	title: "Save",
            	// icon: (Ti.Android.R.drawable.ic_menu_search ? Ti.Android.R.drawable.ic_menu_search : "/icon/ic_action_search.png"),
            	actionView: $.saveMenu,
            	showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS | Ti.Android.SHOW_AS_ACTION_COLLAPSE_ACTION_VIEW
        	});
    };
		// Make sure icons are updated
		$.reimburseFormView.activity.invalidateOptionsMenu();
	}
}

function doSearch(e) {
	alert("Search Clicked");
}

function doSave(e) {
	alert("Save Clicked");
}

var picker = Ti.UI.createPicker({
	type : Ti.UI.PICKER_TYPE_DATE,
	value : new Date()
});

function dateFieldClick(e) {
	picker.showDatePickerDialog({
		value : moment().toDate(),
		callback : function(e) {
			if (e.cancel) {
			} else {
				$.dateField.value =  moment(e.value).format("YYYY-MM-DD");
			}
		}
	});
}

