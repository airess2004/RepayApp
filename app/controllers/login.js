var args = arguments[0] || {};

var register = Alloy.createController("register");

function onSignInClick(e) {
	if (String.format($.userField.value).trim().toUpperCase() == "ADMIN" && $.passField.value == "sysadmin") {
		$.loginForm.close();
	} else {
		alert("Access Denied!\nInvalid username / password.");
	}
}

function showResetDialog(e){
    $.resetDialog.show();
};

function doResetClick(e){
	if (e.index == 0) {
    	$.toast.show();
	}
};

function showSignUpForm(e){
	register.getView().open();
	$.loginForm.close();
};

function userFocus(e){
	//$.userField.removeEventListener("focus", userFocus);
	//$.userField.blur();
    //Ti.UI.Android.hideSoftKeyboard();
};

function loginOpen(e) {
	$.userField.blur();
	$.signIn.focus();	
}

$.signIn.focus();
