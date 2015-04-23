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

function addItem(item) {
    var reimburses = Alloy.Collections.reimburse;

    // Create a new model for the todo collection
    var reimburse = Alloy.createModel('reimburse', {
    	userId : 1,
        title : item.title,
        projectDate : moment(item.projectDate).utc().toISOString(),
        isSent : item.isSent,
        sentDate : item.sentDate,
        status : item.isSent == 1 ? 1 : 0,
        total : item.total,
        isDeleted : 0,
    });

    // add new model to the global collection
    reimburses.add(reimburse);

    // save the model to persistent storage
    reimburse.save();

    // reload the tasks
    //reimburses.fetch();
}

function fillTestData() {
	var reimburseDetails = Alloy.Collections.reimburseDetail;
	reimburseDetails.fetch();
	for (var i = reimburseDetails.models.length-1; i >= 0; i--) {
  		reimburseDetails.models[i].destroy();        
	}
	var reimburses = Alloy.Collections.reimburse;
	// delete all data from last to first
	reimburses.fetch();
	for (var i = reimburses.models.length-1; i >= 0; i--) {
  		reimburses.models[i].destroy();        
	}
	
	
	//create new data
	for (var i = 1; i <= 25; i++) {
		var isSent = Math.round(Math.random());
		addItem({
			title : "Judul"+i+"  sadjhgaskfjhadjfhldahsjghksdjghksjhgksjhgksjhgfjhgkjdshgkjshgkjdhg",
			total : 0,
			isSent : isSent,
			sentDate : isSent == 1 ? moment().add(i, "days").format("YYYY-MM-DD") : null,
			projectDate : moment().add(i, "days").format("DD/MM/YYYY")
		});
	}
}
