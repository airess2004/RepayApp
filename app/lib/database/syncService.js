
Titanium.include('/common/Queue.src.js');

var syncReimburseList = new Queue(); //[];
var syncReimburseCount = 0;
var syncReimburseTimer;
var syncReimburseLastTime = moment(minDate, dateFormat, lang).toISOString();

var syncReimburseDetList = new Queue(); //[];
var syncReimburseDetCount = 0;
var syncReimburseDetTimer;
var syncReimburseDetLastTime = moment(minDate, dateFormat, lang).toISOString();

var syncTransExp = EXPIRED_TIME;
var syncTransTempID = TRANSLOADIT_TEMPLATEID;
var syncTransKey = TRANSLOADIT_KEY;
var syncTransSign = TRANSLOADIT_SIGNATURE;

var syncCount = 0;
var syncTimer;
var SyncInterval = 5000;

var syncFailed = 0;
var detSyncFailed = 0;

function startSyncReimburse(_win, callback) {
	syncReimburseTimer = setTimeout(syncFunc, SyncInterval);
	
	function syncFunc() {
    	try {
    		Ti.API.warn("Sync Reimburse Start ("+syncReimburseCount+") : "+moment().toISOString());
    		clearTimeout(syncTimer);	
			if (Alloy.Globals.CURRENT_USER && Alloy.Globals.CURRENT_USER != "" && syncReimburseCount == 0) {
				if (syncReimburseList.isEmpty()) {
					syncReimburseCount++;
					localReimburse.getListAll("lastUpdate", "asc", 0, maxInt, "lastUpdate", ">", syncReimburseLastTime, function(ret) {
						if (!ret.error) {
							for (idx in ret) {
								var obj = ret[idx];
								if (!obj.isSync) {
									syncReimburseList.enqueue(obj);
									syncReimburseLastTime = obj.lastUpdate;
								}
							}
						} else {
							syncFailed++;
						}
						syncReimburseCount--;
					}); 
				} else {
					if (callback) callback(syncReimburseList.length, syncReimburseDetList.length);
					var obj = syncReimburseList.dequeue();
					if (obj.gid) {// already existed
						syncReimburseCount++;
						remoteReimburse.updateObject(obj, function(ret2) {
							if (!ret2.error) {
								localReimburse.updateObject(ret2, enqueueUniqueDetails);
								lastSyncReimburseTime = localConfig.createOrUpdateObject("lastSyncReimburseTime",obj.lastUpdate);
							} else {
								syncFailed++;
							}
							syncReimburseCount--;
						});
					} else {// not existed
						if (obj.isDeleted == 1) { // skip upload if unsynced local data was deleted
							lastSyncReimburseTime = localConfig.createOrUpdateObject("lastSyncReimburseTime",obj.lastUpdate);
							localReimburse.deleteObject(obj.id);
						} else {					
							syncReimburseCount++;
							remoteReimburse.addObject(obj, function(ret2, obj2) {
								if (!ret2.error) {
									obj2.gid = ret2.gid;
									syncReimburseCount++;
									remoteReimburse.updateObject(obj2, function(ret3) {
										if (!ret3.error) {
											localReimburse.updateObject(ret3, enqueueUniqueDetails);
											lastSyncReimburseTime = localConfig.createOrUpdateObject("lastSyncReimburseTime",obj.lastUpdate);
										} else {
											syncFailed++;
										}
										syncReimburseCount--;
									});
								} else {
									syncFailed++;
								}
								syncReimburseCount--;
							}); 
						}
					}
				}
			} else if (Alloy.Globals.CURRENT_USER=="") {
				syncReimburseList.clear();
			}
		} catch(ex) {
			Ti.API.error("Sync Reimburse Error ("+syncReimburseCount+") : "+ex.message);
			syncReimburseCount = 0; //syncReimburseCount--;
			//if (syncReimburseCount < 0) syncReimburseCount = 0;
    	} finally {
    		if (syncFailed > 0) {
    			lastSyncReimburseTime = localConfig.findOrCreateObject("lastSyncReimburseTime", moment(minDate, dateFormat, lang).toISOString());
    			if (lastSyncReimburseTime.val < syncReimburseLastTime) syncReimburseLastTime = lastSyncReimburseTime.val;
    			syncFailed = 0;
    		}
    		Ti.API.warn("Sync Reimburse End ("+syncReimburseCount+") : "+moment().toISOString());
    		if (syncReimburseCount < 0) syncReimburseCount = 0;
    		syncReimburseTimer = setTimeout(syncFunc, SyncInterval);
    	}
   };
};

function refreshSyncSignature() {
	getSignatureFromServer(null, function(err, hash, params) {
		if (!err) {
			syncTransExp = params.auth.expires || EXPIRED_TIME;
			syncTransTempID = params.template_id || TRANSLOADIT_TEMPLATEID;
			syncTransKey = params.auth.key || TRANSLOADIT_KEY;
			syncTransSign = hash || TRANSLOADIT_SIGNATURE;
		}						
	});
};

function startSyncReimburseDet(_win, callback) {
	syncReimburseDetTimer = setTimeout(syncFunc, SyncInterval);
	
	function syncFunc() {
    	try {
    		Ti.API.warn("Sync ReimburseDetail Start ("+syncReimburseDetCount+") : "+moment().toISOString());
    		clearTimeout(syncTimer);	
			if (Alloy.Globals.CURRENT_USER && Alloy.Globals.CURRENT_USER != "" && syncReimburseDetCount == 0) {
				if (syncReimburseDetList.isEmpty()) {
					enqueueAllUniqueDetails();
				} else {
					//refreshSyncSignature();
					var obj = syncReimburseDetList.dequeue();
					var proto = obj.urlImageOriginal ? obj.urlImageOriginal.substring(0, 3).toUpperCase() : '';
					if (proto && proto!="HTT" && proto!="FTP") {
						Alloy.Globals.Uploading++;					
						Transloadit.upload({
							expDate : syncTransExp || EXPIRED_TIME, //.format("yyyy/MM/dd HH:mm:ss+00:00"),
							key : syncTransKey || TRANSLOADIT_KEY,
							//notify_url : TRANSLOADIT_NOTIFY, //'http://my-api/hey/file/is/done',
							template : syncTransTempID || TRANSLOADIT_TEMPLATEID,
							//fields : TRANSLOADIT_FIELDS, //{customFormField : true},
							wait : true,
							getSignature : function(params, next) {
								//Ti.API.info(params);
								//https://transloadit.com/docs/api-docs#authentication
								// getSignatureFromServer(params, function(err, hash) {
								// next(err, hash);
								// });
								next(null, syncTransSign || TRANSLOADIT_SIGNATURE);
							},
							file : Ti.Filesystem.getFile(obj.urlImageOriginal)
						}, function(err, assembly) {
							Ti.API.info(err || assembly);
							//console.log(err || assembly);
							if (!err) {
								var oriurl = obj.urlImageOriginal;
								if (assembly.results.thumb)
									obj.urlImageSmall = assembly.results.thumb[0].url;
								if (assembly.results.optimized)
									obj.urlImageOriginal = assembly.results.optimized[0].url;
								// ":origin"
								if (assembly.results.medium)
									obj.urlImageMedium = assembly.results.medium[0].url;
								obj.isSync = 0;
								localReimburseDetail.updateDetailObject(obj, function(ret) {
									if (!ret.error) {
										syncDetail(ret);														
										//-- start update image url of parent
										var list = Alloy.createCollection("reimburse");
										list.fetch({
											remove : false
										});
										var parobj = list.find(function(mdl) {
											return mdl.get('id') == obj.reimburseId;
										});
										if (parobj && parobj.get('first_receipt_original_url')==oriurl) {
											parobj.save({
												first_receipt_original_url : obj.urlImageOriginal,
												first_receipt_mini_url : obj.urlImageSmall,
											});
											parobj.fetch({
												remove : false
											});
										}
										//-- end update url of parent
									} else {
										detSyncFailed++;
										if (ret.error == INVALID_TOKEN) {
											// var dialog = Ti.UI.createAlertDialog({
												// message : L('session_expired'),
												// ok : L('ok'),
												// title : L('relog')
											// });
											// dialog.addEventListener('click', function(e) {
												// //act.hide();
												// ShowLoginForm();
											// });
											// dialog.show({modal:true});
										}
									}
									//act.hide();
								});
								
							} else {
								detSyncFailed++;
								//act.hide();
								if (err.error == TRANSLOADIT_AUTH_EXPIRED) {
									// var dialog = Ti.UI.createAlertDialog({
										// message : L('session_expired'),
										// ok : L('ok'),
										// title : L('relog')
									// });
									// dialog.addEventListener('click', function(e) {
										// act.hide();
										// ShowLoginForm();
									// });
									// dialog.show({modal:true});
									refreshSyncSignature();
								} else {
									var msg = err.source ? (err.source.status + " : " + err.error) : err;
									//notifBox('Error ' + msg);
								}
							}
							Alloy.Globals.Uploading--;
						}); 
					} else {						
						syncDetail(obj);
					}
				}	
			} else if (Alloy.Globals.CURRENT_USER=="") {
				syncReimburseDetList.clear();
			}
    	} catch(ex) {
			Ti.API.error("Sync ReimburseDetail Error ("+syncReimburseDetCount+") : "+ex.message);
			syncReimburseDetCount = 0; //syncReimburseDetCount--;
			//if (syncReimburseDetCount < 0) syncReimburseDetCount = 0;
    	} finally {
    		Ti.API.warn("Sync ReimburseDetail End ("+syncReimburseDetCount+") : "+moment().toISOString());
    		if (detSyncFailed > 0) {
				lastSyncReimburseDetTime = localConfig.findOrCreateObject("lastSyncReimburseDetTime", moment(minDate, dateFormat, lang).toISOString());
				if (lastSyncReimburseDetTime.val < syncReimburseDetLastTime) syncReimburseDetLastTime = lastSyncReimburseDetTime.val;
				detSyncFailed = 0;
    		}
    		if (syncReimburseDetCount < 0) syncReimburseDetCount = 0;
    		syncReimburseDetTimer = setTimeout(syncFunc, SyncInterval);
    	}
   };
};

function syncDetail(obj) {	
	if (obj.gid) {// already existed in server
		syncReimburseDetCount++;
		if (obj.isDeleted == 1) {
			remoteReimburseDetail.deleteDetailObject(obj.gid, function(ret2) {
				if (!ret2.error) {
					lastSyncReimburseDetTime = localConfig.createOrUpdateObject("lastSyncReimburseDetTime", obj.lastUpdate);
					localReimburseDetail.deleteDetailObject(obj.id);
				} else {
					detSyncFailed++;
				}
				syncReimburseDetCount--;
			});
		} else {
			remoteReimburseDetail.updateDetailObject(obj, function(ret2, obj2) {
				if (!ret2.error) {
					for (var attrname in ret2) { obj2[attrname] = ret2[attrname]; }
					localReimburseDetail.updateDetailObject(/*ret2*/obj2);
					lastSyncReimburseDetTime = localConfig.createOrUpdateObject("lastSyncReimburseDetTime", /*obj*/obj2.lastUpdate);
				} else {
					detSyncFailed++;
				}
				syncReimburseDetCount--;
			});
		}
	} else {// not existed in server
		if (obj.isDeleted == 1) {// skip upload if unsynced local data was deleted
			lastSyncReimburseDetTime = localConfig.createOrUpdateObject("lastSyncReimburseDetTime", obj.lastUpdate);
			localReimburseDetail.deleteDetailObject(obj.id);
		} else {
			syncReimburseDetCount++;
			remoteReimburseDetail.addDetailObject(obj, function(ret2, obj2) {
				if (!ret2.error) {
					//obj2.gid = ret2.gid;
					for (var attrname in ret2) { obj2[attrname] = ret2[attrname]; }
					syncReimburseDetCount++;
					remoteReimburseDetail.updateDetailObject(obj2, function(ret3, obj3) {
						if (!ret3.error) {
							for (var attrname in ret3) { obj3[attrname] = ret3[attrname]; }
							localReimburseDetail.updateDetailObject(obj3/*ret3*/);
							lastSyncReimburseDetTime = localConfig.createOrUpdateObject("lastSyncReimburseDetTime", /*obj*/obj3.lastUpdate);
						} else {
							detSyncFailed++;
						}
						syncReimburseDetCount--;
					});
				} else {
					detSyncFailed++;
				}
				syncReimburseDetCount--;
			});
		}
	}
};

function enqueueDetails(par) {
	if (!par.error && par.id>0) {		
		syncReimburseDetCount++;
		localReimburseDetail.getDetailListAll(par.id, "lastUpdate", "asc", 0, maxInt, "lastUpdate", ">", syncReimburseDetLastTime, function(ret) {
			if (!ret.error) {
				for (idx2 in ret) {
					var obj = ret[idx2];
					if (!obj.isSync) {
						syncReimburseDetList.enqueue(obj);
						if (syncReimburseDetLastTime < obj.lastUpdate ) syncReimburseDetLastTime = obj.lastUpdate;
					}
				}
			}
			syncReimburseDetCount--;
		}); 
	} else {
		syncFailed++;
	}
};

function enqueueAllDetails() {			
	syncReimburseDetCount++;
	localReimburseDetail.getDetailListAll(null, "lastUpdate", "asc", 0, maxInt, "lastUpdate", ">", syncReimburseDetLastTime, function(ret) {
		if (!ret.error) {
			for (idx2 in ret) {
				var obj = ret[idx2];
				if (!obj.isSync) {
					syncReimburseDetList.enqueue(obj);
					if (syncReimburseDetLastTime < obj.lastUpdate ) syncReimburseDetLastTime = obj.lastUpdate;
				}
			}
		}
		syncReimburseDetCount--;
	}); 
};

function enqueueUniqueDetails(par) {
	if (!par.error && par.id>0) {		
		syncReimburseDetCount++;
		localReimburseDetail.getDetailListAll(par.id, "lastUpdate", "desc", 0, maxInt, "lastUpdate", ">", syncReimburseDetLastTime, function(ret) {
			if (!ret.error) {
				for (idx2 in ret) {
					var obj = ret[idx2];
					if (!obj.isSync) {
						var qidx = null;
						var qobj = null;
						var detList = syncReimburseDetList.getList();
						var detOffset = syncReimburseDetList.getOffset();
						for (var i=detOffset, iLen=detList.length; i<iLen; i++) {
    						if (detList[i].id == obj.id && !detList[i].gid) {
    							qidx = i;
    							qobj = arr[i];
    							break;
    						}
  						}
						if(qidx === null) { // object not in queue yet or already in queue and already have gid
							syncReimburseDetList.enqueue(obj);
							if (syncReimburseDetLastTime < obj.lastUpdate ) syncReimburseDetLastTime = obj.lastUpdate;
						} else { //object already in queue but doesn't have gid yet, so we need to replace the object with newer one before it's sent to server
							syncReimburseDetList.replaceAt(qidx-detOffset, obj);
							if (syncReimburseDetLastTime < obj.lastUpdate ) syncReimburseDetLastTime = obj.lastUpdate;
						}
						//detList = null;
					}
				}
			}
			syncReimburseDetCount--;
		}); 
	} else {
		syncFailed++;
	}
};

function enqueueAllUniqueDetails() {			
	syncReimburseDetCount++;
	localReimburseDetail.getDetailListAll(null, "lastUpdate", "desc", 0, maxInt, "lastUpdate", ">", syncReimburseDetLastTime, function(ret) {
		if (!ret.error) {
			for (idx2 in ret) {
				var obj = ret[idx2];
				if (!obj.isSync) {
					var qidx = null;
					var qobj = null;
					var detList = syncReimburseDetList.getList();
					var detOffset = syncReimburseDetList.getOffset();
					for (var i=detOffset, iLen=detList.length; i<iLen; i++) {
    					if (detList[i].id == obj.id && !detList[i].gid) {
    						qidx = i;
    						qobj = arr[i];
    						break;
    					}
  					}
					if(qidx === null) { // object not in queue yet or already in queue and already have gid
						syncReimburseDetList.enqueue(obj);
						if (syncReimburseDetLastTime < obj.lastUpdate ) syncReimburseDetLastTime = obj.lastUpdate;
					} else { //object already in queue but doesn't have gid yet, so we need to replace the object with newer one before it's sent to server
						syncReimburseDetList.replaceAt(qidx-detOffset, obj);
						if (syncReimburseDetLastTime < obj.lastUpdate ) syncReimburseDetLastTime = obj.lastUpdate;
					}
					//detList = null;
				}
			}
		}
		syncReimburseDetCount--;
	}); 
};

Alloy.Globals.Uploading = 0;
var syncAnimateTimer;
function setSyncAnimateCallback(callback) {
	syncAnimateTimer = setTimeout(intervalFunc, 50);
	
	function intervalFunc(e) {
		try {
			clearTimeout(syncTimer);
			if (syncReimburseCount > 0 || syncReimburseDetCount > 0 || Alloy.Globals.Uploading > 0 || !syncReimburseList.isEmpty() || !syncReimburseDetList.isEmpty()) {
				if (callback) callback(e);
			}
		} finally {
			syncAnimateTimer = setTimeout(intervalFunc, 50);
		}
	}
}

function createSyncService() {
	var IntervalSECONDS = 300;
    // every 5 minutes
    var intent = Titanium.Android.createServiceIntent({
        url : 'androidService.js'
    });
    intent.putExtra('interval', IntervalSECONDS * 1000);
    //in milliseconds
    // A message that the service should 'echo'
	//intent.putExtra('message_to_echo', 'Titanium rocks!');
    
    var service = Titanium.Android.createService(intent);
     
	service.addEventListener('resume', function(e) {
		//Titanium.API.info('Service code resumes, iteration ' + e.iteration);
	});
	
	service.addEventListener('pause', function(e) {
		//Titanium.API.info('Service code pauses, iteration ' + e.iteration);
		//if (e.iteration === 3) {
			//Titanium.API.info('Service code has run 3 times, will now stop it.');
			//service.stop();
		//}
	}); 

    service.start();
};
