var args = arguments[0] || {};

//var login = Alloy.createController("login").getView();

function onSignUpClick(e) {
	if (String.format($.userField.value).trim().toUpperCase() != "") {
		$.toast.show();
		showSignInForm(e);
	} else {
		alert("Failed! Email must not be empty.");
	}
}

function showSignInForm(e){
	Alloy.Globals.login.getView().open();
	$.registerForm.close();
	
};

function userFocus(e){
	//$.userField.removeEventListener("focus", userFocus);
	//$.userField.blur();
    //Ti.UI.Android.hideSoftKeyboard();
};

function registerOpen(e) {
	if (this.getActivity()) {
		var actionBar = this.getActivity().getActionBar();
    	actionBar.hide();
    }
	$.userField.blur();
	$.passField.blur();
	$.passField2.blur();
	$.signUp.focus();	
}

$.signUp.focus();