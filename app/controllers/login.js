var args = arguments[0] || {};

function onSignInClick(e) {
	if (String.format($.userField.value).trim().toUpperCase() == "ADMIN" && $.passField.value == "sysadmin") {
		$.loginForm.close();
	} else {
		alert("Access Denied!\nInvalid username / password.");
	}
}

function showResetDialog(){
    $.resetDialog.show();
};

function doResetClick(e){
	if (e.index == 0) {
    	$.toast.show();
	}
};

function showSignUpForm(e){
	var registerView = Alloy.createController("register").getView().open();
	$.loginForm.close();
};
