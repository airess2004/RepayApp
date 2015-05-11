
Titanium.include('/common/Queue.src.js');

var syncReimburseList = new Queue(); //[];
var syncReimburseCount = 0;
var syncReimburseTimer;
var syncReimburseLastTime = moment(minDate, dateFormat, lang).toISOString();

var syncReimburseDetList = new Queue(); //[];
var syncReimburseDetCount = 0;
var syncReimburseDetTimer;
var syncReimburseDetLastTime = moment(minDate, dateFormat, lang).toISOString();

var syncCount = 0;
var syncTimer;
var SyncInterval = 5000;

function startSyncReimburse(_win, callback) {
	syncReimburseTimer = setTimeout(syncFunc, SyncInterval);
	
	function syncFunc() {
    	try {
    		Ti.API.warn("Sync Reimburse Start ("+syncReimburseCount+") : "+moment().toISOString());
    		clearTimeout(syncTimer);	
			if (CURRENT_USER && CURRENT_USER != "" && syncReimburseCount == 0) {
				if (syncReimburseList.isEmpty()) {
					syncReimburseCount++;	
					localReimburse.getListAll("lastUpdate", "asc", 0, maxInt, "lastUpdate", ">", syncReimburseLastTime, function(ret) {
						if (!ret.error) {
							for (idx in ret) {
								var obj = ret[idx];
								if (!obj.isSynced) {
									syncReimburseList.enqueue(obj);
									syncReimburseLastTime = obj.lastUpdate;
								}
							}
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
								localReimburse.updateObject(ret2, enqueueDetails);
								lastSyncReimburseTime = localConfig.createOrUpdateObject("lastSyncReimburseTime",obj.lastUpdate);
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
											localReimburse.updateObject(ret3, enqueueDetails);
											lastSyncReimburseTime = localConfig.createOrUpdateObject("lastSyncReimburseTime",obj.lastUpdate);
										}
										syncReimburseCount--;
									});
								}
								syncReimburseCount--;
							}); 
						}
					}
				}
			} else if (CURRENT_USER=="") {
				syncReimburseList.clear();
			}
		} catch(ex) {
			Ti.API.error("Sync Reimburse Error ("+syncReimburseCount+") : "+ex.message);
			syncReimburseCount = 0; //syncReimburseCount--;
			//if (syncReimburseCount < 0) syncReimburseCount = 0;
    	} finally {
    		Ti.API.warn("Sync Reimburse End ("+syncReimburseCount+") : "+moment().toISOString());
    		if (syncReimburseCount < 0) syncReimburseCount = 0;
    		syncReimburseTimer = setTimeout(syncFunc, SyncInterval);
    	}
   };
};

function startSyncReimburseDet(_win, callback) {
	syncReimburseDetTimer = setTimeout(syncFunc, SyncInterval);
	
	function syncFunc() {
    	try {
    		Ti.API.warn("Sync ReimburseDetail Start ("+syncReimburseDetCount+") : "+moment().toISOString());
    		clearTimeout(syncTimer);	
			if (CURRENT_USER && CURRENT_USER != "" && syncReimburseDetCount == 0) {
				if (syncReimburseDetList.isEmpty()) {
					
				} else {
					var obj = syncReimburseDetList.dequeue();
					var proto = obj.urlImageOri ? obj.urlImageOri.substring(0, 3).toUpperCase() : '';
					if (proto && proto!="HTT" && proto!="FTP") {					
						Transloadit.upload({
							expDate : EXPIRED_TIME, //.format("yyyy/MM/dd HH:mm:ss+00:00"),
							key : TRANSLOADIT_KEY,
							notify_url : TRANSLOADIT_NOTIFY, //'http://my-api/hey/file/is/done',
							template : TRANSLOADIT_TEMPLATEID,
							fields : TRANSLOADIT_FIELDS, //{customFormField : true},
							wait : true,
							getSignature : function(params, next) {
								//Ti.API.info(params);
								//https://transloadit.com/docs/api-docs#authentication
								// getSignatureFromServer(params, function(err, hash) {
								// next(err, hash);
								// });
								next(null, TRANSLOADIT_SIGNATURE);
							},
							file : Ti.Filesystem.getFile(obj.urlImageOri)
						}, function(err, assembly) {
							Ti.API.info(err || assembly);
							//console.log(err || assembly);
							if (!err) {
								if (assembly.results.thumb)
									obj.urlImageSmall = assembly.results.thumb[0].url;
								if (assembly.results.optimized)
									obj.urlImageOri = assembly.results.optimized[0].url;
								// ":origin"
								if (assembly.results.medium)
									obj.urlImageMedium = assembly.results.medium[0].url;
								obj.isSynced = 0;
								localReimburseDetail.updateDetailObject(obj, function(ret) {
									if (!ret.error) {
										syncDetail(ret);
									} else {
										if (ret.error == INVALID_TOKEN) {
											var dialog = Ti.UI.createAlertDialog({
												message : L('session_expired'),
												ok : L('ok'),
												title : L('relog')
											});
											dialog.addEventListener('click', function(e) {
												//act.hide();
												ShowLoginForm();
											});
											dialog.show({modal:true});
										}
									}
									//act.hide();
								});

							} else {
								//act.hide();
								if (err.error == TRANSLOADIT_AUTH_EXPIRED) {
									var dialog = Ti.UI.createAlertDialog({
										message : L('session_expired'),
										ok : L('ok'),
										title : L('relog')
									});
									dialog.addEventListener('click', function(e) {
										act.hide();
										ShowLoginForm();
									});
									dialog.show({modal:true});
								} else {
									var msg = err.source.status + " : " + err.error;
									alert('Error ' + msg);
								}
							}
						}); 
					} else {						
						syncDetail(obj);
					}
				}	
			} else if (CURRENT_USER=="") {
				syncReimburseDetList.clear();
			}
    	} catch(ex) {
			Ti.API.error("Sync ReimburseDetail Error ("+syncReimburseDetCount+") : "+ex.message);
			syncReimburseDetCount = 0; //syncReimburseDetCount--;
			//if (syncReimburseDetCount < 0) syncReimburseDetCount = 0;
    	} finally {
    		Ti.API.warn("Sync ReimburseDetail End ("+syncReimburseDetCount+") : "+moment().toISOString());
    		if (syncReimburseDetCount < 0) syncReimburseDetCount = 0;
    		syncReimburseDetTimer = setTimeout(syncFunc, SyncInterval);
    	}
   };
};

function syncDetail(obj) {	
	if (obj.gid) {// already existed
		syncReimburseDetCount++;
		remoteReimburseDetail.updateDetailObject(obj, function(ret2) {
			if (!ret2.error) {
				localReimburseDetail.updateDetailObject(ret2);
				lastSyncReimburseDetTime = localConfig.createOrUpdateObject("lastSyncReimburseDetTime", obj.lastUpdate);
			}
			syncReimburseDetCount--;
		});
	} else {// not existed
		if (obj.isDeleted == 1) {// skip upload if unsynced local data was deleted
			lastSyncReimburseDetTime = localConfig.createOrUpdateObject("lastSyncReimburseDetTime", obj.lastUpdate);
			localReimburseDetail.deleteDetailObject(obj.id);
		} else {
			syncReimburseDetCount++;
			remoteReimburseDetail.addDetailObject(obj, function(ret2, obj2) {
				if (!ret2.error) {
					obj2.gid = ret2.gid;
					syncReimburseDetCount++;
					remoteReimburseDetail.updateDetailObject(obj2, function(ret3) {
						if (!ret3.error) {
							localReimburseDetail.updateDetailObject(ret3);
							lastSyncReimburseDetTime = localConfig.createOrUpdateObject("lastSyncReimburseDetTime", obj.lastUpdate);
						}
						syncReimburseDetCount--;
					});
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
					if (!obj.isSynced) {
						syncReimburseDetList.enqueue(obj);
						syncReimburseDetLastTime = obj.lastUpdate;
					}
				}
			}
			syncReimburseDetCount--;
		}); 
	}
};

function startSyncService(_win, callback) {
	syncTimer = setTimeout(syncFunc, SyncInterval);
	
	function syncFunc() {
    	try {
    		Ti.API.warn("Sync Start ("+syncCount+") : "+moment().toISOString());
    		clearTimeout(syncTimer);	
			if (CURRENT_USER && CURRENT_USER != "" && syncCount == 0) {
				syncCount++;
				localReimburse.getListAll("dateCreated", "asc", 0, maxInt, null, null, null, function(ret) {
					if (!ret.error) {
						//Ti.API.warn(JSON.stringify(ret));
						for (idx in ret) {
							var obj = ret[idx];
							if (!obj.isSynced) {
								if (obj.gid) {// already existed
									syncCount++;
									remoteReimburse.updateObject(obj, function(ret2) {
										if (!ret2.error) {
											if (ret2.isDeleted == 1) {
												localReimburse.deleteObject(ret2.id);
											} else {
												localReimburse.updateObject(ret2, syncDetails);
											}
										}
										syncCount--;
									});
								} else {// not existed
									if (obj.isDeleted == 1) { // skip upload when unsynced local data was deleted
										localReimburse.deleteObject(obj.id);
									} else {							
										syncCount++;
										remoteReimburse.addObject(obj, function(ret2, obj2) {
											if (!ret2.error) {
												obj2.gid = ret2.gid;
												syncCount++;
												remoteReimburse.updateObject(obj2, function(ret3) {
													if (!ret3.error) {
														localReimburse.updateObject(ret3, syncDetails);
													}
													syncCount--;
												});
											}
											syncCount--;
										}); 
									}
								}
							} else {
								syncDetails(obj);
							};
						}
						var lastDate = moment(minDate, dateFormat, lang).toISOString();
						if (ret.length>0) {
							// download remote list
							var lastobj = ret[ret.length - 1];
							lastDate = lastobj.dateCreated ? lastobj.dateCreated : moment(minDate, dateFormat, lang).toISOString();
						}		
						syncCount++;
						remoteReimburse.getListFrom(lastDate, "dateCreated", "asc", 0, maxRow, function(ret2) {
							if (!ret2.error) {
								for (idx in ret2) {
									var obj = ret2[idx];
									localReimburse.getObjectByGID(obj.gid, function(ret3) {
										if (!ret3.error) {
											if (!ret3.id || ret3.id == 0) {
												localReimburse.addObject(obj, updateDetails);
											} else {
												obj.id = ret3.id;
												if (ret3.isDeleted == 1) {// hard delete if no longer exist on server
													localReimburse.deleteObject(ret3.id);
												} else if (obj.lastUpdate > ret3.lastUpdate) {// update local if on server is newer
													localReimburse.updateObject(obj);
												}
											}
										}
									});
								}
							}
							syncCount--;
						}); 
					}
					syncCount--;
				});
			}
		} catch(ex) {
			syncCount--;
			if (syncCount < 0) syncCount = 0;
			Ti.API.error("Sync Error ("+syncCount+") : "+ex.message);
    	} finally {
    		if (syncCount < 0) syncCount = 0;
    		syncTimer = setTimeout(syncFunc, SyncInterval);
    		Ti.API.warn("Sync End ("+syncCount+") : "+moment().toISOString());
    	}
	}
	
	
};

function updateDetails(par) {
	if (!par.error && par.id>0) {
		// download remote list
		var lastDate = par.dateCreated ? par.dateCreated : moment(minDate, dateFormat, lang).toISOString();
		syncCount++;
		remoteReimburseDetail.getDetailListFrom(par.id, lastDate, "dateCreated", "asc", 0, maxRow, function(ret2) {
			if (!ret2.error) {
				for (idx in ret2) {
					var obj = ret2[idx];
					localReimburseDetail.getDetailObjectByGID(obj.gid, function(ret3) {
						if (!ret3.error) {
							if (!ret3.id || ret3.id == 0) {
								obj.reimburse_gid = par.gid;
								localReimburseDetail.addDetailObject(obj);
							} else {
								obj.id = ret3.id;
								if (ret3.isDeleted == 1) {// hard delete if no longer exist on server
									localReimburseDetail.deleteDetailObject(ret3.id);
								} else if (obj.lastUpdate > ret3.lastUpdate) {// update local if on server is newer
									localReimburseDetail.updateDetailObject(obj);
								}
							}
						}
					});
				}
			}
			syncCount--;
		});
	}
};

function syncDetails(par) {
	if (!par.error && par.id>0) {
		localReimburseDetail.getDetailListAll(par.id, "dateCreated", "asc", 0, maxInt, null, null, null, function(ret) {
			if (!ret.error) {
				//Ti.API.warn(JSON.stringify(ret));
				for (idx in ret) {
					var obj = ret[idx];
					if (!obj.isSynced) {
						// TODO: upload image to transloadit if it's local (also check if it's inProgress of uploading or not)
						if (obj.gid) {// already existed
							syncCount++;
							remoteReimburseDetail.updateDetailObject(obj, function(ret2) {
								if (!ret2.error) {
									if (ret2.isDeleted == 1) {// hard delete if no longer exist on server
										localReimburseDetail.deleteDetailObject(ret2.id);
									} else {
										localReimburseDetail.updateDetailObject(ret2);
									}
								}
								syncCount--;
							});
						} else {// not existed
							if (obj.isDeleted == 1) { // skip upload when unsynced local data was deleted
								localReimburseDetail.deleteDetailObject(obj.id);
							} else {					
								syncCount++;
								remoteReimburseDetail.addDetailObject(obj, function(ret2, obj2) {
									if (!ret2.error) {
										obj2.gid = ret2.gid;
										syncCount++;
										remoteReimburseDetail.updateDetailObject(obj2, function(ret3) {
											if (!ret3.error) {
												localReimburseDetail.updateDetailObject(ret3);
											}
											syncCount--;
										});
									}
									syncCount--;
								}); 
							}
						}
					};
				}
				// download remote list
				updateDetails(par);
			}
		});
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
