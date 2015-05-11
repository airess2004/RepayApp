// Uses : $$.createMemoryPool();
//        $$.clearMemoryPool(win);
Ti.App.Properties.createMemoryPool = function() {
	Ti.API.info('Creating Memory Pool.');
	Ti.App.memoryPool = Ti.UI.createWindow();
	Ti.App.memoryPool.hide();
	Ti.App.memoryPool.open();
};
Ti.App.Properties.clearMemoryPool = function(_ARGS) {
	Ti.API.info('Adding ' + _ARGS + ' to Memory Pool.');
	Ti.App.memoryPool.add(_ARGS);
	Ti.App.memoryPool.close();
	Ti.App.memoryPool = null;
	Ti.API.info('Closing Memory Pool.');
	Ti.App.memoryPool = Ti.UI.createWindow();
	Ti.App.memoryPool.hide();
	Ti.App.memoryPool.open();
};
//==================================================================================================================================

// Uses :
// var memoryPool = new MemoryPool
// memoryPool.clean(win.children)
var MemoryPool = function() {
	var _window;
	/*
	 Here we make our "auto-release" pool. It's simply a window.
	 We hide it upon creation so it won't interfere with our view hierarchy.

	 5/3/2011: It seems that the window does not need to be a subcontext, just a regular window will do.
	 */
	this.init = function() {
		//_window = {};
		_window = Ti.UI.createWindow();
		_window.hide();
		_window.open();
	};
	// This is where we clear out the memPool by closing it then reopening it again.
	this.clean = function(obj) {
		if ( obj instanceof Array) {
			var arLen = obj.length;
			for (i = 0, len = arLen; i < len; ++i) {
				// We then stick the entire view into the pool
				_window.add(obj[i]);
			}
		} else {
			// We then stick the entire view into the pool
			_window.add(obj);
		}
		_window.view = obj;
		Ti.API.info('Cleaning MemoryPool.');

		// We empty the pool by closing it.
		_window.close();
		_window = null;

		// We recreate the window again for the next object
		this.init();
	};
	this.init();
};

exports.MemoryPool = new MemoryPool;
