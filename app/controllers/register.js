var args = arguments[0] || {};

//var login = Alloy.createController("login").getView();

function onSignUpClick(e) {
	$.signUp.touchEnabled = false;
	Ti.UI.Android.hideSoftKeyboard();
	$.act.show();
	if (String.format($.userField.value).trim().toUpperCase() != "") {
		if (Alloy.Globals.gcmRegId==null || Alloy.Globals.gcmRegId=="") {
			libgcm.registerGCM(function(evt) {
				Alloy.Globals.gcmRegId = evt.deviceToken;
			});
		}
		var item = {
			fullname: $.nameField.value.trim(),
			email: $.userField.value.trim(),
			username: $.userField.value.trim(),
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
				//-- update globals		
				var preCURRENT_USER = item.username.trim().toUpperCase();
				// save to local var first to prevent syncService from syncing when all required last data not ready yet
				lastUsername = localConfig.createOrUpdateObject("lastUsername", item.username.trim(), "");
				//skipIntro = localConfig.createOrUpdateObject("skipIntro", e.source.parent.skipIntro.toString(), "");
				lastSyncReimburseTime = localConfig.findOrCreateObject("lastSyncReimburseTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
				lastSyncReimburseDetTime = localConfig.findOrCreateObject("lastSyncReimburseDetTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
				lastSyncReimburseToken = localConfig.findOrCreateObject("lastSyncReimburseToken", "", preCURRENT_USER);
				lastSyncReimburseDetToken = localConfig.findOrCreateObject("lastSyncReimburseDetToken", "", preCURRENT_USER);
				lastFullname = localConfig.createOrUpdateObject("lastFullname", result.fullname?result.fullname.trim():result.fullname, preCURRENT_USER);
				lastToken = localConfig.createOrUpdateObject("lastToken", result.token, preCURRENT_USER);
				lastAvatar = localConfig.createOrUpdateObject("lastAvatar", result.original_avatar_url, preCURRENT_USER);
				lastMiniAvatar = localConfig.createOrUpdateObject("lastMiniAvatar", result.mini_avatar_url, preCURRENT_USER);
				if (Alloy.Globals.gcmRegId && Alloy.Globals.gcmRegId != "") 
					lastDeviceToken = localConfig.createOrUpdateObject("lastDeviceToken", Alloy.Globals.gcmRegId, preCURRENT_USER);
				CURRENT_NAME = result.fullname?result.fullname.trim():result.fullname;
				SERVER_KEY = result.token; 	
				Alloy.Globals.lastSyncReimburseTime = lastSyncReimburseTime.val;
				Alloy.Globals.lastSyncReimburseDetTime = lastSyncReimburseDetTime.val;
				Alloy.Globals.lastSyncReimburseToken = lastSyncReimburseToken.val;
				Alloy.Globals.lastSyncReimburseDetToken = lastSyncReimburseDetToken.val;	
				syncReimburseLastTime = lastSyncReimburseTime.val;
				syncReimburseDetLastTime = lastSyncReimburseDetTime.val;		
				//Alloy.Globals.profileImage.image = result.original_avatar_url || result.mini_avatar_url || "/icon/ic_action_user.png";
				//Alloy.Globals.avatar.image = Alloy.Globals.profileImage.image;
				Alloy.Globals.CURRENT_NAME = CURRENT_NAME;
				CURRENT_USER = preCURRENT_USER;
				Alloy.Globals.CURRENT_USER = CURRENT_USER;
				exports.currentObj = item;

				refreshSyncSignature(); 
				//-- end update
				if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[0].fireEvent("open");
				$.toast.show();
				$.registerForm.exitOnClose = false;
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
	$.registerForm.exitOnClose = false;
	Alloy.Globals.login.getView().open();
	$.registerForm.close();
	
};

function nameFocus(e){
	//$.nameField.removeEventListener("focus", nameFocus);
	//$.nameField.blur();
    //Ti.UI.Android.hideSoftKeyboard();
};

function registerOpen(e) {
	$.registerForm.exitOnClose = true;
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