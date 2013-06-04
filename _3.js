/**********************************************************************************
	threesomeJS ( _3 ):
	-----------------------
	_3 (threesomeJS) is for experimental purposes. Using it, one can build web-apps 
	with un-conventional/experimental architectures. The source is not minified in
	order to allow anyone at any point to manipulate the way it behaves; And do
	share with me your changes and thoughts either via twitter or via GitHub.
	[links below]

	I hope someone finds this useful and/or playfull! :)

	AUTHOR:
	-------
	Jad A. Jabbour
	Pink Floyd, Daft Punk, Tolkein, H. Miller, code & alcohol. Charly passes by a lot; 
	It's alright though. Rainbow writer/Code ninja.  ·  Beirut, Lebanon.

	Blog: medium.com/@JadChronicles
	GitHub: /JadJabbour
	Twitter: @JadChronicles

	GNU/GPL LICENSE: 
	----------------
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/gpl.html>.
*********************************************************************************/
/*
My Notes:
1- XDR (not yet implemented)
2- how to load css dynamically within this structure ? (injector?)
3- how to load javascript files dynamically ? (injector?)

PS: eventually _3 will be changed into a function_constructor for the object so this will allow multiple
instances of _3 which means, multiple panels working independently. which my answer some of 6 & 7
*/
var _3 = {
	Page : {
		source : '', html : '', javascript : '', json : '', container : '', controls : [],
		configurePage : function (_source){
			this.source = _3.Helper.IsNullOrEmpty(_source.source) ? '' : _source.source;
			this.html = _3.Helper.IsNullOrEmpty(_source.html) ? '' : _source.html;
			this.javascript = _3.Helper.IsNullOrEmpty(_source.javascript) ? '' : _source.javascript;
			this.json = _3.Helper.IsNullOrEmpty(_source.json) ? '' : _source.json;
			this.container = _3.Helper.IsNullOrEmpty(_source.container) ? '' : _source.container;
			return this;
		}, 
		loadFront : function (reload_flag, with_pop){
			if(_3.Helper.IsNullOrEmpty(this.html) || (_3.Helper.IsBoolean(reload_flag) && reload_flag)){
				_3.RequestLoader.get('html', function (_pop){ 
					if(_pop){
						_3.Page.pop();
					}
				}, with_pop, null);
			}
			else{
				if(with_pop){
					this.pop();
				}
			}
			return this;
		},	
		loadData : function (reload_flag, with_pop){
			if(_3.Helper.IsNullOrEmpty(this.html) || (_3.Helper.IsBoolean(reload_flag) && reload_flag)){
				_3.RequestLoader.get('json', function (_pop){ 
					if(_pop){
						_3.Page.pop();
					}
				}, with_pop, null);
			}
			else{
				if(with_pop){
					this.pop();
				}
			}
			return this;
		},
		loadFunctionality : function (reload_flag, with_pop){
			if(_3.Helper.IsNullOrEmpty(this.html) || (_3.Helper.IsBoolean(reload_flag) && reload_flag)){
				_3.RequestLoader.get('javascript', function (_pop){ 
					if(_pop){
						_3.Page.pop();
					}
				}, with_pop, null);
			}
			else{
				if(with_pop){
					this.pop();
				}
			}
			return this;
		}, 
		load : function (reload_flag, with_pop){
			this.loadFront(reload_flag, with_pop);
			this.loadData(reload_flag, with_pop);
			this.loadFunctionality(reload_flag, with_pop);
			return this;
		}, 
		update : function (){
			this.loadFront(true, true);
			this.loadData(true, true);
			this.loadFunctionality(true, true);
			return this;
		},
		serializePage : function (_current){
			return _3.Helper.IsNullOrEmpty(_current) ? _3.Parser.serializeObject({ source : this.source, html : this.html, javascript : this.javascript, json : this.json, container : this.container }) : _3.Parser.serializeObject({ source : _current.source, html : _current.html, javascript : _current.javascript, json : _current.json, container : _current.container });
		},
		pop : function (){
			if(!_3.Helper.IsNullOrEmpty(this.html) && !_3.Helper.IsNullOrEmpty(this.javascript) && !_3.Helper.IsNullOrEmpty(this.json)){
				_3.Helper.el(this.container).innerHTML = _3.Parser.bindDataToScreen(this);
				_3.Parser.bindScript(this);	
			}
			return this;
		},
		post : function (postData, responseFormat){
			var data = _3.RequestLoader.buildPostData(postData, responseFormat);
			var callback = null;
			if(!_3.Helper.IsNullOrEmpty(data)){
				if(responseFormat == 'json'){
					callback = function (response){
						_3.Inject.data(response.responseText);
					}
				}
				if(responseFormat == 'javascript'){
					callback = function (response){
						_3.Inject.script(response.responseText);
					}
				}
				_3.RequestLoader.post('post', data, null, null, callback);
				return this;
			}
		}
	},
	Parser: {
		serializeObject : function (object){
			var current = !_3.Helper.IsNullOrEmpty(object) ? object : [];
			var serializedString = '';
			for (var key in current){
				if (current.hasOwnProperty(key)){
					if(_3.Helper.IsObject(current[key]) && !_3.Helper.IsNullOrEmpty(current[key])){
						serializedString += _3.Parser.serializeObject(current[key]) + '&';
					}
					else if(!_3.Helper.IsFunction(key)){
				    	serializedString += key + '=' + encodeURIComponent(current[key]) + '&';
				    }
				}
			}
			return _3.Helper.removeLastChar(serializedString);
		},
		bindDataToScreen : function (page){
			var data = JSON.parse(page.json);
			var template = page.html;
			this.popControls(page);
			for(var k in data){
				template = template.replace(new RegExp('{' + k + '}','g'), data[k]);
			}
			return template;
		},
		bindScript : function (page){
			return eval(page.javascript);
		},
		popControls : function (page){
			var regX = new RegExp("id=[\"'][A-Z a-z 0-9 _-]*[\"']",'g');
			page.controls.length = 0;
			while(1){
				match = regX.exec(page.html);
				if(match == null){
					break;
				} 
				page.controls.push(match[0].split('=')[1]);
			}
			return page;
		}
	},
	Inject : {
		data : function (data){
			var original = JSON.parse(_3.Page.json);
			data = JSON.parse(data);
			for(var k in data){
				original[k] = data[k];
			}
			_3.Page.json = JSON.stringify(original);
			_3.Page.pop();
		},
		script : function (script){
			return eval(script);
		}
	},
	Helper : {
		el : function (id){
			return document.getElementById(id);
		},
		trimString : function (string){
			if(this.IsString(string)){
			    string = string.replace(/^\s+/, '');
			    for (var i = string.length - 1; i >= 0; i--){
			        if (/\S/.test(string.charAt(i))){
			            string = string.substring(0, i + 1);
			            break;
			        }
			    }
			    return string;
			}
			return ' ';
		},
		removeLastChar : function (string){
			return string.slice(0, (string.length - 1));
		},
		IsNullOrEmpty : function (input){
			if (input == null){
				return true;
			}
			else if(typeof input == 'undefined'){
				return true;
			}
			else if(typeof input == 'string' && this.trimString(input) == ''){
				return true;
			}
			return false;
		},
		IsFunction : function (input){
			return (typeof input == 'function');
		},
		IsString : function (input){
			return (typeof input == 'string');
		},
		IsBoolean : function (input){
			return (typeof input == 'boolean');
		},
		IsObject : function (input){
			return (typeof input == 'object');
		},
		execCallback : function (callback, paramaterObject){
			if(!this.IsNullOrEmpty(paramaterObject)){
				if(this.IsFunction(callback)){
					return callback(paramaterObject);
				}
				if(typeof callback == 'string'){
					return eval(callback + '(' + paramaterObject + ')');
				}
			}
			_3.ErrorSilo.addError({errorMessage : 'Invalid callback or parameter object.', timestamp : new Date().getTime()}, false);
			return null;
		}
	},
	Notifier : {
		notify : function (mode, message){
			switch(mode){
				case 'error':
					this.err(message);
					break;
				case 'warning':
					this.warn(message);
					break;
				case 'success':
					this.inform(message);
					break;
			}
		},
		err : function (message){
			alert('error : ' + message);
		},
		warn : function (message){
			alert('warning : ' + message);
		},
		inform : function (message){
			alert(message);
		}
	},
	ErrorSilo : {
		errorsCount : 0,
		errors : [],
		debugMode : false,
		addError : function (errorObject, notify){
			if(!_3.Helper.IsNullOrEmpty(errorObject) && _3.Helper.trimString(errorObject) != ''){
				this.errors.push(errorObject);
				this.errorsCount++;
			}
			if(notify || this.debugMode){
				_3.Notifier.notify('error', errorObject.errorMessage);
			}
		},
		clearErrors : function(){
			this.errors.length = 0;
			this.errorsCount = 0;
		},
		printAllErrors : function (printCallback){
			if(!_3.Helper.IsNullOrEmpty(printCallback)){
				for (var i = this.errors.length - 1; i >= 0; i--){
					_3.Helper.execCallback(printCallback, this.errors[i]);
				}
			}
			else{
				this.addError({errorMessage : 'Supplied print callback function is not valid.', timestamp : new Date().getTime()}, false);
			}
		},
		toggleDebug : function (state){
			if(!_3.Helper.IsBoolean(state)){
				this.debugMode = state;
			}
			else{
				this.debugMode = !this.debugMode;
			}
		}
	},
	RequestLoader : {
		get : function (aspect, callback, parameters, onHandle){
			var currUrl = _3.urlObject();
			var callUrl = _3.urlObject(_3.Page.source + '/' + aspect + '/');
			if(!_3.Helper.IsNullOrEmpty(currUrl) && !_3.Helper.IsNullOrEmpty(callUrl)){
				return callUrl.hostname == currUrl.hostname ? new _3.XHR().get(callUrl.fullURL, callback, parameters, aspect, onHandle) : new _3.XDR().get(callUrl.fullURL, callback, parameters, aspect, onHandle);
			}
			else{
				_3.ErrorSilo.addError({errorMessage : 'Current URL is not set.', timestamp : new Date().getTime()}, false);
				return null;
			}
		},
		post : function (aspect, postData, callback, parameters, onHandle){
			var currUrl = _3.urlObject();
			var callUrl = _3.urlObject(_3.Page.source + '/post/');
			if(!_3.Helper.IsNullOrEmpty(currUrl) && !_3.Helper.IsNullOrEmpty(callUrl)){
				return callUrl.hostname == currUrl.hostname ? new _3.XHR().post(callUrl.fullURL, postData, callback, parameters, aspect, onHandle) : new _3.XDR().post(callUrl.fullURL, postData, callback, parameters, aspect, onHandle);
			}
			else{
				_3.ErrorSilo.addError({errorMessage : 'Current URL is not set.', timestamp : new Date().getTime()}, false);
				return null;
			}
		},
		buildPostData : function (data, responseFormat){
			return _3.Parser.serializeObject({
				data : data,
				format : responseFormat,
				page : _3.Page.serializePage()
			}).replace(new RegExp('%20', 'g'), '+');
		}
	},
	XHR : function (){
		this.xhr = null;
		this.get = function (_url, callback, parameters, loadIn, onHandle){
			this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			this.xhr.onreadystatechange = function(){
				_3.Handle(this, loadIn, onHandle);
				_3.Helper.execCallback(callback, parameters);
			}
			this.xhr.open('GET', _url, true);
			this.xhr.send();
			return this;
		};
		this.post = function (_url, postData, callback, parameters, loadIn, onHandle){
			this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			this.xhr.onreadystatechange = function(){
				_3.Handle(this, loadIn, onHandle);
				_3.Helper.execCallback(callback, parameters);
			}
			this.xhr.open('POST', _url, true);
			this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.xhr.send(postData);
			return this;
		};
		return this;
	},
	XDR : function (){
		this.xdr = null;
		this.get = function (_url, callback, parameters){
		};
		this.post = function (_url, json, callback, parameters){
		};
		return this;
	},
	Handle : function (requestObject, loadIn, callback){
		if (requestObject.readyState == 4){
			if(requestObject.status == 200){
				if(loadIn != 'post'){
					_3.Page[loadIn] = requestObject.responseText;
				}
				_3.Helper.execCallback(callback, requestObject);
	    	}
	    	else{
				_3.ErrorSilo.addError({errorMessage : 'XML HTTP request failed :: ' + requestObject.statusText, timestamp : new Date().getTime()}, false);
			}
		}
	},
	urlObject : function(_url){
    	var a,key,value,pair,params,variables;
		a = document.createElement('a');
		a.href = _3.Helper.IsNullOrEmpty(_url) ? window.location.href : _url;
		url_query = a.search.substring(1);
		params = {};
		variables = url_query.split('&');
		if(variables[0].length > 1){
			for(var i = 0; i < variables.length; i++){
			    pair = variables[i].split('=');
			    key = unescape(pair[0]);
			    value = unescape(pair[1]);
		    	if(value.match(/^\d+$/)){
		    		value = parseInt(value);
		    	}
				else if(value.match(/^\d+\.\d+$/)){
		        	value = parseFloat(value);
		        }
		    	if(typeof params[key] === 'undefined'){
		       		params[key] = value;
		       	}
		    	else if(typeof params[key] === 'string'){
		       		params[key] = [params[key],value];
		       	}
		    	else{
		       		params[key].push(value);
		       	}
		  	}	
		}
   		var urlObj = {
   			fullURL : _url,
			protocol:a.protocol,
			hostname:a.hostname,
			host:a.host,
			port:a.port,
			hash:a.hash,
			pathname:a.pathname,
			search:a.search,
			parameters:params
   		};
   		return urlObj;
	}
}