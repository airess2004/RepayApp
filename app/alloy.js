// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

if (!Alloy) Alloy = require('alloy'); //Bug workaround? After coming back from background "Alloy is not defined"
var moment = require('alloy/moment');

// Global Constant
Titanium.include('/common/constant.js');
Alloy.Globals.CURRENT_USER = "";
Alloy.Globals.CURRENT_NAME = "";
Alloy.Globals.orientModes = orientModes;
Alloy.Globals.lightColor = "#34b2b1";
Alloy.Globals.darkColor = "#176d7e";

// Cached ImageView
Titanium.include('createRemoteImageView.js');

// Sync Service
Titanium.include('database/syncService.js');

// Initialize local/remote storage
var remoteUser = require('database/remote_user');	
var remoteReimburse = require('database/remote_reimburse');
var remoteReimburseDetail = require('database/remote_reimbursedetail');
//var localReimburse = require('database/local_reimburse');
//localReimburse.createDb();
var localReimburseDetail = require('database/local_reimbursedetail');
//localReimburseDetail.createDb();
var localConfig = require('database/local_config');
//localConfig.createDb();

// Initialize config
var lastUsername = localConfig.findOrCreateObject("lastUsername",Alloy.Globals.CURRENT_USER,"");
var preCURRENT_USER = lastUsername.val ? lastUsername.val.trim().toUpperCase() : "";
var lastFullname = localConfig.findOrCreateObject("lastFullname",Alloy.Globals.CURRENT_NAME,preCURRENT_USER);
var lastToken = localConfig.findOrCreateObject("lastToken",SERVER_KEY,preCURRENT_USER);
var lastAvatar = localConfig.findOrCreateObject("lastAvatar","",preCURRENT_USER);
var lastMiniAvatar = localConfig.findOrCreateObject("lastMiniAvatar","",preCURRENT_USER);
var skipIntro = localConfig.findOrCreateObject("skipIntro","false","");
var lastSyncReimburseTime = {key:"lastSyncReimburseTime", val:moment(minDate, dateFormat, lang).toISOString(), username:preCURRENT_USER};
var lastSyncReimburseDetTime = {key:"lastSyncReimburseDetTime", val:moment(minDate, dateFormat, lang).toISOString(), username:preCURRENT_USER};
var lastSyncReimburseToken = {key:"lastSyncReimburseToken", val:"", username:preCURRENT_USER};
var lastSyncReimburseDetToken = {key:"lastSyncReimburseDetToken", val:"", username:preCURRENT_USER};

if (lastToken.val && lastToken.val!="") {
	
	lastSyncReimburseTime = localConfig.findOrCreateObject("lastSyncReimburseTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
	lastSyncReimburseDetTime = localConfig.findOrCreateObject("lastSyncReimburseDetTime", moment(minDate, dateFormat, lang).toISOString(), preCURRENT_USER);
	lastSyncReimburseToken = localConfig.findOrCreateObject("lastSyncReimburseToken", "", preCURRENT_USER);
	lastSyncReimburseDetToken = localConfig.findOrCreateObject("lastSyncReimburseDetToken", "", preCURRENT_USER);
	Alloy.Globals.lastSyncReimburseTime = lastSyncReimburseTime.val;
	Alloy.Globals.lastSyncReimburseDetTime = lastSyncReimburseDetTime.val;
	Alloy.Globals.lastSyncReimburseToken = lastSyncReimburseToken.val;
	Alloy.Globals.lastSyncReimburseDetToken = lastSyncReimburseDetToken.val;
	SERVER_KEY = lastToken.val;
	Alloy.Globals.CURRENT_NAME = lastFullname.val;
	//Alloy.Globals.profileImage.image = lastAvatar.val || lastMiniAvatar.val || "/icon/ic_action_user.png";
	//Alloy.Globals.avatar.image = Alloy.Globals.profileImage.image;
	CURRENT_USER = preCURRENT_USER;
	Alloy.Globals.CURRENT_USER = preCURRENT_USER;
	
	refreshSyncSignature();
}

// Update
var updateModule = require('common/update');

if (OS_IOS || OS_ANDROID) {
	// Create collections
	Alloy.Collections.user = Alloy.createCollection('user');
	Alloy.Collections.config = Alloy.createCollection('config');
	Alloy.Collections.reimburse = Alloy.createCollection('reimburse');
	Alloy.Collections.reimburseDetail = Alloy.createCollection('reimburseDetail');
	Alloy.Collections.comment = Alloy.createCollection('comment');
	Alloy.Collections.reimburse_ass = Alloy.createCollection('reimburse_ass');
	Alloy.Collections.reimburseDetail_ass = Alloy.createCollection('reimburseDetail_ass');
	// Change default sorting (descending by date)
	// Alloy.Collections.comment.comparator = function(model) {
  		// return -(moment.parseZone(model.get('dateCreated')).unix());
	// };
	// Alloy.Collections.reimburseDetail.comparator = function(model) {
  		// return -(moment.parseZone(model.get('receiptDate')).unix());
	// };
	// Alloy.Collections.reimburse.comparator = function(model) {
  		// return -(moment.parseZone(model.get('projectDate')).unix());
	// };
	
	//Seed data
	//fillTestData();
	
	Alloy.Collections.user.fetch({remove:false});
	Alloy.Collections.config.fetch({remove:false});
	Alloy.Collections.reimburse.fetch({remove:false});
	Alloy.Collections.reimburseDetail.fetch({remove:false});
	Alloy.Collections.comment.fetch({remove:false});
	Alloy.Collections.reimburse_ass.fetch({remove:false});
	Alloy.Collections.reimburseDetail_ass.fetch({remove:false});
	
	//Alloy.Globals.top = 0;
	//Alloy.Globals.tableTop = '50dp';

	try {
		// check for iOS7
		// if (OS_IOS && parseInt(Titanium.Platform.version.split(".")[0], 10) >= 7) {
			// Alloy.Globals.top = '20dp';
			// Alloy.Globals.tableTop = '70dp';
		// }
	} catch(e) {
		// catch and ignore
	}
	
	var libgcm = require("libgcm");
	// libgcm.registerGCM(function(e) {
		// Alloy.Globals.gcmRegId = e.deviceToken;
	// });
}

function getFirstList() {	// some Alloy.Globals might not be available yet at this point
	remoteReimburse.getAssList("reimburse_submitted_at", "DESC", 0, 20, null, null, null, function(ret1, ret2) {
		if (!ret1.error) {
			var reimburses_ass = Alloy.Collections.reimburse_ass;
			reimburses_ass.fetch({
				remove : false
			});
			// Make sure collection is in sync
			var reimburseDetails_ass = Alloy.Collections.reimburseDetail_ass;
			reimburseDetails_ass.fetch({
				remove : false
			});
			// Make sure collection is in sync

			for (var key in ret1) {
				var obj = ret1[key];
				var obj2 = reimburses_ass.find(function(mdl) {
					return mdl.get('gid') == obj.gid;
				});
				//findWhere({gid : obj.gid});
				//if (!obj2 || obj2.get('lastUpdate') < obj.lastUpdate)
				{
					if (!obj2)
						obj2 = Alloy.createModel("reimburse_ass", obj);
					reimburses_ass.add(obj2, {
						merge : true
					});
					obj2.save({}, {
						success : function(par) {
							//par.fetch({remove:false});
							for (var key2 in ret2) {
								var det = ret2[key2];
								if (det.reimburseGid == par.get('reimburse_gid')) {
									var det2 = reimburseDetails_ass.find(function(mdl) {
										return mdl.get('gid') == det.gid;
									});
									//findWhere({gid : det.gid});
									//if (!det2)
									{
										det.reimburseId = par.id;
										if (!det2)
											det2 = Alloy.createModel("reimburseDetail_ass", det);
										reimburseDetails_ass.add(det2, {
											merge : true
										});
										det2.save();
										//det2.fetch({remove:false});
									}
								}
							}
						}
					});
				}
			}

			if (Alloy.Globals.scrollableView)
				Alloy.Globals.scrollableView.views[0].fireEvent("refresh");
		} else {
			alert(ret1.error);
		}

		remoteReimburse.getList("updated_at", "DESC", 0, 20, null, null, null, function(ret) {
			if (!ret.error) {
				var reimburses = Alloy.Collections.reimburse;
				reimburses.fetch({
					remove : false
				});
				// Make sure collection is in sync

				for (var key3 in ret) {
					var obj3 = ret[key3];
					var obj4 = reimburses.find(function(mdl) {
						return mdl.get('gid') == obj3.gid;
					});
					//findWhere({gid : obj.gid});
					//TODO: if already exist check use newer one (updated_at, local or remote)
					//if (!obj4 || obj4.get('lastUpdate') < obj3.lastUpdate)
					{
						if (!obj4)
							obj4 = Alloy.createModel("reimburse", obj3);
						reimburses.add(obj4, {
							merge : true
						});
						obj4.save();
						//obj2.fetch({remove:false});
					}
				}
				if (Alloy.Globals.scrollableView)
					Alloy.Globals.scrollableView.views[1].fireEvent("refresh");
			} else {
				alert(ret.error);
			}
		});
	}); 
}

function hideActionBarCallback(e) {
	//this.removeEventListener(e.type, hideActionBarCallback);
	if (this.getActivity()) {
		var actionBar = this.getActivity().getActionBar();
    	actionBar.hide();
    }
}

function addReimburse(item) {
    var reimburses = Alloy.Collections.reimburse;

    // Create a new model for the todo collection
    var reimburse = Alloy.createModel('reimburse', {
    	userId : 1,
    	username : "Adam", //Alloy.Globals.CURRENT_USER,
    	first_receipt_original_url : "/icon/ic_action_user.png",
    	first_receipt_mini_url : "/icon/ic_action_user.png",
        title : item.title,
        projectDate : moment(item.projectDate, dateFormat).utc().toISOString(),
        sentDate : item.sentDate,
        status : item.status,
        total : item.total,
        isDeleted : 0,
    });

    // add new model to the global collection
    reimburses.add(reimburse);

    // save the model to persistent storage
    reimburse.save();

    // reload the tasks
    //reimburses.fetch({remove: false});
    return reimburse;
}

function addReimburseDetail(item) {
    var reimburseDetails = Alloy.Collections.reimburseDetail;

    // Create a new model for the todo collection
    var reimburseDetail = Alloy.createModel('reimburseDetail', {
    	reimburseId : item.reimburseId,
        name : item.name,
        description : item.description,
        receiptDate : moment(item.receiptDate, dateFormat).utc().toISOString(),
        status : item.status,
        amount : item.amount,
        urlImageSmall: item.urlImageSmall,
        urlImageMedium: item.urlImageMedium,
        urlImageOriginal: item.urlImageOriginal,
        isDeleted : 0,
    });

    // add new model to the global collection
    reimburseDetails.add(reimburseDetail);

    // save the model to persistent storage
    reimburseDetail.save();

    // reload the tasks
    //reimburses.fetch({remove: false});
    return reimburseDetail;
}

function addComment(item) {
    var comments = Alloy.Collections.comment;

    // Create a new model for the todo collection
    var comment = Alloy.createModel('comment', {
    	reimburseDetailId : item.reimburseDetailId,
        message : item.message,
        dateCreated : moment(item.dateCreated).utc().toISOString(),
        userId : 2,
        username : "Johan",
    });

    // add new model to the global collection
    comments.add(comment);

    // save the model to persistent storage
    comment.save();

    // reload the tasks
    //reimburses.fetch({remove: false});
    return comment;
}

function fillTestData() {
	// var db = Ti.Database.open ('_alloy_');
   	// db.execute ('DROP TABLE IF EXISTS comment;');
   	// db.execute ('DROP TABLE IF EXISTS reimburseDetail;');
   	// db.execute ('DROP TABLE IF EXISTS reimburse;');
   	// db.close ();
	// delete all data from last to first
	var comments = Alloy.Collections.comment;
	comments.fetch({remove: false}); // Make sure collection is in sync
	for (var i = comments.models.length-1; i >= 0; i--) {
  		comments.models[i].destroy();        
	}
	var reimburseDetails = Alloy.Collections.reimburseDetail;
	reimburseDetails.fetch({remove: false}); // Make sure collection is in sync
	for (var i = reimburseDetails.models.length-1; i >= 0; i--) {
  		reimburseDetails.models[i].destroy();        
	}
	var reimburses = Alloy.Collections.reimburse;
	reimburses.fetch({remove: false}); // Make sure collection is in sync
	for (var i = reimburses.models.length-1; i >= 0; i--) {
  		reimburses.models[i].destroy();        
	}
	
	
	//create new data
	for (var i = 1; i <= 25; i++) {
		var status = Math.round(Math.random()*2);
		var total = Math.round(Math.random()*1000)*1000 + 10000;
		var parent = addReimburse({
			title : "Proyek"+i+"  sadjhgaskfjhadjfhldahsjghksdjghksjhgksjhgksjhgfjhgkjdshgk jshgkjdhg",
			total : total,
			status : status,
			sentDate : status >= STATUSCODE[Const.Pending] ? moment().subtract(i, "days").format(dateFormat) : null,
			projectDate : moment().subtract(i, "days").format(dateFormat)
		});
		var detail = addReimburseDetail({
			reimburseId : parent.id,
			name : "Merchant"+i+"  lhltyhroihergksfsjfhsgkjkrjbkrjgbrjgbkjgbkjfgbkjbgjfgbjbgbjb kuryowerou",
			description : "znnfhtdkjugkjfxgffdhgfhhhlkjhhgdgfbkbjtddfdgfhfsggfshfkhkjh sadpouoiyrtyu",
			amount : total,
			status : status <= STATUSCODE[Const.Pending] ? DETAILSTATUSCODE[Const.Open] : DETAILSTATUSCODE[Const.Approved], //Math.round(Math.random()+1),
			urlImageSmall : "/icon/thumb_receipt.png", //"/icon/ic_action_photo.png",
			urlImageMedium : "/icon/thumb_receipt.png", //"/icon/ic_action_photo.png",
			urlImageOriginal : "/icon/thumb_receipt.png", //"/icon/ic_action_photo.png",
			receiptDate : moment().subtract(i, "days").format(dateFormat)
		});
		var comment = addComment({
			reimburseDetailId : detail.id,
			message : "Ok thanks "+i,
			dateCreated : moment().subtract(i, "days").utc().toISOString() //.format(dateFormat)
		});
	}
}
