var Transloadit = require('/lib/ti-transloadit');
var moment = require('/lib/moment-with-locales');
// var SERVER_HOST = 'http://playssd.jelastic.skali.net/APIREPAY';
// var SERVER_HOST = 'http://128.199.174.241:8080/APIREPAY';
var SERVER_HOST = 'http://10.20.30.90:8081/APIREPAY';
var FORGOTPASSWORD_URL = SERVER_HOST + '/forgot/';
var TOS_URL = SERVER_HOST + '/tos/';
var POLICY_URL = SERVER_HOST + '/policy/';
var HTTP_OK = 200;
var SERVER_API = SERVER_HOST + '/api/'; //'http://10.20.30.98:8080/APIREPAY/api/'; //'http://192.168.10.179:8080/APIREPAY/'; // use 10.0.2.2 instead of 127.0.0.1 when running on an emulator
var SERVER_KEY = '';
var EXPIRED_TIME = moment().add(2, 'hours').format("yyyy/MM/dd HH:mm:ss+00:00");

var TRANSLOADIT_KEY = '86603f20804911e4a9905fd9992d44bc';
var TRANSLOADIT_TEMPLATEID = '429d0ac0d1ed11e48e8cd335307ba78c';
var TRANSLOADIT_NOTIFY = '';
var TRANSLOADIT_SIGNATURE = '';
var TRANSLOADIT_PARAMS = '';
var TRANSLOADIT_FIELDS = {customFormField : true};

var Const = {
	Pending : "Pending",
	Sent: "Sent",
	Approved: "Approved",
	Denied: "Denied",
};

var STATUS = {
	'0': Const.Pending,
	'1': Const.Sent,
	'2': Const.Approved,
	'3': Const.Denied,
};

var STATUSCODE = {
	"Pending" : 0,
	"Sent" : 1,
	"Approved" : 2,
	"Denied" : 3,
};

var STATUS_COLOR = {
	'Pending': "#0be",
	'Sent': "#bb0",
	'Approved': "#0e8",
	'Denied': "#aaa",
};

var STATUSCODE_COLOR = {
	'0': "#0be",
	'1': "#bb0",
	'2': "#0e8",
	'3': "#aaa",
};

//var statusStr = STATUS['0'];