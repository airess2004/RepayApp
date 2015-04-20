var args = arguments[0] || {};

function onSignUpClick(e) {
	if (String.format($.userField.value).trim().toUpperCase() != "") {
		$.toast.show();
		showSignInForm(e);
	} else {
		alert("Failed! Username / email must not be empty.");
	}
}

function showSignInForm(e){
	var registerView = Alloy.createController("login").getView().open();
	$.registerForm.close();
};
