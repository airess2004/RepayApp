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