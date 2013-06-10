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
var _3 = function (_source, loads){
	this.Page = {
		__3: this.parent, source : '', html : '', javascript : '', json : '', container : '', controls : [], dataRepo : '',
		configurePage : function (_source){
			this.source = this.__3.Helper.IsNullOrEmpty(_source.source) ? '' : _source.source;
			this.container = this.__3.Helper.IsNullOrEmpty(_source.container) ? '' : _source.container;
			this.dataRepo =  this.__3.Helper.IsNullOrEmpty(_source.dataRepo) ? this.createDateRepo() : _source.dataRepo;
			return this;
		},
		loadFront : function (reload_flag, with_pop){
			if(this.__3.Helper.IsNullOrEmpty(this.html) || (this.__3.Helper.IsBoolean(reload_flag) && reload_flag)){
				this.__3.RequestLoader.get('html', function (_pop){ 
					if(_pop){
						this.__3.Page.pop();
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
			if(this.__3.Helper.IsNullOrEmpty(this.html) || (this.__3.Helper.IsBoolean(reload_flag) && reload_flag)){
				this.__3.RequestLoader.get('json', function (_pop){ 
					if(_pop){
						this.__3.Page.pop();
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
			if(this.__3.Helper.IsNullOrEmpty(this.html) || (this.__3.Helper.IsBoolean(reload_flag) && reload_flag)){
				this.__3.RequestLoader.get('javascript', function (_pop){ 
					if(_pop){
						this.__3.Page.pop();
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
		serializePage : function (_page){
			return this.__3.Parser.serializeObject({ source : this.source, html : this.html, javascript : this.javascript, json : this.json, container : this.container });
		},
		pop : function (){
			if(!this.__3.Helper.IsNullOrEmpty(this.html) && !this.__3.Helper.IsNullOrEmpty(this.javascript) && !this.__3.Helper.IsNullOrEmpty(this.json)){
				this.__3.Helper.el(this.container).innerHTML = this.__3.Parser.bindDataToScreen(this);
				this.__3.Parser.bindScript(this);	
			}
			return this;
		},
		post : function (postData, responseFormat, IsInPostResponseRepo){
			var data = this.__3.RequestLoader.buildPostData(postData, responseFormat);
			var callback = null;
			if(!this.__3.Helper.IsNullOrEmpty(data)){
				if(responseFormat == 'json'){
					if(IsInPostResponseRepo){
						callback = function (response){
							this.__3.Inject.pushToRepo(response);
						}
					}
					else{
						callback = function (response){
							this.__3.Inject.data(response.responseText);
						}
					}
				}
				if(responseFormat == 'javascript'){
					callback = function (response){
						this.__3.Inject.script(response.responseText);
					}
				}
				this.__3.RequestLoader.post('post', data, null, null, callback);
				return this;
			}
		},
		getDataRepo : function(){
			return JSON.parse(this.__3.Helper.el(this.dataRepo).innerText);
		},
		addToDataRepo : function (data){
			var timesign = "data_" + new Date().getTime().toString();
			this.__3.Helper.el(this.dataRepo).innerText += "," + timesign + "={" + JSON.stringify(data) + "}";
			return timesign;
		},
		createDateRepo : function (){
			var element = document.createElement('input');
			element.type = 'hidden';
			element.id = this.container + "__" + new Date().getTime().toString();
			document.getElementsByTagName('body').appendChild(element);
			return element.id;
		}
	};
	this.Parser = {
		__3: this.parent,
		serializeObject : function (object){
			var current = !this.__3.Helper.IsNullOrEmpty(object) ? object : [];
			var serializedString = '';
			for (var key in current){
				if (current.hasOwnProperty(key)){
					if(this.__3.Helper.IsObject(current[key]) && !this.__3.Helper.IsNullOrEmpty(current[key])){
						serializedString += this.__3.Parser.serializeObject(current[key]) + '&';
					}
					else if(!this.__3.Helper.IsFunction(key)){
				    	serializedString += key + '=' + encodeURIComponent(current[key]) + '&';
				    }
				}
			}
			return this.__3.Helper.removeLastChar(serializedString);
		},
		bindDataToScreen : function (){
			var data = JSON.parse(this.__3.Page.json);
			var template = this.__3.Page.html;
			this.popControls(this.__3.Page);
			for(var k in data){
				template = template.replace(new RegExp('{' + k + '}','g'), data[k]);
			}
			return template;
		},
		bindScript : function (){
			return eval(this.__3.Page.javascript);
		},
		popControls : function (){
			var regX = new RegExp("id=[\"'][A-Z a-z 0-9 _-]*[\"']",'g');
			this.__3.Page.controls.length = 0;
			while(1){
				match = regX.exec(this.__3.Page.html);
				if(match == null){
					break;
				} 
				this.__3.Page.controls.push(match[0].split('=')[1]);
			}
			return this.__3.Page;
		}
	};
	this.Inject = {
		__3: this.parent,
		pushToRepo : function (data){
			this.__3.Page.addToDataRepo(data);
		},
		data : function (data){
			var original = JSON.parse(this.__3.Page.json);
			data = JSON.parse(data);
			for(var k in data){
				original[k] = data[k];
			}
			this.__3.Page.json = JSON.stringify(original);
			this.__3.Page.pop();
		},
		script : function (script){
			return eval(script);
		},
		registerStylesheet : function (cssUrl){
			var link = document.createElement('link');
			var head = document.getElementsByTagName("head")[0];
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("type", "text/css");
			link.setAttribute("href", cssUrl);
			head.appendChild(link);
		},
		registerJavascript : function (jsUrl){
			var script = document.createElement('script');
			var head = document.getElementsByTagName("head")[0];
			script.setAttribute("type","text/javascript");
			script.setAttribute("src", jsUrl);
			head.appendChild(script);
		} 
	};
	this.Helper = {
		__3: this.parent,
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
			this.__3.ErrorSilo.addError({errorMessage : 'Invalid callback or parameter object.', timestamp : new Date().getTime()}, false);
			return null;
		}
	};
	this.Notifier = {
		__3: this.parent,
		notifyCallback : '',
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
	};
	this.ErrorSilo = {
		__3: this.parent,
		errorsCount : 0,
		errors : [],
		debugMode : false,
		addError : function (errorObject, notify){
			if(!this.__3.Helper.IsNullOrEmpty(errorObject) && this.__3.Helper.trimString(errorObject) != ''){
				this.errors.push(errorObject);
				this.errorsCount++;
			}
			if(notify || this.debugMode){
				this.__3.Notifier.notify('error', errorObject.errorMessage);
			}
		},
		clearErrors : function(){
			this.errors.length = 0;
			this.errorsCount = 0;
		},
		printAllErrors : function (printCallback){
			if(!this.__3.Helper.IsNullOrEmpty(printCallback)){
				for (var i = this.errors.length - 1; i >= 0; i--){
					this.__3.Helper.execCallback(printCallback, this.errors[i]);
				}
			}
			else{
				this.addError({errorMessage : 'Supplied print callback function is not valid.', timestamp : new Date().getTime()}, false);
			}
		},
		toggleDebug : function (state){
			if(!this.__3.Helper.IsBoolean(state)){
				this.debugMode = state;
			}
			else{
				this.debugMode = !this.debugMode;
			}
		}
	};
	this.RequestLoader = {
		__3: this.parent,
		get : function (aspect, callback, parameters, onHandle){
			var currUrl = this.__3.urlObject();
			var callUrl = this.__3.urlObject(this.__3.Page.source + '/' + aspect + '/');
			if(!this.__3.Helper.IsNullOrEmpty(currUrl) && !this.__3.Helper.IsNullOrEmpty(callUrl)){
				return callUrl.hostname == currUrl.hostname ? new this.__3.XHR().get(callUrl.fullURL, callback, parameters, aspect, onHandle) : new this.__3.XDR().get(callUrl.fullURL, callback, parameters, aspect, onHandle);
			}
			else{
				this.__3.ErrorSilo.addError({errorMessage : 'Current URL is not set.', timestamp : new Date().getTime()}, false);
				return null;
			}
		},
		post : function (aspect, postData, callback, parameters, onHandle){
			var currUrl = this.__3.urlObject();
			var callUrl = this.__3.urlObject(this.__3.Page.source + '/post/');
			if(!this.__3.Helper.IsNullOrEmpty(currUrl) && !this.__3.Helper.IsNullOrEmpty(callUrl)){
				return callUrl.hostname == currUrl.hostname ? new this.__3.XHR().post(callUrl.fullURL, postData, callback, parameters, aspect, onHandle) : new this.__3.XDR().post(callUrl.fullURL, postData, callback, parameters, aspect, onHandle);
			}
			else{
				this.__3.ErrorSilo.addError({errorMessage : 'Current URL is not set.', timestamp : new Date().getTime()}, false);
				return null;
			}
		},
		buildPostData : function (data, responseFormat){
			return this.__3.Parser.serializeObject({
				data : data,
				format : responseFormat,
				page : this.__3.Page.serializePage()
			}).replace(new RegExp('%20', 'g'), '+');
		}
	};
	this.XHR = function (){
		this.__3 = this.parent;
		this.xhr = null;
		this.get = function (_url, callback, parameters, loadIn, onHandle){
			this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			this.xhr.onreadystatechange = function(){
				this.__3.Handle(this, loadIn, onHandle);
				this.__3.Helper.execCallback(callback, parameters);
			}
			this.xhr.open('GET', _url, true);
			this.xhr.send();
			return this;
		};
		this.post = function (_url, postData, callback, parameters, loadIn, onHandle){
			this.xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			this.xhr.onreadystatechange = function(){
				this.__3.Handle(this, loadIn, onHandle);
				this.__3.Helper.execCallback(callback, parameters);
			}
			this.xhr.open('POST', _url, true);
			this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.xhr.send(postData);
			return this;
		};
		return this;
	};
	this.XDR = function (){
		this.__3 = this.parent;
		this.xdr = null;
		this.get = function (_url, callback, parameters, loadIn, onHandle){
			this.xdr = new XDomainRequest();
			this.xdr.onreadystatechange = function(){
				this.__3.Handle(this, loadIn, onHandle);
				this.__3.Helper.execCallback(callback, parameters);
			}
			this.xdr.open('GET', _url, true);
			this.xdr.send();
			return this;
		};
		this.post = function (_url, postData, callback, parameters, loadIn, onHandle){
			this.xdr = new XDomainRequest();
			this.xdr.onreadystatechange = function(){
				this.__3.Handle(this, loadIn, onHandle);
				this.__3.Helper.execCallback(callback, parameters);
			}
			this.xdr.open('POST', _url, true);
			this.xdr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			this.xdr.send(postData);
			return this;
		};
		return this;
	};
	this.Handle = function (requestObject, loadIn, callback){
		this.__3 = this.parent;
		if (requestObject.readyState == 4){
			if(requestObject.status == 200){
				if(loadIn != 'post'){
					this.__3.Page[loadIn] = requestObject.responseText;
				}
				this.__3.Helper.execCallback(callback, requestObject);
	    	}
	    	else{
				this.__3.ErrorSilo.addError({errorMessage : 'x-HTTP request failed :: ' + requestObject.statusText, timestamp : new Date().getTime()}, false);
			}
		}
	};
	this.urlObject = function(_url){
		this.__3 = this.parent;
    	var a,key,value,pair,params,variables;
		a = document.createElement('a');
		a.href = this.__3.Helper.IsNullOrEmpty(_url) ? window.location.href : _url;
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
	};

	this.Page.configurePage(_source);

	if(loads)
		this.Page.load(true, true);
}