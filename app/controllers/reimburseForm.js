var args = arguments[0] || {};
var moment = require('alloy/moment');

var reimburses = Alloy.Collections.reimburse;
//reimburses && reimburses.fetch({remove: false});
var data = reimburses.get(args.id);

function winOpen(e) {
	if (data) {
		$.titleField.value = data.get('title');
		$.dateField.value = moment.parseZone(data.get('projectDate')).local().format(dateFormat);
		// $.dateField.value = data.get('projectDate');
		
	}
	$.dialogTitle.text = data ? "Edit Reimburse" : "New Reimburse";
	$.reimburseForm.parent.show();
}

function winClose(e) {
	reimburses = null;
	data = null;
	Alloy.Globals.newBtnUsed = false;
	$.reimburseForm.parent.hide();
}

function doMenuClick(evt) {
	switch(evt.source.title) {
	case "Menu":
		// in real life you probably wouldn't want to use the text of the menu option as your condition
		var activity = $.reimburseForm.getActivity();
		activity.openOptionsMenu();
		break;
	default:
		alert(evt.source.title);
	}
}

function doSearch(e) {
	alert("Search Clicked");
}

function dialogCancelClick(e) {
	$.reimburseForm.fireEvent("close");
}

function dialogSaveClick(e) {
	doSave(e);
}

function doSave(e) {
	var curTime = moment().utc().toISOString();
	var item = {
		title: $.titleField.value,
		description: "",
		projectDate: moment($.dateField.value, dateFormat, lang).utc().toISOString(),
		lastUpdate : curTime,
	};
		
	var reimburse;
	if (args == null || args.id == null) {
		Alloy.Globals.act.show();
		item.dateCreated = curTime;
		remoteReimburse.addObject(item, function(result) {
			if (result.error) {
				alert(result.error);
			} else {
				//for (var attrname in result) { item[attrname] = result[attrname]; }
				reimburse = Alloy.createModel('reimburse', {
					gid: result.gid,
					username : Alloy.Globals.CURRENT_USER,
					title : result.title,
					description : result.description,
					projectDate : result.projectDate,
					total : 0,
					isSent : 0,
					isDone : 0,
					//sentDate : result.sentDate,
					isDeleted : 0,
					status : 0,
					isSync: 1,
				});
				reimburses.add(reimburse);
				reimburse.save();
				reimburse.fetch({
					remove : false
				}); 	
				// reload the tasks	
				// reimburses.fetch({
					// remove : false
				// });
				if ($.reimburseForm.parent == Alloy.Globals.dialogView) {
					Alloy.createController("reimburseDetailList", {
						id : reimburse.id
					}).getView().open();
				};
				$.reimburseForm.fireEvent("close"); 
			}
			Alloy.Globals.act.hide();
		});
	} else {
		Alloy.Globals.act2.show();
		reimburse = reimburses.get(args.id);
		item.gid = reimburse.get('gid');
		remoteReimburse.updateObject(item, function(result) {
			if (result.error) {
				alert(result.error);
			} else {
				//for (var attrname in result) { item[attrname] = result[attrname]; }	
				if (reimburse) {
					reimburse.set({
						gid: result.gid,
						username : Alloy.Globals.CURRENT_USER,
						title : result.title,
						description : result.description,
						projectDate : result.projectDate,
						//total : result.total,
						isSent : result.isSent,
						sentDate : result.sentDate,
						isDone : result.isDone,
						doneDate : result.doneDate,
						isSync: 1,
					});
					reimburse.save();
					reimburse.fetch({
						remove : false
					});
					// reload the tasks
					// reimburses.fetch({
						// remove : false
					// });
					if ($.reimburseForm.parent == Alloy.Globals.dialogView) {
						Alloy.createController("reimburseDetailList", {
							id : reimburse.id
						}).getView().open();
					};
					$.reimburseForm.fireEvent("close");
				}
			}
			Alloy.Globals.act2.hide();
		});
	}

	// // reload the tasks
	// reimburses.fetch({remove: false});
	// if ($.reimburseForm.parent == Alloy.Globals.dialogView) {
		// Alloy.createController("reimburseDetailList", {
			// id : reimburse.id
		// }).getView().open();
	// };
	// $.reimburseForm.fireEvent("close");
	//close();

}

function dateFieldClick(evt) {
	Ti.UI.Android.hideSoftKeyboard();
	var picker = 
	Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		value : ($.dateField.value == null || $.dateField.value == "") ? new Date() : moment($.dateField.value, dateFormat).toDate() //
	});
	picker.showDatePickerDialog({
		value : ($.dateField.value == null || $.dateField.value == "") ? moment().toDate() : moment($.dateField.value, dateFormat).toDate(), //,
		callback : function (e) {
			if (e.cancel) {
			} else {
				$.dateField.value = moment(e.value).format(dateFormat);
			}
			$.dateField.blur();
		}
	});
}

