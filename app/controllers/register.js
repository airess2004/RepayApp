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
	$.userField.blur();
    Ti.UI.Android.hideSoftKeyboard();
};