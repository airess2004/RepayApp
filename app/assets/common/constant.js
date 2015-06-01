//################# STATIC DATA - DO NOT CHANGE #####################
var maxInt = 2147483647;
var _NEXT_GEN="nextgen";
var _FB_GALLERY="fb";
var _PICASA="pic";
var _FLICKR="flic";

var isIPad = Ti.Platform.osname == "ipad";
var isIPhone = Ti.Platform.osname == "iphone";
var isIOS = (isIPad || isIPhone);
var isAndroid = Ti.Platform.osname == "android";
var isWeb = Ti.Platform.osname == "mobileweb";
var isBB = Ti.Platform.osname == "blackberry";
var isTizen = Ti.Platform.osname == "tizen";

//$$.createMemoryPool();
// var memoryPool = require('mempool').MemoryPool;

// var splitter = require('ui/common/splitter');

var defaultFont = {
	fontFamily: 'century-gothic'
};

var moment = require('moment-with-locales');
var dateFormat = "DD/MM/YYYY"; //"YYYY-MM-DD";
var minDate = "01/01/2001";

var cameraImage = '/icon/ic_action_photo.png';
var refreshImage = '/icon/ic_action_refresh.png';

//var crypto = require('crypto');
var Transloadit = require('ti-transloadit');

var SERVER_WEB = 'https://repay-staging.herokuapp.com'; //'http://ReimburseApp.com';
var SERVER_HOST = 'https://repay-staging.herokuapp.com'; //'http://ReimburseApp.com'; //; //'http://128.199.174.241:8080/APIREPAY'; //'http://playssd.jelastic.skali.net/APIREPAY';
//var SERVER_HOST = 'http://10.20.30.93:3000'; //'http://192.168.43.235:8080/APIREPAY'; //
var FORGOTPASSWORD_URL = SERVER_WEB + '/forgot/';
var TOS_URL = SERVER_WEB + '/tos/';
var POLICY_URL = SERVER_WEB + '/policy/';

var SERVER_API = SERVER_HOST + '/api2/'; //'http://10.20.30.98:8080/APIREPAY/api/'; //'http://192.168.10.179:8080/APIREPAY/'; // use 10.0.2.2 instead of 127.0.0.1 when running on an emulator
var EXPIRED_TIME = (moment().add(2, 'hours')).format("yyyy/MM/dd HH:mm:ss+00:00");
var SERVER_KEY = ''; //CURRENT USER TOKEN
//var CURRENT_USER = '';
//var CURRENT_NAME = '';

var TRANSLOADIT_KEY = '';//'86603f20804911e4a9905fd9992d44bc';
var TRANSLOADIT_TEMPLATEID = '';//'429d0ac0d1ed11e48e8cd335307ba78c';
var TRANSLOADIT_NOTIFY = '';
var TRANSLOADIT_SIGNATURE = '';
var TRANSLOADIT_PARAMS = '';
var TRANSLOADIT_FIELDS = {customFormField : true};

var TRANSLOADIT_ACCESS_DENIED = "S3_STORE_ACCESS_DENIED";
var TRANSLOADIT_AUTH_EXPIRED = 'AUTH_EXPIRED';
var TRANSLOADIT_EXECUTING = 'ASSEMBLY_EXECUTING';
var TRANSLOADIT_COMPLETED = 'ASSEMBLY_COMPLETED';
var TRANSLOADIT_CANCELED = 'ASSEMBLY_CANCELED';
var TRANSLOADIT_REQUEST_ABORTED = 'REQUEST_ABORTED';

var INVALID_TOKEN = 'Invalid Token';

function getSignatureFromServer(obj, callback) {
	var url = SERVER_API + 'transloadit_signature/'; //'http://192.168.10.179:8080/API-TESTING/city/';
	var xhr = Ti.Network.createHTTPClient({
		autoEncodeUrl:false,
		onerror : function(e) {
			Ti.API.debug(e.error);
			//alert('Connection error');
			callback(e.error, TRANSLOADIT_SIGNATURE, obj);
		},
		onload : function() {
			Ti.API.info('Response = '+this.responseText);
			var json = JSON.parse(this.responseText);
			callback(null, json.signature, JSON.parse(json.params));
		},
	}); //Titanium.Network.createHTTPClient();
	
	// open the client
	xhr.open('GET', url + "?auth_token="+SERVER_KEY, true);
	
	// workaround for PUT/DELETE method when not supported
	// xhr.setRequestHeader('X-HTTP-Method-Override', 'DELETE');
	// xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded'); //used when getting authentication error, which is default content type for POST
	
	// HTTP Headers must be set AFTER open(), and BEFORE send()
	xhr.setRequestHeader('Content-Type','application/json');

	// var jsonobj = {
		// method : 'getHash',
		// token : SERVER_KEY,
		// model : obj
	// };
	// var jsonstr = JSON.stringify(jsonobj);
	// send the data
	xhr.send();
}; 

function isTimeInSync(serverTimeStamp, clientTimeStamp) {
	var diffMin = moment.duration(moment.parseZone(serverTimeStamp).utc().diff(clientTimeStamp)).get("minutes");
	return !(!serverTimeStamp || !clientTimeStamp || Math.abs(diffMin)>10);
}

function utcDateString(time) {
	function pad(val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len)
		val = "0" + val;
		return val;
	}

	var now = new Date();
	now.setTime(time);

	var utc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds()));

	var cDate = utc.getDate();
	var cMonth = utc.getMonth();
	var cYear = utc.getFullYear();
	var cHour = utc.getHours();
	var cMin = utc.getMinutes();
	var cSec = utc.getSeconds();

	var result = cYear + '/' + pad((cMonth + 1)) + '/' + pad(cDate);
	result += ' ' + pad(cHour) + ':' + pad(cMin) + ':' + pad(cSec) + '+00:00';

	return result;
}; 

function upload2trans (filename, callback, wait, progressCallback) {
	getSignatureFromServer(null, function(er, hash, params) {
		if (!er) {
			EXPIRED_TIME = params.auth.expires;
			TRANSLOADIT_KEY = params.auth.key;
			TRANSLOADIT_TEMPLATEID = params.template_id;
			TRANSLOADIT_SIGNATURE = hash;
			Transloadit.upload({
				expDate : EXPIRED_TIME, //.format("yyyy/MM/dd HH:mm:ss+00:00"),
				key : TRANSLOADIT_KEY,
				//notify_url : TRANSLOADIT_NOTIFY, //'http://my-api/hey/file/is/done',
				template : TRANSLOADIT_TEMPLATEID,
				//fields : TRANSLOADIT_FIELDS, //{customFormField : true},
				wait : wait || true, //
				getSignature : function(params, next) {
					//Ti.API.info(params);
					//https://transloadit.com/docs/api-docs#authentication
					// getSignatureFromServer(params, function(err, hash) {
					// next(err, hash);
					// });
					next(null, TRANSLOADIT_SIGNATURE);
				},
				file : Ti.Filesystem.getFile(filename)
			}, function(err, assembly) {
				Ti.API.info(err || assembly);
				//console.log(err || assembly);
				if (!err) {
					// if (assembly.results.thumb)
					// obj.urlImageSmall = assembly.results.thumb[0].url;
					// if (assembly.results.optimized)
					// obj.urlImageOriginal = assembly.results.optimized[0].url;
					// // ":origin"
					// if (assembly.results.medium)
					// obj.urlImageMedium = assembly.results.medium[0].url;
					if (callback)
						callback(assembly);
				} else {
					//act.hide();
					var msg = err;
					if (err.error == TRANSLOADIT_AUTH_EXPIRED) {
						msg = L('session_expired');
						alert(msg);
					} else {
						if (err.source) {
							msg = err.source.status + " : " + err.error;
						} else
						if (err.message && err.message != "") msg = err.message + ((err.reason && err.reason!="") ? "\n"+err.reason : "");
						alert('Error ' + msg);
					}
					if (callback) callback(msg);
				}
			}, function(err, assembly) {
				Ti.API.info(err || assembly);
				//console.log(err || assembly);
				if (!err) {
					// if (assembly.results.thumb)
					// obj.urlImageSmall = assembly.results.thumb[0].url;
					// if (assembly.results.optimized)
					// obj.urlImageOriginal = assembly.results.optimized[0].url;
					// // ":origin"
					// if (assembly.results.medium)
					// obj.urlImageMedium = assembly.results.medium[0].url;
					if (progressCallback)
						progressCallback(assembly);
				}
			}); 
		} else {
			if (callback) callback(er);
		}
	});
}

function string2array(str) {
      return str.match(/[^\r\n]+/g); //str.replace(/(\r\n|\r|\n)/g, '\n');
};

function createDialog(params, callback, parent) {
	var dialog = Titanium.UI.createAlertDialog(params);
	if (callback) dialog.addEventListener('click', callback);
	if (parent) parent.add(dialog);
};

function msgBox(title,message,callback,parent) {
	var dialog = Titanium.UI.createAlertDialog({
			buttonNames: [L('ok')],
			modal : true,
		});
	if (title) dialog.setTitle(title);
	if (message) dialog.setMessage(message);
	if (callback) dialog.addEventListener('click', callback);
	//if (parent) parent.add(dialog);
	dialog.show();
};

function notifBox(message,duration,callback,parent) {
	var notif = Titanium.UI.createNotification({
			message : message,
			duration : duration ? duration : Ti.UI.NOTIFICATION_DURATION_SHORT,
			//modal : true,
		});
	//if (message) notif.message = message;
	//if (duration) notif.duration = duration;
	if (callback) notif.addEventListener('click', callback);
	//if (parent) parent.add(notif);
	notif.show();
};

function getFilename(fullpath) {
	return fullpath ? fullpath.replace(/^.*[\\\/]/, '') : fullpath;
}

function deleteFile(filename) {
	var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,getFilename(filename));							
	if (file.exists()) {
		file.deleteFile();
	}
}

function createLocalThumb(srcImg, tgtWidth, tgtHeight, callback) {
	// var params = {
		// image : srcImg.toBlob().imageAsResized(tgtWidth, tgtHeight),
	// };
	// if (tgtWidth) params.width = tgtWidth;
	// if (tgtHeight) params.height = tgtHeight;
	// var img = Ti.UI.createImageView(params);
	
	//var imgView = Ti.UI.createView({width : Ti.UI.SIZE, height : Ti.UI.SIZE});
	//imgView.add(img);
	
	var ret = srcImg.toBlob();
	if (ret) {	
		var ret = ret.imageAsResized(tgtWidth || tgtHeight || 128, tgtHeight || tgtWidth || 128);
		//img.toImage(); //imgView.toImage().media;

		if ( typeof srcImg.image == 'string') {
			var thumbfile = "thumb" + /*Date.now() +*/ "_" + getFilename(srcImg.image); //srcImg.image.replace(/^.*[\\\/]/, '');
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, thumbfile);
			file.write(ret);
			//ret.media
			ret.cacheFile = file.nativePath;
		}
	}
	if (callback) return callback(ret);
	return ret;
};

function cropImage(in_img, rect) {
	var out_img = null;
	if (in_img) {
		var ImageFactory = require('ti.imagefactory');
		//var rect = $.cropperView.getRect();
		// convert coordinate from "dp" to "pt"
		rect.width *= Ti.Platform.displayCaps.logicalDensityFactor;
		rect.height *= Ti.Platform.displayCaps.logicalDensityFactor;
		rect.x = Math.max(0, rect.x * Ti.Platform.displayCaps.logicalDensityFactor); //x must be >= 0
		rect.y = Math.max(0, rect.y * Ti.Platform.displayCaps.logicalDensityFactor); //y must be >= 0
		if (rect.x+rect.width > in_img.width) rect.width = in_img.width - rect.x; // x+width must be <= image.width
		if (rect.y+rect.height > in_img.height) rect.height = in_img.height - rect.y; // y+height must be <= image.height
		out_img = ImageFactory.imageAsCropped(in_img.media || in_img, rect);
	}
	return out_img;
}

//################# PROPERTIES GET - DO NOT CHANGE ################
var settings=Ti.App.Properties.getObject('settings',{});

getProperty=function(name,oClass){
    if(settings&&settings[oClass]){
        return settings[oClass][name];
    }else{
        return null;
    }
};

var lang = 'en'; //moment locale language code

allowOrdering = function()
{
	return Ti.App.Properties.getBool("userLoggedIn",false);
};

var orientModes = [Titanium.UI.PORTRAIT]; //[Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT];
var templateName=getProperty('color','config')||'default'; // appstore
//var Template=require('ui/templates/'+templateName); // Change with one of the templates.
var borderColor = '#004455';
var selectColor = '#007788';
var shadowCol = '#ffee20';

//Navigation Settings
var navigationType = getProperty('navigation','config')||"slider"; // Possible:  tab, metro, slider
var _NavigationType = navigationType;

//Settings for slider menu
var sliderMenuRows=getProperty('sliderRows','config')||"2";
var sliderMenuColumns=getProperty('sliderColumns','config')||"3";

//CHANGE THE TYPE OF GALLERY HERE
var _typeOfGallery=getProperty('type','gallery')||_FLICKR;  // Possible Values:  _FB_GALLERY, _NEXT_GEN, _PICASA, _FLICKR

//####################### LINKS ########################
var contactLogoBackground="#00FFFFFF";
var contactLogoImage=isIPad?"/images/logoipad.png":"/images/logo.png";


//Web Site
var _hasWebPage=getProperty('website','about')!=null&&getProperty('website','about')!="";
var _About_URL=getProperty('website','about')||"http://www.playssd.com/"; //Replace this with your own link, like info about your app, or ink to your facebook / twitter portfolio
var _AboutContent=getProperty('content','about')||"";

//How long the connection to api should take
var _timeout=10000;

//Other settings
var _AppName=getProperty('appname','config')||"My App";

//################# TEXT FORMATS ###################
var _h1 = {
    fontSize : "18sp", //18dp
    fontStyle : 'bold',
    fontWeight : 'bold'
};
var _h2 = {
    fontSize : "15sp",
    fontStyle : 'bold',
    fontWeight : 'bold'
};
var _h3 = {
    fontSize : "12sp",
    fontStyle : 'bold',
    fontWeight : 'bold'
};
var _h4 = {
    fontSize : "13sp"
};
var _normal = {
    fontSize : "11sp"
};
var _normal_italic = {
    fontSize : "11sp",
    fontStyle : 'italic'
};

var _empahasys = {
    fontSize : "10sp",
    fontStyle : 'italic'
};

//################ DISPLAY SETTINGS ################
var _dpiWidth=Ti.Platform.displayCaps.platformWidth; //Standard for iPhone and most of android devices
var _dpiHeight=Ti.Platform.displayCaps.platformHeight-60; //Standard for iPhone <=4s  //For the nav bar
//But is is not same in some andorid Devices that have XHDI like Samsung S3 and HTC ONE X
if(isAndroid)
{
	_dpiWidth=(Ti.Platform.displayCaps.platformWidth/Ti.Platform.displayCaps.logicalDensityFactor);
	_dpiHeight=(Ti.Platform.displayCaps.platformHeight/Ti.Platform.displayCaps.logicalDensityFactor)-50;
	if(navigationType=="tab"){
        _dpiHeight=(Ti.Platform.displayCaps.platformHeight/Ti.Platform.displayCaps.logicalDensityFactor)-110;
    }else if(navigationType=="metro"){
        _dpiHeight=(Ti.Platform.displayCaps.platformHeight/Ti.Platform.displayCaps.logicalDensityFactor)-25;
    }
}

if(isIPhone)
{
	_dpiHeight=(Ti.Platform.displayCaps.platformHeight)-65; //-65 for navigation
}

//Recalculate desity for iPad
if(isIPad)
{
	_dpiWidth=768;
	_dpiHeight=(Ti.Platform.displayCaps.platformHeight)-65; //-65 for navigation
}

//Recalculate desity for iPhone 5 or iPhone 5s
if(isIPhone && Ti.Platform.displayCaps.platformHeight>480)
{
	_dpiHeight=Ti.Platform.displayCaps.platformHeight-60; 
}

//Additional Exports
function getIsTablet() {
    var osname = Ti.Platform.osname;    
    switch(osname) {
        case 'ipad':
            return true;
            break;
        case 'iphone':
            return false;
            break;
        case 'android':
            var screenWidthInInches = Titanium.Platform.displayCaps.platformWidth / Titanium.Platform.displayCaps.dpi;
            var screenHeightInInches = Titanium.Platform.displayCaps.platformHeight / Titanium.Platform.displayCaps.dpi;
            var maxInches = (screenWidthInInches >= screenHeightInInches) ? screenWidthInInches : screenHeightInInches;
            return (maxInches >= 7) ? true : false;
            break;
        default:
            return false;
            break;
    }
}

Ti.Network.HTTPClient.UNSENT = 0;
Ti.Network.HTTPClient.OPENED = 1;
Ti.Network.HTTPClient.HEADERS_RECEIVED = 2;
Ti.Network.HTTPClient.LOADING = 3;
Ti.Network.HTTPClient.DONE = 4;
var stateDONE = 4; //Ti.Network.HTTPClient.DONE
var HTTP_OK = 200;



/**
 * @method LoadRemoteImage
 * Returns the correct icon, used in the menu
 * @param {String} fileName the icon's filename
 */
var LoadRemoteImage = function(obj, url) {
	var xhr = Titanium.Network.createHTTPClient();

	xhr.onload = function() {
		//Ti.API.info('image data='+this.responseData);
		obj.image = this.responseData;

	};
	// open the client
	xhr.open('GET', url);

	// send the data
	xhr.send();
};

function errors2string(errorsJSON) {
	var ret = "";
	for (var key in errorsJSON) {
		ret += ((key == "generic_errors") ? "Error" : key ) + " : "+errorsJSON[key]+"\n";
	}
	if (ret == "") ret = null;
	return ret;
}


var Const = {
	Open : "Open",
	Closed : "Closed",
	Unsent: "Unsent",
	Sent: "Sent",
	Pending : "Pending",
	Approved: "Approved",
	Rejected: "Rejected",
	Denied: "Denied",
};

var STATUS = {
	'0': Const.Open,
	'1': Const.Pending, //Sent
	'2': Const.Closed,
};

var STATUSCODE = {
	"Open" : 0,
	"Pending" : 1, //Sent
	"Closed" : 2,
};

var STATUS_COLOR = {
	'Open': "#2fb3b4",
	'Pending': "#8a8e8e", //Sent
	'Closed': "#b42f2f",
};

var STATUSCODE_COLOR = {
	'0': "#2fb3b4",
	'1': "#8a8e8e",
	'2': "#b42f2f",
};

var DETAILSTATUS = {
	'0': Const.Open,
	'1': Const.Approved,
	'2': Const.Rejected,
};

var DETAILSTATUSCODE = {
	"Open" : 0,
	"Approved" : 1,
	"Rejected" : 2,
};

var DETAILSTATUS_COLOR = {
	'Open': "#8a8e8e",
	'Approved': "#2fb3b4",
	'Rejected': "#b42f2f",
};

var DETAILSTATUSCODE_COLOR = {
	'0': "#8a8e8e",
	'1': "#2fb3b4",
	'2': "#b42f2f",
};

//var statusStr = STATUS['0'];