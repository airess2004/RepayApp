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

Alloy.Globals.logging = false;
function onSignInClick(e) {
	Ti.API.info("You clicked the button");
	if (!Alloy.Globals.logging) {
		if (Alloy.Globals.gcmRegId==null || Alloy.Globals.gcmRegId=="") {
			libgcm.registerGCM(function(evt) {
				Alloy.Globals.gcmRegId = evt.deviceToken;
			});
		}
		// EXPIRED_TIME = moment().add(2, 'hours');
		var item = {
			username : $.userField.value ? $.userField.value : '',
			passwordHash : $.passField.value,
			//fullname : nameField.value,
			deviceToken: Alloy.Globals.gcmRegId,
		};
		// Validation
		if (item.username == null || item.username == "") {
			alert(L('no_username'));
			return false;
		} else if (item.passwordHash == null || item.passwordHash == "") {
			alert(L('no_password'));
			return false;
		}
		Alloy.Globals.logging = true;
		Ti.UI.Android.hideSoftKeyboard();
		$.act.show({
			modal : true
		});
		//var db = require('database/default/remote_user');
		var LastTimeStamp = moment.utc();
		remoteUser.login(item, function(result) {
			$.act.hide();
			if (result.error) {
				libgcm.unregGCM();
				alert(L('failed') + "\n" + result.error);
			} else {
				e.source.parent.skipIntro = true;
				// if (!isTimeInSync(result.timeStamp, LastTimeStamp)) {
					// alert(L('incorrect_time'));
				// } else 
				{
					var preCURRENT_USER = item.username.trim().toUpperCase();
					// save to local var first to prevent syncService from syncing when all required last data not ready yet
					lastUsername = localConfig.createOrUpdateObject("lastUsername", item.username.trim(), "");
					skipIntro = localConfig.createOrUpdateObject("skipIntro", e.source.parent.skipIntro.toString(), "");
					lastSyncReimburseTime = localConfig.findOrCreateObject("lastSyncReimburseTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
					lastSyncReimburseDetTime = localConfig.findOrCreateObject("lastSyncReimburseDetTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
					lastSyncReimburseToken = localConfig.findOrCreateObject("lastSyncReimburseToken", "", preCURRENT_USER);
					lastSyncReimburseDetToken = localConfig.findOrCreateObject("lastSyncReimburseDetToken", "", preCURRENT_USER);
					lastFullname = localConfig.createOrUpdateObject("lastFullname", result.fullname?result.fullname.trim():result.fullname, preCURRENT_USER);
					lastToken = localConfig.createOrUpdateObject("lastToken", result.token, preCURRENT_USER);
					lastAvatar = localConfig.createOrUpdateObject("lastAvatar", result.original_avatar_url, preCURRENT_USER);
					lastMiniAvatar = localConfig.createOrUpdateObject("lastMiniAvatar", result.mini_avatar_url, preCURRENT_USER);
					if (Alloy.Globals.gcmRegId && Alloy.Globals.gcmRegId!="") lastDeviceToken = localConfig.createOrUpdateObject("lastDeviceToken", Alloy.Globals.gcmRegId, preCURRENT_USER);
					CURRENT_NAME = result.fullname?result.fullname.trim():result.fullname;
					SERVER_KEY = result.token;
					//TRANSLOADIT_SIGNATURE = result.hash;
					//TRANSLOADIT_PARAMS = JSON.parse(result.param);
					//TRANSLOADIT_TEMPLATEID = TRANSLOADIT_PARAMS.template_id;
					//TRANSLOADIT_NOTIFY = TRANSLOADIT_PARAMS.notify_url;
					//TRANSLOADIT_FIELDS = TRANSLOADIT_PARAMS.fields;
					//TRANSLOADIT_KEY = TRANSLOADIT_PARAMS.auth.key;
					//EXPIRED_TIME = TRANSLOADIT_PARAMS.auth.expires;
					////moment.parseZone(TRANSLOADIT_PARAMS.auth.expires).format("yyyy/MM/dd HH:mm:ss+00:00");
					Alloy.Globals.lastSyncReimburseTime = lastSyncReimburseTime.val;
					Alloy.Globals.lastSyncReimburseDetTime = lastSyncReimburseDetTime.val;
					Alloy.Globals.lastSyncReimburseToken = lastSyncReimburseToken.val;
					Alloy.Globals.lastSyncReimburseDetToken = lastSyncReimburseDetToken.val;
					syncReimburseLastTime = lastSyncReimburseTime.val;
					syncReimburseDetLastTime = lastSyncReimburseDetTime.val;
					Alloy.Globals.profileImage.image = result.original_avatar_url || result.mini_avatar_url || "/icon/ic_action_user.png";
					Alloy.Globals.avatar.image = Alloy.Globals.profileImage.image;
					Alloy.Globals.CURRENT_NAME = CURRENT_NAME;
					CURRENT_USER = preCURRENT_USER;
					Alloy.Globals.CURRENT_USER = CURRENT_USER;
					exports.currentObj = item;
					
					refreshSyncSignature();
					
					if (Alloy.Globals.homeAct) Alloy.Globals.homeAct.show();
					if (Alloy.Globals.reimburseAct) Alloy.Globals.reimburseAct.show();
					getFirstList(function (ret1,ret2) {
						if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[0].fireEvent("update");
						//if (Alloy.Globals.homeAct) Alloy.Globals.homeAct.hide();
					}, function (ret) {
						if (Alloy.Globals.reimburseAct) Alloy.Globals.reimburseAct.hide();
					});
					
					//p.win.hide();//.blur();
					// for (var idx in par.children) {
					// par.children[idx].hide();
					// }
					// par.removeAllChildren();
					//create & add main view
					//par.exitOnClose = false;
					if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[1].fireEvent("refresh");
					//if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[0].fireEvent("refresh");
					if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[0].fireEvent("open");
					$.loginForm.exitOnClose = false;
					$.loginForm.close();
				}
			}
		});
		Alloy.Globals.logging = false;
	}
}

function doResetClick(e) {
	if (e.index == 0) {
		$.toast.show();
	}
	Alloy.Globals.clickUsed = false;
};
	 
Alloy.Globals.clickUsed = false;
function showResetDialog(e) {
	if (!Alloy.Globals.clickUsed) {
		Alloy.Globals.clickUsed = true;
		var resetDialog = Ti.UI.createAlertDialog({
			//title: "Confirm",
			message : "Send password reset email?",
			buttonNames : ["Yes", "No"],
			cancel : 1
		});
		resetDialog.addEventListener('click', doResetClick);
		resetDialog.show();
	}
};

function showSignUpForm(e) {
	$.loginForm.exitOnClose = false;
	register.getView().open();
	$.loginForm.close();
};

function userFocus(e) {
	//$.userField.removeEventListener("focus", userFocus);
	//$.userField.blur();
	//Ti.UI.Android.hideSoftKeyboard();
};

function loginOpen(e) {
	$.loginForm.exitOnClose = true;
	if ($.loginForm.getActivity()) {
		var actionBar = $.loginForm.getActivity().getActionBar();
    	actionBar.hide();
    }
    if(lastUsername && lastUsername!="") $.userField.value = lastUsername.val;
	if ($.userField.value && $.userField.value != "")
		$.passField.value = "";
	$.userField.blur();
	$.passField.blur();
	$.signIn.focus();
}

function loginClose(e) {
	//if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[Alloy.Globals.scrollableView.currentPage].fireEvent("open");	
}

$.signIn.focus();
