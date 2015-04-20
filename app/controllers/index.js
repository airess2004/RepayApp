//var fa = Alloy.createWidget("com.mattmcfarland.fontawesome");
//win.add(fa);

function doClick(e) {
    alert($.label.text);
}

function buttonBarClick(e) {
	var reimburse = Alloy.createController('reimburse').getView();
	reimburse.open();
	
}


$.index.open();
