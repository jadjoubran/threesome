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
	Pink Floyd, Daft Punk, Tolkein, H. Miller, AC. Doyle, code & alcohol. Charly passes by a lot; 
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
1- Must write functions to GET Js/Css files for PAGE object accordingly.
2- adjust file structure accordingly (in example) to test new model.
3- make sure parent object is being parsed in all browsers/platforms.
4- make sure all dataRepo management is being handled correctly
5- need EXTENSIVE testing.
6- after all the above is done, reimplement using prototypes

*/
var _3 = {
	Page : function(_source){
		this.source = ''; 
		this.html = ''; 
		this.javascript = ''; 
		this.json = ''; 
		this.container = ''; 
		this.controls = []; 
		this.dataRepo = '';
		this.helper = new _3.Helper();
		this.reqHandle = new _3.RequestLoader();
		this.parser = new _3.Parser();
		this.injector = new _3.Inject();
		this.configurePage = function (_source){
			this.source = this.helper.IsNullOrEmpty(_source.source) ? '' : _source.source;
			this.container = this.helper.IsNullOrEmpty(_source.container) ? '' : _source.container;
			this.dataRepo =  this.helper.IsNullOrEmpty(_source.dataRepo) ? this.createDateRepo() : _source.dataRepo;
			return this;
		};
		this.loadFront = function (reload_flag, with_pop){
			if(this.helper.IsNullOrEmpty(this.html) || (this.helper.IsBoolean(reload_flag) && reload_flag)){
				this.reqHandle.get(this, 'html', function (_parameters){ 
					if(_parameters.withpop){
						_parameters.page.pop();
					}
				}, with_pop, null);
			}
			else{
				if(with_pop){
					this.pop();
				}
			}
			return this;
		};
		this.loadData = function (reload_flag, with_pop){
			if(this.helper.IsNullOrEmpty(this.html) || (this.helper.IsBoolean(reload_flag) && reload_flag)){
				this.reqHandle.get(this, 'json', function (_parameters){ 
					if(_parameters.withpop){
						_parameters.page.pop();
					}
				}, with_pop, null);
			}
			else{
				if(with_pop){
					this.pop();
				}
			}
			return this;
		};
		this.loadFunctionality = function (reload_flag, with_pop){
			if(this.helper.IsNullOrEmpty(this.html) || (this.helper.IsBoolean(reload_flag) && reload_flag)){
				this.reqHandle.get(this, 'javascript', function (_parameters){ 
					if(_parameters.withpop){
						_parameters.page.pop();
					}
				}, with_pop, null);
			}
			else{
				if(with_pop){
					this.pop();
				}
			}
			return this;
		};
		this.load = function (reload_flag, with_pop){
			this.loadFront(reload_flag, with_pop);
			this.loadData(reload_flag, with_pop);
			this.loadFunctionality(reload_flag, with_pop);
			return this;
		};
		this.update = function (){
			this.loadFront(true, true);
			this.loadData(true, true);
			this.loadFunctionality(true, true);
			return this;
		};
		this.serializePage = function (_page){
			return this.parser.serializeObject({ source : this.source, html : this.html, javascript : this.javascript, json : this.json, container : this.container });
		};
		this.pop = function (){
			if(!this.helper.IsNullOrEmpty(this.html) && !this.helper.IsNullOrEmpty(this.javascript) && !this.helper.IsNullOrEmpty(this.json)){
				this.helper.el(this.container).innerHTML = this.parser.bindDataToScreen(this);
				this.parser.bindScript(this);	
			}
			return this;
		};
		this.post = function (postData, responseFormat, IsInPostResponseRepo){
			var data = this.reqHandle.buildPostData(this, postData, responseFormat);
			var callback = null;
			if(!this.helper.IsNullOrEmpty(data)){
				if(responseFormat == 'json'){
					if(IsInPostResponseRepo){
						callback = function (_parameters){
							_parameters.page.injector.pushToRepo(this, _parameters.response.responseText);
						}
					}
					else{
						callback = function (_parameters){
							_parameters.page.injector.data(this, _parameters.response.responseText);
						}
					}
				}
				if(responseFormat == 'javascript'){
					callback = function (_parameters){
						_parameters.page.injector.script(_parameters.response.responseText);
					}
				}
				this.reqHandle.post(this, 'post', data, null, null, callback);
				return this;
			}
		};
		this.getDataRepo = function(){
			return JSON.parse(this.helper.el(this.dataRepo).innerText);
		};
		this.addToDataRepo = function (data){
			var timesign = "data_" + new Date().getTime().toString();
			this.helper.el(this.dataRepo).innerText += "," + timesign + "={" + JSON.stringify(data) + "}";
			return timesign;
		};
		this.createDateRepo = function (){
			var element = document.createElement('input');
			element.type = 'hidden';
			element.id = this.container + "__" + new Date().getTime().toString();
			document.getElementsByTagName('body')[0].appendChild(element);
			return element.id;
		};
		this.configurePage(_source);
		return this;
	},
	Parser : function(){
		this.helper = new _3.Helper();
		this.serializeObject = function (object){
			var current = !this.helper.IsNullOrEmpty(object) ? object : [];
			var serializedString = '';
			for (var key in current){
				if (current.hasOwnProperty(key)){
					if(this.helper.IsObject(current[key]) && !this.helper.IsNullOrEmpty(current[key])){
						serializedString += this.serializeObject(current[key]) + '&';
					}
					else if(!this.helper.IsFunction(key)){
				    	serializedString += key + '=' + encodeURIComponent(current[key]) + '&';
				    }
				}
			}
			return this.helper.removeLastChar(serializedString);
		};
		this.bindDataToScreen = function (page){
			var data = JSON.parse(page.json);
			var template = page.html;
			this.popControls(page);
			for(var k in data){
				template = template.replace(new RegExp('{' + k + '}','g'), data[k]);
			}
			return template;
		};
		this.bindScript = function (page){
			return eval(page.javascript);
		};
		this.popControls = function (page){
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
		};
		return this;
	},
	Inject : function(){
		this.pushToRepo = function (page, data){
			page.addToDataRepo(data);
		};
		this.data = function (page, data){
			var original = JSON.parse(page.json);
			data = JSON.parse(data);
			for(var k in data){
				original[k] = data[k];
			}
			page.json = JSON.stringify(original);
			page.pop();
		};
		this.script = function (script){
			return eval(script);
		};
		this.registerStylesheet = function (cssUrl){
			var link = document.createElement('link');
			var head = document.getElementsByTagName("head")[0];
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", cssUrl);
			head.appendChild(link);
		};
		this.registerJavascript = function (jsUrl){
			var script = document.createElement('script');
			var head = document.getElementsByTagName("head")[0];
			script.setAttribute("type","text/javascript");
			script.setAttribute("src", jsUrl);
			head.appendChild(script);
		};
		return this;
	},
	Helper : function(){
		this.el = function (id){
			return document.getElementById(id);
		};
		this.trimString = function (string){
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
		};
		this.removeLastChar = function (string){
			return string.slice(0, (string.length - 1));
		};
		this.IsNullOrEmpty = function (input){
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
		};
		this.IsFunction = function (input){
			return (typeof input == 'function');
		};
		this.IsString = function (input){
			return (typeof input == 'string');
		};
		this.IsBoolean = function (input){
			return (typeof input == 'boolean');
		};
		this.IsObject = function (input){
			return (typeof input == 'object');
		};
		this.execCallback = function (callback, paramaterObject){
			if(!this.IsNullOrEmpty(paramaterObject)){
				if(this.IsFunction(callback)){
					return callback(paramaterObject);
				}
				if(typeof callback == 'string'){
					return eval(callback + '(' + paramaterObject + ')');
				}
			}
			_3.ErrorSilo().addError({errorMessage : 'Invalid callback or parameter object.', timestamp : new Date().getTime()}, false);
			return null;
		};
		return this;
	},
	Notifier : function(){
		this.notifyCallback = '';
		this.notify = function (mode, message){
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
		};
		this.err = function (message){
			alert('error : ' + message);
		};
		this.warn = function (message){
			alert('warning : ' + message);
		};
		this.inform = function (message){
			alert(message);
		};
		return this;
	},
	ErrorSilo : {
		errorsCount : 0,
		errors : [],
		debugMode : false,
		//helper : new this.Helper(),
		//notifier : new this.Notifier(),
		addError : function (errorObject, notify){
		//	if(!this.helper.IsNullOrEmpty(errorObject) && this.helper.trimString(errorObject) != ''){
		//		this.errors.push(errorObject);
		//		this.errorsCount++;
		//	}
		//	if(notify || this.debugMode){
		//		this.notifier.notify('error', errorObject.errorMessage);
		//	}
		},
		clearErrors : function(){
			this.errors.length = 0;
			this.errorsCount = 0;
		},
		printAllErrors : function (printCallback){
		//	if(!this.helper.IsNullOrEmpty(printCallback)){
		//		for (var i = this.errors.length - 1; i >= 0; i--){
		//			this.helper.execCallback(printCallback, this.errors[i]);
		//		}
		//	}
		//	else{
		//		this.addError({errorMessage : 'Supplied print callback function is not valid.', timestamp : new Date().getTime()}, false);
		//	}
		},
		toggleDebug : function (state){
		//	if(!this.helper.IsBoolean(state)){
		//		this.debugMode = state;
		//	}
		//	else{
		//		this.debugMode = !this.debugMode;
		//	}
		}
	},
	RequestLoader : function(){
		this.helper = new _3.Helper();
		this.parser = new _3.Parser();
		this.get = function (page, aspect, callback, parameters, onHandle){
			var currUrl = _3.urlObject();
			var callUrl = _3.urlObject(page.source + '/' + aspect + '/');
			if(!this.helper.IsNullOrEmpty(currUrl) && !this.helper.IsNullOrEmpty(callUrl)){
				return callUrl.hostname == currUrl.hostname ? new _3.XHR().get(page, callUrl.fullURL, callback, parameters, aspect, onHandle) : new _3.XDR().get(page, callUrl.fullURL, callback, parameters, aspect, onHandle);
			}
			else{
				_3.ErrorSilo.addError({errorMessage : 'Current URL is not set.', timestamp : new Date().getTime()}, false);
				return null;
			}
		};
		this.post = function (page, aspect, postData, callback, parameters, onHandle){
			var currUrl = _3.urlObject();
			var callUrl = _3.urlObject(page.source + '/post/');
			if(!this.helper.IsNullOrEmpty(currUrl) && !this.helper.IsNullOrEmpty(callUrl)){
				return callUrl.hostname == currUrl.hostname ? new _3.XHR().post(page, callUrl.fullURL, postData, callback, parameters, aspect, onHandle) : new _3.XDR().post(page, callUrl.fullURL, postData, callback, parameters, aspect, onHandle);
			}
			else{
				_3.ErrorSilo.addError({errorMessage : 'Current URL is not set.', timestamp : new Date().getTime()}, false);
				return null;
			}
		};
		this.buildPostData = function (page, data, responseFormat){
			return this.parser.serializeObject({
				data : data,
				format : responseFormat,
				page : page.serializePage()
			}).replace(new RegExp('%20', 'g'), '+');
		};
		return this;
	},
	XHR : function (){
		this.helper = new _3.Helper();
		this.xhr = null;
		this.get = function (page, _url, callback, parameters, loadIn, onHandle){
			this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			this.xhr.onreadystatechange = function(){
				_3.Handle(page, this, loadIn, onHandle);
				this.helper.execCallback(callback, '');
			}
			this.xhr.open('GET', _url, true);
			this.xhr.send();
			return this;
		};
		this.post = function (page, _url, postData, callback, parameters, loadIn, onHandle){
			this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			this.xhr.onreadystatechange = function(){
				_3.Handle(page, this, loadIn, onHandle);
				this.helper.execCallback(callback, '');
			}
			this.xhr.open('POST', _url, true);
			this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.xhr.send(postData);
			return this;
		};
		return this;
	},
	XDR : function (){
		this.helper = new _3.Helper();
		this.xdr = null;
		this.get = function (page, _url, callback, parameters, loadIn, onHandle){
			this.xdr = new XDomainRequest();
			this.xdr.onreadystatechange = function(){
				_3.Handle(page, this, loadIn, onHandle);
				this.helper.execCallback(callback, { 'page' : page, 'withpop' : parameters});
			}
			this.xdr.open('GET', _url, true);
			this.xdr.send();
			return this;
		};
		this.post = function (page, _url, postData, callback, parameters, loadIn, onHandle){
			this.xdr = new XDomainRequest();
			this.xdr.onreadystatechange = function(){
				_3.Handle(page, this, loadIn, onHandle);
				this.helper.execCallback(callback, { 'page' : page, 'parameters' : parameters});
			}
			this.xdr.open('POST', _url, true);
			this.xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.xdr.send(postData);
			return this;
		};
		return this;
	},
	Handle : function (page, requestObject, loadIn, callback){
		this.helper = new _3.Helper();
		if (requestObject.readyState == 4){
			if(requestObject.status == 200){
				if(loadIn != 'post'){
					page[loadIn] = requestObject.responseText;
				}
				this.helper.execCallback(callback, requestObject);
	    	}
	    	else{
				_3.ErrorSilo.addError({errorMessage : 'x-HTTP request failed :: ' + requestObject.statusText, timestamp : new Date().getTime()}, false);
			}
		}
	},
	urlObject : function(_url){
		this.helper = new _3.Helper();
    	var a,key,value,pair,params,variables;
		a = document.createElement('a');
		a.href = this.helper.IsNullOrEmpty(_url) ? window.location.href : _url;
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
};