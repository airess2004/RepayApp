function str2int(foo) {
    var parts = foo.split('.');
    return 100000 * (parts[0]?parts[0]:0) + 1000 * (parts[1]?parts[1]:0) + (parts[2]?parts[2]:0);
}
 
exports.check = function (callback, verbose) {
    var thisversion = str2int(Ti.App.getVersion());
    var e = (arguments[0] || {}, "https://play.google.com/store/apps/details?id=" + Ti.App.getId()),
        t = Ti.Network.createHTTPClient({
        onerror : function(evt) {
            console.log('Warning: no connection to playstore ' + thisversion);
            if (callback) callback("CONNECTION_ERROR");
            return;
        },
        onload : function(evt) {
            var t = /itemprop="softwareVersion">(.*?)</m.exec(this.responseText);
            if (!t) {
                console.log('Warning: no connection to playstore ' + thisversion);
                if (callback) callback("CONNECTION_ERROR");
                return;
            }
            var storeversion = str2int(( version = t[1].replace(/\s+/g, "")));
            if (storeversion > thisversion) {
                var dialog = Ti.UI.createAlertDialog({
                    cancel : 1,
                    buttonNames : [L('goto_store'), L('cancel')],
                    message : L('newver_msg') + Ti.Platform.model + L('has_ver') + Ti.App.getVersion() + L('in_store') + version + L('ask_renew'),
                    title : L('new_rel') + Ti.App.getName() + "'"
                });
                dialog.show();
                dialog.addEventListener("click", function(t) {
                    t.index != t.source.cancel && Ti.Platform.openURL(e);
                    if (callback) callback("NEED_UPDATE");
                });
            } else if (storeversion < thisversion) {
                Ti.Android && Ti.UI.createNotification({
                    message : Ti.App.getName() + L('is_newer') + version + ")", //Ti.App.getVersion()
                    duration: Ti.UI.NOTIFICATION_DURATION_LONG,
                }).show();
                if (callback) callback("NEWER_VERSION");
            } else if (storeversion == thisversion) {
            	if (verbose) {
                	Ti.Android && Ti.UI.createNotification({
                    	message : Ti.App.getName() + L('is_latest') + Ti.App.getVersion() + ")",
                    	duration: Ti.UI.NOTIFICATION_DURATION_LONG,
                	}).show();
                }
                if (callback) callback("SAME_VERSION");
            }
        }
    });
    t.open("GET", e), t.send();
};
