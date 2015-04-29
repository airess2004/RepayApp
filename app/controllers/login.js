var args = arguments[0] || {};
exports.currentObj = {};
var postData = {
	token : SERVER_KEY,
	method : 'get',
	sortby : 'id',
	order : 'desc',
	offset : 0,
	max : 20,
	model : {
		id : 0,
	},
};
var register = Alloy.createController("register");

function onSignInClick(e) {
	// if (String.format($.userField.value).trim().toUpperCase() == "ADMIN" && $.passField.value == "sysadmin") {
		// if (Alloy.Globals.scrollableView)
			// Alloy.Globals.scrollableView.views[Alloy.Globals.scrollableView.currentPage].fireEvent("open");
		// $.loginForm.close();
	// } else {
		// alert("Access Denied!\nInvalid username / password.");
	// }

	var logging = false;
	if (!logging) {
		logging = true;
		// act.show({
			// modal : true
		// });
		// EXPIRED_TIME = moment().add(2, 'hours');
		var item = {
			username : String.format($.userField.value).trim().toUpperCase(),
			passwordHash : $.passField.value,
			//fullname : nameField.value,
		};
		var db = require('/lib/login');
		db.login(item, function(result) {
			// act.hide();
			if (result.error) {
				alert('Access Denied! ' + result.error);

				exports.currentObj = item;
			} else {
				
				// e.source.parent.skipIntro = true;
				SERVER_KEY = result.token;
				TRANSLOADIT_SIGNATURE = result.hash;
				TRANSLOADIT_PARAMS = result.model;
				TRANSLOADIT_TEMPLATEID = TRANSLOADIT_PARAMS.template_id;
				TRANSLOADIT_NOTIFY = TRANSLOADIT_PARAMS.notify_url;
				TRANSLOADIT_FIELDS = TRANSLOADIT_PARAMS.fields;
				TRANSLOADIT_KEY = TRANSLOADIT_PARAMS.auth.key;
				EXPIRED_TIME = TRANSLOADIT_PARAMS.auth.expires;
				//moment.parseZone(TRANSLOADIT_PARAMS.auth.expires).format("yyyy/MM/dd HH:mm:ss+00:00");
				exports.currentObj = item;
				$.loginForm.close();
				
			}
		});
		logging = false;
	}
 

}

function showResetDialog(e) {
	$.resetDialog.show();
};

function doResetClick(e) {
	if (e.index == 0) {
		$.toast.show();
	}
};

function showSignUpForm(e) {
	register.getView().open();
	$.loginForm.close();
};

function userFocus(e) {
	//$.userField.removeEventListener("focus", userFocus);
	//$.userField.blur();
	//Ti.UI.Android.hideSoftKeyboard();
};

function loginOpen(e) {
	if ($.userField.value && $.userField.value != "")
		$.passField.value = "";
	$.userField.blur();
	$.signIn.focus();
}

function loginClose(e) {
	//if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[Alloy.Globals.scrollableView.currentPage].fireEvent("open");
}

$.signIn.focus();
