var args = arguments[0] || {};

//var login = Alloy.createController("login").getView();

function onSignUpClick(e) {
	$.signUp.touchEnabled = false;
	Ti.UI.Android.hideSoftKeyboard();
	$.act.show();
	if (String.format($.userField.value).trim().toUpperCase() != "") {
		var item = {
			fullname: $.nameField.value.trim(),
			email: $.userField.value.trim(),
			password: $.passField.value,
			password2: $.passField2.value,
		};
		remoteUser.addObject(item, function(result) {
			if (result.error) {
				alert(result.error);
			} else {
				var users = Alloy.Collections.user;
				var user = Alloy.createModel("user", result);
				users.add(user, {merge:true});
				user.save();
				user.fetch({remove:false});
				$.toast.show();
				//showSignInForm(e);
				$.registerForm.close();
			}
			$.act.hide();
			$.signUp.touchEnabled = true;
		});
	} else {
		alert("Failed! Email must not be empty.");
	}
}

function showSignInForm(e){
	Alloy.Globals.login.getView().open();
	$.registerForm.close();
	
};

function nameFocus(e){
	//$.nameField.removeEventListener("focus", nameFocus);
	//$.nameField.blur();
    //Ti.UI.Android.hideSoftKeyboard();
};

function registerOpen(e) {
	if ($.registerForm.getActivity()) {
		var actionBar = $.registerForm.getActivity().getActionBar();
    	actionBar.hide();
    }
    $.nameField.blur();
	$.userField.blur();
	$.passField.blur();
	$.passField2.blur();
	$.signUp.focus();	
}

$.signUp.focus();