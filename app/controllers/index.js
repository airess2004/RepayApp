//var fa = Alloy.createWidget("com.mattmcfarland.fontawesome");
//win.add(fa);

function doClick(e) {
    alert($.label.text);
}

function doLoginClick(e) {
    var loginView = Alloy.createController("login").getView().open();
}

function buttonBarClick(e) {
	var reimburse = Alloy.createController('reimburse').getView();
	reimburse.open();
	
}


function mainViewOpen(e) {
	if (!Alloy.Globals.CURRENT_USER || Alloy.Globals.CURRENT_USER=="") {
		var loginView = Alloy.createController("login").getView().open();
	}
}

$.index.open();
