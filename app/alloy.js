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

Titanium.include('/common/constant.js');
Alloy.Globals.CURRENT_USER = "";

var moment = require('alloy/moment');

if (OS_IOS || OS_ANDROID) {
	Alloy.Collections.reimburse = Alloy.createCollection('reimburse');
	Alloy.Collections.reimburseDetail = Alloy.createCollection('reimburseDetail');
	fillTestData();
	
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
}

function addReimburse(item) {
    var reimburses = Alloy.Collections.reimburse;

    // Create a new model for the todo collection
    var reimburse = Alloy.createModel('reimburse', {
    	userId : 1,
    	userName : "Adam", //Alloy.Globals.CURRENT_USER,
    	userAvatar : "/icon/ic_action_user.png",
        title : item.title,
        projectDate : moment(item.projectDate).utc().toISOString(),
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
    //reimburses.fetch();
    return reimburse;
}

function addReimburseDetail(item) {
    var reimburseDetails = Alloy.Collections.reimburseDetail;

    // Create a new model for the todo collection
    var reimburseDetail = Alloy.createModel('reimburseDetail', {
    	reimburseID : item.reimburseID,
        name : item.name,
        description : item.description,
        receiptDate : moment(item.receiptDate).utc().toISOString(),
        status : item.status,
        amount : item.amount,
        urlImageSmall: item.urlImageSmall,
        urlImageMedium: item.urlImageMedium,
        isDeleted : 0,
    });

    // add new model to the global collection
    reimburseDetails.add(reimburseDetail);

    // save the model to persistent storage
    reimburseDetail.save();

    // reload the tasks
    //reimburses.fetch();
    return reimburseDetail;
}

function fillTestData() {
	// delete all data from last to first
	var reimburseDetails = Alloy.Collections.reimburseDetail;
	reimburseDetails.fetch();
	for (var i = reimburseDetails.models.length-1; i >= 0; i--) {
  		reimburseDetails.models[i].destroy();        
	}
	var reimburses = Alloy.Collections.reimburse;
	reimburses.fetch();
	for (var i = reimburses.models.length-1; i >= 0; i--) {
  		reimburses.models[i].destroy();        
	}
	
	
	//create new data
	for (var i = 1; i <= 25; i++) {
		var status = Math.round(Math.random()*3);
		var total = Math.round(Math.random()*1000)*1000 + 10000;
		var parent = addReimburse({
			title : "Judul"+i+"  sadjhgaskfjhadjfhldahsjghksdjghksjhgksjhgksjhgfjhgkjdshgkjshgkjdhg",
			total : total,
			status : status,
			sentDate : status >= STATUSCODE[Const.Sent] ? moment().add(i, "days").format("YYYY-MM-DD") : null,
			projectDate : moment().add(i, "days").format("YYYY-MM-DD")
		});
		var detail = addReimburseDetail({
			reimburseId : parent.id,
			name : "Merchant"+i,
			description : "znnfhtdkjugkjfxgffdhgfhhhlkjhhgdgfbkbjtddfdgfhfsggfshfkhkjh sadpouoiyrtyu",
			amount : total,
			status : status,
			urlImageSmall : "/icon/ic_action_photo.png",
			urlImageMedium : "/icon/ic_action_photo.png",
			receiptDate : moment().add(i, "days").format("YYYY-MM-DD")
		});
	}
}
