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
					CURRENT_NAME = result.fullname;
					SERVER_KEY = result.token;
					//TRANSLOADIT_SIGNATURE = result.hash;
					//TRANSLOADIT_PARAMS = JSON.parse(result.param);
					//TRANSLOADIT_TEMPLATEID = TRANSLOADIT_PARAMS.template_id;
					//TRANSLOADIT_NOTIFY = TRANSLOADIT_PARAMS.notify_url;
					//TRANSLOADIT_FIELDS = TRANSLOADIT_PARAMS.fields;
					//TRANSLOADIT_KEY = TRANSLOADIT_PARAMS.auth.key;
					//EXPIRED_TIME = TRANSLOADIT_PARAMS.auth.expires;
					////moment.parseZone(TRANSLOADIT_PARAMS.auth.expires).format("yyyy/MM/dd HH:mm:ss+00:00");
					CURRENT_USER = preCURRENT_USER;
					Alloy.Globals.CURRENT_NAME = CURRENT_NAME;
					Alloy.Globals.CURRENT_USER = CURRENT_USER;
					Alloy.Globals.profileImage.image = result.original_avatar_url || result.mini_avatar_url || "/icon/ic_action_user.png";
					Alloy.Globals.avatar.image = Alloy.Globals.profileImage.image;
					exports.currentObj = item;
					
					refreshSyncSignature();
					
					remoteReimburse.getAssList("reimburse_submitted_at", "DESC", 0, 20, null, null, null, function(ret1, ret2) {
						if (!ret1.error) {
							var reimburses_ass = Alloy.Collections.reimburse_ass;
							reimburses_ass.fetch({remove:false}); // Make sure collection is in sync
							var reimburseDetails_ass = Alloy.Collections.reimburseDetail_ass;
							reimburseDetails_ass.fetch({remove:false}); // Make sure collection is in sync
							
							// for (var i = reimburseDetails.models.length-1; i >= 0; i--) {
  								// reimburseDetails.models[i].destroy();        
							// };						
							// for (var i = reimburses.models.length-1; i >= 0; i--) {
  								// reimburses.models[i].destroy();        
							// };
							
							for (var key in ret1) {
								var obj = ret1[key];
								var obj2 = reimburses_ass.find(function(mdl) {
									return mdl.get('gid') == obj.gid;
								}); //findWhere({gid : obj.gid});
								//if (!obj2) 
								{
									if (!obj2) obj2 = Alloy.createModel("reimburse_ass", obj);
									reimburses_ass.add(obj2, {merge: true});
									obj2.save({}, {
										success: function(par) {
											//par.fetch({remove:false});
											for (var key2 in ret2) {
												var det = ret2[key2];
												if (det.reimburseGid == par.get('reimburse_gid')) {
													var det2 = reimburseDetails_ass.find(function(mdl) {
														return mdl.get('gid') == det.gid;
													}); //findWhere({gid : det.gid});
													//if (!det2) 
													{
														det.reimburseId = par.id;
														if (!det2) det2 = Alloy.createModel("reimburseDetail_ass", det);
														reimburseDetails_ass.add(det2, {merge: true});
														det2.save();
														//det2.fetch({remove:false});
													}
												}
											}
										}
									});
								}
							}						
							
							
							// Alloy.Collections.reimburse_ass.reset(ret1);
							// Alloy.Collections.reimburseDetail_ass.reset(ret2);
// 							
							// Alloy.Collections.reimburse_ass.forEach(function(model){
								// model.save();
							// });
							// Alloy.Collections.reimburseDetail_ass.forEach(function(model){
								// model.save();
							// });
							
							//Alloy.Collections.reimburse_ass.fetch({remove:false});
							//Alloy.Collections.reimburseDetail_ass.fetch({remove:false});
							// for(var obj in ret1) {
								// var model = Alloy.createModel("reimburse_ass", ret1[obj]);
								// Alloy.Collections.reimburse_ass.add(model);
								// model.save();
							// }
							// for(var obj in ret2) {
								// var model = Alloy.createModel("reimburseDetail_ass", ret2[obj]);
								// Alloy.Collections.reimburseDetail_ass.add(model);
								// model.save();
							// }
							if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[0].fireEvent("refresh");
						} else {
							alert(ret1.error);
						}
						
						remoteReimburse.getList("updated_at", "DESC", 0, 20, null, null, null, function(ret) {
							if (!ret.error) {
								var reimburses = Alloy.Collections.reimburse;
								reimburses.fetch({remove:false}); // Make sure collection is in sync
							
								for (var key3 in ret) {
									var obj3 = ret[key3];
									var obj4 = reimburses.find(function(mdl) {
										return mdl.get('gid') == obj3.gid;
									}); //findWhere({gid : obj.gid});
									//TODO: if already exist check use newer one (updated_at, local or remote)
									//if (!obj2) 
									{
										if (!obj4) obj4 = Alloy.createModel("reimburse", obj3);
										reimburses.add(obj4, {merge: true});
										obj4.save();
										//obj2.fetch({remove:false});
									}
								}
								if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[1].fireEvent("refresh");
							} else {
								alert(ret.error);
							}
						});
					});
					
					//p.win.hide();//.blur();
					// for (var idx in par.children) {
					// par.children[idx].hide();
					// }
					// par.removeAllChildren();
					//create & add main view
					//par.exitOnClose = false;
					if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[1].fireEvent("refresh");
					if (Alloy.Globals.scrollableView) Alloy.Globals.scrollableView.views[0].fireEvent("refresh");
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
	register.getView().open();
	$.loginForm.close();
};

function userFocus(e) {
	//$.userField.removeEventListener("focus", userFocus);
	//$.userField.blur();
	//Ti.UI.Android.hideSoftKeyboard();
};

function loginOpen(e) {
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
