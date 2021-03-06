/*global Ti: true, require: true */

(function (service) {
	var LAST_USER = "";
	var LAST_TOKEN = "";
	var localConfig = require('database/local_config');
	var lastUsername = localConfig.findOrCreateObject("lastUsername", LAST_USER, "");
	var lastToken = localConfig.findOrCreateObject("lastToken", LAST_TOKEN, lastUsername.val ? lastUsername.val.trim().toUpperCase() : "");

	if (LAST_TOKEN && LAST_TOKEN!="") {	// only process gcm receival when user haven't logged out yet

	var serviceIntent = service.getIntent(),
	title = serviceIntent.hasExtra('title') ? serviceIntent.getStringExtra('title') : '',
	statusBarMessage = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	message = serviceIntent.hasExtra('message') ? serviceIntent.getStringExtra('message') : '',
	date = serviceIntent.hasExtra('date') ? serviceIntent.getStringExtra('date') : '',
	notificationId = (function () {
		// android notifications ids are int32
		// java int32 max value is 2.147.483.647, so we cannot use javascript millis timpestamp
		// let's make a valid timed based id:

		// - we're going to use hhmmssDYLX where (DYL=DaysYearLeft, and X=0-9 rounded millis)
		// - hh always from 00 to 11
		// - DYL * 2 when hour is pm
		// - after all, its max value is 1.159.597.289

		var str = '',
		now = new Date();

		var hours = now.getHours(),
		minutes = now.getMinutes(),
		seconds = now.getSeconds();
		str += (hours > 11 ? hours - 12 : hours) + '';
		str += minutes + '';
		str += seconds + '';

		var start = new Date(now.getFullYear(), 0, 0),
		diff = now - start,
		oneDay = 1000 * 60 * 60 * 24,
		day = Math.floor(diff / oneDay); // day has remaining days til end of the year
		str += day * (hours > 11 ? 2 : 1);

		var ml = (now.getMilliseconds() / 100) | 0;
		str += ml;

		return str | 0;
	})();
		
		// create launcher intent
		var ntfId = Ti.App.Properties.getInt('ntfId', 0),
		    launcherIntent = Ti.Android.createIntent({
			className : Ti.App.id + ".RepayappActivity", //'org.appcelerator.titanium.TiActivity' //'net.iamyellow.gcmjs.GcmjsActivity', //'<app_id>.<appname>Activity' //activity filename located in \build\android\bin\classes\<app_id>\
			action : 'action' + ntfId, //Ti.Android.ACTION_MAIN // we need an action identifier to be able to track click on notifications
			packageName : Ti.App.id,
			flags : Ti.Android.FLAG_ACTIVITY_NEW_TASK | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
		});
		launcherIntent.addCategory(Ti.Android.CATEGORY_LAUNCHER);
		launcherIntent.putExtra("ntfId", ntfId);

		// increase notification id
		ntfId += 1;
		Ti.App.Properties.setInt('ntfId', ntfId);

		// create custom remoteview for custom notification view
		// var customView = Ti.Android.createRemoteViews({
		// layoutId : Ti.App.Android.R.layout.customremoteview
		// });
		// // Reference elements in the layout by prefixing the IDs with 'Ti.App.Android.R.id' XML located at /platform/android/res/layout/customremoteview.xml (XML filename must not use uppercase)
		// customView.setTextViewText(Ti.App.Android.R.id.message, "Update available!");
		// customView.setTextViewText(Ti.App.Android.R.id.okbutton, "Download");
		// customView.setOnClickPendingIntent(Ti.App.Android.R.id.okbutton, launcherIntent); //downnloadIntent
		// customView.setTextViewText(Ti.App.Android.R.id.cancelbutton, "Not now");
		// customView.setOnClickPendingIntent(Ti.App.Android.R.id.cancelbutton, cancelIntent);

		// create notification
		var pintent = Ti.Android.createPendingIntent({
			intent : launcherIntent,
			//activity : Ti.Android.currentActivity,
			//type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY, //Ti.Android.PENDING_INTENT_FOR_ACTIVITY
			//flags : Ti.Android.FLAG_ACTIVITY_NO_HISTORY
		}),
		    notification = Ti.Android.createNotification({
			contentIntent : pintent,
			//contentView: customView, //don't call setLatestEventInfo() method when using Ti.Android.RemoteViews otherwise it's reset to default view
			contentTitle : title,
			contentText : message,
			tickerText : statusBarMessage,
			when : new Date(date), //(new Date()).getTime(), //show timing in notification
			icon : Ti.App.Android.R.drawable.appicon,
			//sound: "default",
			defaults : Titanium.Android.DEFAULT_ALL, //Titanium.Android.NotificationManager.DEFAULT_ALL, //
			flags : Ti.Android.FLAG_AUTO_CANCEL | Ti.Android.FLAG_SHOW_LIGHTS
		});
		//notification.defaults |= Titanium.Android.DEFAULT_SOUND | Titanium.Android.DEFAULT_VIBRATE | Titanium.Android.DEFAULT_LIGHTS | Titanium.Android.DEFAULT_ALL;
		//notification.sound = Ti.Filesystem.getResRawDirectory() + "somesound.mp3"; // Raw Resource Dir is located at platform/android/res/raw
		Ti.Android.NotificationManager.notify(notificationId, notification);
		Ti.Media.vibrate([0, 250, 100, 250, 100, 250]); 
	}
	service.stop();

})(Ti.Android.currentService);
