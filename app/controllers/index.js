//var fa = Alloy.createWidget("com.mattmcfarland.fontawesome");
//win.add(fa);

function doClick(e) {
    alert($.label.text);
}

function doLoginClick(e) {
    var loginView = Alloy.createController("login").getView().open();
}

$.index.open();
