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
	Ti.API.info("You clicked the button");
		if (!logging) {
			// EXPIRED_TIME = moment().add(2, 'hours');
			var item = {
				username : $.userField.value ? $.userField.value : '',
				passwordHash : $.passField.value,
				//fullname : nameField.value,
			};
			// Validation
			if (item.username==null || item.username=="") {
				alert(L('no_username'));
				return false;
			} else if (item.passwordHash==null || item.passwordHash=="") {
				alert(L('no_password'));
				return false;
			}
			logging = true;
			act.show({modal : true});
			//var db = require('database/default/postgresql_user');
			var LastTimeStamp = moment.utc();
			remoteUser.login(item, function(result) {
				act.hide();
				if (result.error) {
					alert(L('access_denied')+"\n" + result.error);
				} else {
					e.source.parent.skipIntro = true;
					if (!isTimeInSync(result.timeStamp, LastTimeStamp)) {
						alert(L('incorrect_time'));
					} else {	
						var preCURRENT_USER = item.username.trim().toUpperCase(); // save to local var first to prevent syncService from syncing when all required last data not ready yet
						lastUsername = localConfig.createOrUpdateObject("lastUsername",item.username.trim(), "");
						skipIntro = localConfig.createOrUpdateObject("skipIntro", e.source.parent.skipIntro.toString(),"");
						lastSyncReimburseTime = localConfig.findOrCreateObject("lastSyncReimburseTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
						lastSyncReimburseDetTime = localConfig.findOrCreateObject("lastSyncReimburseDetTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
						lastSyncReimburseToken = localConfig.findOrCreateObject("lastSyncReimburseToken", "", preCURRENT_USER);
						lastSyncReimburseDetToken = localConfig.findOrCreateObject("lastSyncReimburseDetToken", "", preCURRENT_USER);
						CURRENT_NAME = result.model.fullname;
						SERVER_KEY = result.token;
						TRANSLOADIT_SIGNATURE = result.hash;
						TRANSLOADIT_PARAMS = JSON.parse(result.param);
						TRANSLOADIT_TEMPLATEID = TRANSLOADIT_PARAMS.template_id;
						TRANSLOADIT_NOTIFY = TRANSLOADIT_PARAMS.notify_url;
						TRANSLOADIT_FIELDS = TRANSLOADIT_PARAMS.fields;
						TRANSLOADIT_KEY = TRANSLOADIT_PARAMS.auth.key;
						EXPIRED_TIME = TRANSLOADIT_PARAMS.auth.expires;
						//moment.parseZone(TRANSLOADIT_PARAMS.auth.expires).format("yyyy/MM/dd HH:mm:ss+00:00");
						CURRENT_USER = preCURRENT_USER;
						exports.currentObj = item;
						//p.win.hide();//.blur();
						// for (var idx in par.children) {
						// par.children[idx].hide();
						// }
						// par.removeAllChildren();
						//create & add main view
						//par.exitOnClose = false;
						$.loginForm.close();
					}
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
