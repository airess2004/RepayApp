var Transloadit = module.exports = {};
var TRANSLOADIT_API = 'http://api2.transloadit.com/assemblies';
var PING_TIMEOUT = 5000; //3000
/*
 * @method upload
 * requires Object options with the following parameters
 * key - your transloadit API key
 * notify_url - notification URL (optional)
 * template - template ID
 * fields - form fields to use with your template
 * getSignature - async method to retrieve your auth secret
 * file - Ti.Filesystem.File object
 * wait - (bool) wait for assembly to complete, defaults to false
 *
 * callback
 *   executes on success or error, sends arguments (error, assembly)
 *
 * Example:
    Transloadit.upload({
        key: 'MY-KEY',
        notify_url: 'http://my-api/hey/file/is/done',
        template: 'MY-TEMPLATE-ID',
        fields: {
            customFormField: true
        },
        getSignature: function(params, next) {
            getAuthSecretSomehow(params, function(secret) {
                next(secret);
            });
        },
        file: Ti.Filesystem.getFile('path', 'to', 'a', 'file.zip'),
        wait: true
    }, function(err, assembly) {
        console.log(err || assembly);
    });
 */
Transloadit.upload = function(options, callback) {
	var expDate = getExpiryDate();
	if (options.expDate) expDate = options.expDate;
    var data = {
        params: {
            auth: {
            	// 'expires' should be placed after 'key' in the final params JSON string to prevent generating a wrong signature
                expires: expDate,
                key: options.key,
            },
            template_id: options.template,
            notify_url: options.notify_url,
            fields: options.fields
        }
    };
    
	if (options.getSignature) {
		options.getSignature(data.params, function(err, signature) {
			if (err) {
				callback(err);
			} else {
				sendForm(signature);
			}
		});
	} else {
		sendForm(null);
	}

    function sendForm(signature) {
        var post = request('POST', TRANSLOADIT_API);
        var form = {
            params: JSON.stringify(data.params),
            signature: signature,
            wait: options.wait || false
        };
        //if (signature) form.signature = signature;
        //append file
        form[options.file.name] = options.file;
        post.exec(form, function(err, assembly) {
            if (err) {
                callback(err);
            } else {
                if (options.wait) {
                    pingAssembly(assembly, callback);
                } else {
                    callback(err, assembly);
                }
            }
        });
    }
};

function request(method, url) {
    var done;
    var xhr = Ti.Network.createHTTPClient({
    	//autoEncodeUrl:false,
        onload: function() {
            var err;
            var assembly;
            try {
                assembly = JSON.parse(this.responseText);
            } catch (e) {
                err = e;
            }
            done(err, assembly);
        },
        onerror: function(e) {
            done(e.error);
        }
    });
    xhr.open(method, url);
    // HTTP Headers must be set AFTER open(), and BEFORE send()
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
	// xhr.setRequestHeader('Content-Type','application/json');
    xhr.exec = function(data, cb) {
        done = cb;
        if (data) {
            xhr.send(data); //xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    };
    return xhr;
}

function pingAssembly(assembly, callback) {
    if (assembly.ok === 'ASSEMBLY_COMPLETED') {
        callback(null, assembly);
    } else if (assembly.ok === 'ASSEMBLY_EXECUTING') {
        setTimeout(function() {
            var get = request('GET', assembly.assembly_url);
            get.exec(null, function(err, data) {
                pingAssembly(data, callback);
            });
        }, PING_TIMEOUT);
    } else {
        //TODO: error handling
        console.error('something blew up...');
        console.error(assembly);
        callback(assembly, assembly);
    }
}

function getExpiryDate() {
    var date = new Date();
    date.setHours(date.getHours() + 12);

    var year = date.getUTCFullYear();
    var month = zeroFill(date.getUTCMonth() + 1, 2);
    var day = zeroFill(date.getUTCDate(), 2);

    var hours = zeroFill(date.getUTCHours(), 2);
    var minutes = zeroFill(date.getUTCMinutes(), 2);
    var seconds = zeroFill(date.getUTCSeconds(), 2);

    return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds + '+00:00'; // yyyy/MM/dd HH:mm:ss+00:00
}

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }

    return number + ''; // always return a string
}