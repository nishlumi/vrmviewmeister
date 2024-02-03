//define of Utilities


//shortcut of i18n function
var onKeyope=false;
var curLocale = {
	messages : null,
	name : "",
	fullName : "",
	environment : {}
};
var appEnvironment = "d"; //h - honban, d - kaihatu
const TRANSLATE_TARGET_CLASS = ".vv-translation";
const TRANSLATE_TITLETARGET_CLASS = ".vv-translation-title";

/**
 * Translate String
 * @param {String} target word
 * @returns {String} translated word
 */
function _T(){
	//console.log(arguments);
	var res = arguments[0];
	var params = [];
	if (arguments.length > 1) {
		params = arguments[1];
	}
	var retstr = "";
	//---web app (Quasar version)
	if (Quasar.lang.props.user != null) {
		if (res in Quasar.lang.props.user.default) {
			retstr = Quasar.lang.props.user.default[res];
		}else{
			//---no hit, return original
			retstr = res;
		}
	}else{
		retstr = res;
	}

	//置換文字列がある場合はそれらを置き換え(%1～%9)
	var pcnt = params.length;
	if (pcnt > 9) pcnt = 9;
	for (var i = 0; i < pcnt; i++) {
		var repstr = "%"+(i+1);
		retstr = retstr.replace(repstr,params[i]);
	}
	return retstr;
}

/**
 * shortcut for document.getElementById()
 * @param {String} id 
 * @return {HTMLElement} element
 */
function ID(id) { return document.getElementById(id); };
/**
 * shortcut for document.getElementsByTagName
 * @param {*} id 
 */
function Ts(id) { return document.getElementsByTagName(id); };
/**
 * shortcut for document.getElementsByClassName
 * @param {string} id 
 */
function Cs(id) { return document.getElementsByClassName(id); };
/**
 * shortcut for document.querySelector()
 * @param {String} query 
 * @return {HTMLElement} element
 */
function Q(query) { return document.querySelector(query); };
/**
 * shortcut for document.querySelectorAll()
 * @param {String} query 
 * @return {NodeList}
 */
function Qs(query) { return document.querySelectorAll(query); };
/**
 * shortcut for document.createElement()
 * @param {String} tag 
 * @return {HTMLElement}
 */
function GEN(tag) { return document.createElement(tag); };

/**
 * 
 * @param {HTMLElement} elem 
 * @param {Object} value 
 */
function setValueAndChangeTrigger(elem,value) { 
	elem.value = value;
	elem.dispatchEvent(new Event("change"));
}
function GEN_PlainGrid(elements,columns) {
	var plaingrid = GEN("div");
	plaingrid.classList.add("plain-grid");

	for (var c = 0; c < columns.length; c++) {
		var col = columns[c];

		var pg_c = GEN("div");
		pg_c.style.gridColumn = col;
		pg_c.appendChild(elements[c]);
		plaingrid.appendChild(pg_c);
	}
	return plaingrid;
}
function DEBUGLOG() {
	if (appEnvironment == "h") return;
	var arr = [];
	for (var i = 0; i < arguments.length; i++) {
		arr.push(arguments[i]);
	}
	console.log(arr);
}

async function setupLocale(params){

	const jsonResponse = async (response) => {
		if (response.ok) {
			curLocale.name = response.url;
			console.log("ok locale:" + response.url);
			var a = document.createElement("a");
			a.href = response.url;
			var arr = a.pathname.split("/");
			var loc = arr[arr.length-1].replace(".json","");
			Q("html").setAttribute("lang",loc);
			var resjson = await response.json();
			curLocale.messages = resjson;
			return curLocale;
		}else{
			return null;
		}
	}
	

	//var def = $.Deferred();
	curLocale.environment = checkBrowser();
	//only webapp, setup locale
	//}else if (("WinJS" in window)){
	if (curLocale.environment.platform == "windowsapp") {
		var def = new Promise((resolve,reject)=>{
			//---Windows store app
			curLocale.name = String(Windows.Globalization.ApplicationLanguages.languages[0]).split("-")[0];
			curLocale.fullName = Windows.Globalization.ApplicationLanguages.languages[0];
			return resolve(true);
		});
		return def;
	}

	var locjson;
	var fetches = [];
	//[1] ---if localStorage has appLocale, use it.
	var hitStorage = localStorage.getItem("appLocale");
	if (hitStorage) {
		curLocale.name = hitStorage;
		curLocale.fullName = hitStorage;

		if (location.pathname.indexOf("static/win/") > -1) {
			locjson = `../locales/${curLocale.name}.json`;
		}else{
			locjson = `static/locales/${curLocale.name}.json`;
		}
	
		//fetches.push(fetch(locjson));
		var response = await fetch(locjson);
		return jsonResponse(response);
	}else{
		//[2] URL引数から hl=* を取得
		var p_lng;
		p_lng = (params["hl"] ? params["hl"] : "");
		if (p_lng != "") {
			curLocale.name = p_lng;
			curLocale.fullName = p_lng;
			if (location.pathname.indexOf("static/win/") > -1) {
				locjson = `../locales/${curLocale.name}.json`;
			}else{
				locjson = `static/locales/${curLocale.name}.json`;
			}
		
			localStorage.setItem("appLocale",curLocale.name);
			//fetches.push(fetch(locjson));
			var response = await fetch(locjson);
			return jsonResponse(response);
		}else{
			//[3] final judge is navigator.languages[0], default is "en"
			var arr = navigator.languages;
			var curloc = arr.length > 0 ? arr[0] : "en";   //document.body.parentElement.lang;
			curloc = curloc.split("-")[0];
			var retjson = null;
			for (var i = 0; i < arr.length; i++) {
				var arrlang = arr[i].split("-")[0];
				if (location.pathname.indexOf("static/win/") > -1) {
					locjson = `../locales/${arrlang}.json`;
				}else{
					locjson = `static/locales/${arrlang}.json`;
				}
				
				//fetches.push(fetch(locjson));
				var response = await fetch(locjson);
				retjson = jsonResponse(response);
				if (retjson) {
					curloc = arrlang;
					break;
				}
			}
			curLocale.name = curloc;
			curLocale.fullName = curloc;
			localStorage.setItem("appLocale",curLocale.name);
			return retjson;
		}
		

	}
	/*
	return Promise.any(fetches)
	.then(response => {
		if (response.ok) {
			curLocale.name = response.url;
			console.log("ok locale:" + response.url);
			var a = document.createElement("a");
			a.href = response.url;
			var arr = a.pathname.split("/");
			var loc = arr[arr.length-1].replace(".json","");
			Q("html").setAttribute("lang",loc);
			return response.json();
		}else{
			var locjson = "";
			if (location.pathname.indexOf("static/win/") > -1) {
				locjson = `../locales/en.json`;
			}else{
				locjson = `static/locales/en.json`;
			}
			
			return fetch(locjson);
		}
	})
	.then((resjson)=>{
		curLocale.messages = resjson;
		return curLocale;
	})
	.catch(()=>{

	});
	*/

}
function translate_UI () {
	if (curLocale.messages != null) {
		var elements = Qs(TRANSLATE_TARGET_CLASS);
		var retstr = "";
	
		//---translate textContent
		for (var i = 0; i < elements.length; i++) {
			var elm = elements[i];
			if (elm.textContent in curLocale.messages) {
				elm.textContent = curLocale.messages[elm.textContent];
			}
			//---no hit, return original 
		}

		//---translate title-attribute
		elements = Qs(TRANSLATE_TITLETARGET_CLASS);
		for (var i = 0; i < elements.length; i++) {
			var elm = elements[i];
			if (elm.title in curLocale.messages) {
				elm.title = curLocale.messages[elm.title];
			}
		}

		/*
		  other is access directly _T(msgid) in program.
		*/
	}
}
function optimizeLocale(target) {
	for (var obj in curLocale.messages) {
		Object.defineProperty(target,obj,{
			configurable : false,
			value : curLocale.messages[obj]
		});
	}
}
function optiset(target,targetprop,value) {
	Object.defineProperty(target,targetprop,{
		configurable : false,
		value : value
	});
}
function checkBrowser(){
	var ret = {
		"platform" : "",
		"kind" : ""
	};
	if ("Windows" in window) {
		ret.platform = "windowsapp";
		return ret;
	}
	if ("nw" in window) {
		ret.kind = "chrome";
		ret.platform = "nw";
		return ret;
	}
	if (navigator.userAgent.toLowerCase().indexOf("electron") != -1) {
		ret.kind =  "chrome";
		ret.platform = "electron";
		return ret;
	}
	
	if ("chrome" in window) {
		if ("storage" in chrome) {
			ret.platform =  "chromeapps";
		}else{
			ret.kind =  "chrome";
			ret.platform = "browser";
		}
		return ret;
	}
	if (navigator.userAgent.toLowerCase().indexOf("edge") != -1) {
		ret.kind =  "edge";
		ret.platform = "browser";
	}
	if (navigator.userAgent.toLowerCase().indexOf("trident") != -1) {
		ret.kind =  "ie";
		ret.platform = "browser";
	}
	if (navigator.userAgent.toLowerCase().indexOf("firefox") != -1) {
		ret.kind =  "firefox";
		ret.platform = "browser";
	}
	if (navigator.userAgent.toLowerCase().indexOf("opr") != -1) {
		ret.kind =  "opera";
		ret.platform = "browser";
	}
	if (navigator.userAgent.toLowerCase().indexOf("vivaldi") != -1) {
		ret.kind =  "vivaldi";
		ret.platform = "browser";
	}
	if (navigator.userAgent.toLowerCase().indexOf("android") != -1) {
		ret.platform = "android";
	}
	if (navigator.userAgent.toLowerCase().indexOf("iphone") != -1) {
		ret.platform = "ios";
	}
	if (navigator.userAgent.toLowerCase().indexOf("iipad") != -1) {
		ret.platform = "ios";
	}
	return ret;
}
function GetEnumName(typeclass,val) {
    var ret = "";
    for (var obj in typeclass) {
        if (typeclass[obj] == val) {
            ret = obj;
            break;
        }
    }
    return ret;
}
//defines of global variables


//---instead of window.alert, confirm, prompt
/**
 * To show application message
 * @param {String} message 
 * @param {Function} callback 
 */
function appAlert(message,callback){
	Quasar.Dialog.create({
		message : message
	});
}
/**
 * 
 * @param {String} message message message to show
 * @param {Function} callback callthen function to perform 
 * @param {Object} callthen 
 */
function appConfirm(message,callback,callthen) {
	Quasar.Dialog.create({
		message : message,
		cancel : true,
		persistent : true
	})
	.onOk(() => {
		(callback)();
	});
	
}
function appConfirmWithCancel(message,callback,callcancel) {
	Quasar.Dialog.create({
		message : message,
		cancel : true,
		persistent : true
	})
	.onOk(() => {
		(callback)();
	})
	.onCancel(() => {
		(callcancel)();
	});
	
}
function appPrompt( message, callthen, defaultval ) {
	Quasar.Dialog.create({
		message : message,
		prompt : {
			model : defaultval || "",
			type : "text"
		},
		cancel : true,
		persistent : true
	})
	.onOk(data => {
		(callthen)(data);
	});

}

function _appNotify(param) {
	Quasar.Notify.create(param);
}
function appNotify(message,options) {
	//alertify.notify(message);
	var param = {
		message : message
	};
	if (options["position"]) param["position"] = options["position"];
	if (options["timeout"]) param["timeout"] = options["timeout"];
	_appNotify(param);
}
function appNotifySuccess(message,options) {
	var param = {
		message : message,
		type : "positive"
	};
	if (options["position"]) param["position"] = options["position"];
	if (options["timeout"]) param["timeout"] = options["timeout"];
	_appNotify(param);
}
function appNotifyWarning(message,options) {
	var param = {
		message : message,
		type : "warning"
	};
	if (options["position"]) param["position"] = options["position"];
	if (options["timeout"]) param["timeout"] = options["timeout"];
	_appNotify(param);
}


//=====================================================================================
// Other custom functions
//=====================================================================================

function ch2seh(data) {
	////return data.replace(/&lt;/g,"").replace(/&gt;/g,"")
	////	.replace(/innerHTML|document|querySelector|getElement/g,"");
	//return data.replace(/&lt;/g,"& lt;").replace(/&gt;/g,"& gt;");
	//---This is scary to re-write gt and lt tag.(Because, DOMpurify do not work.)
	if (!data) return "";
	/*var tmp = data.replace(/&lt;/g," _<").replace(/&gt;/g,">_ ");
	var res =  DOMPurify.sanitize(tmp,{ADD_ATTR: ['target','rel']})
	var res2 = res.replace(/\s_</g,"&lt;").replace(/>_\s/g,"&gt;");
	return res2;
*/
	var tmp = data.replace(/&lt;/g,"_$<").replace(/&gt;/g,">$_");
	return DOMPurify.sanitize(tmp,{ADD_ATTR: ['target','rel']})
	.replace(/_\$\&lt\;/g,"&lt;").replace(/\&gt\;\$_/g,"&gt;")
	.replace(/_\$</g,"&lt;").replace(/>\$_/g,"&gt;");

}
const toBlob = (base64) => {
    const decodedData = atob(base64.replace(/^.*,/, ""));
    const buffers = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      buffers[i] = decodedData.charCodeAt(i);
    }
    try {
      const blob = new Blob([buffers.buffer], {
        type: "image/png",
      });
      return blob;
    } catch (e) {
      return null;
    }
  };

Date.prototype.toFullText = function(){
	var a = this.toLocaleDateString(navigator.language,{year:"numeric", month: "2-digit", day : "2-digit"});
	var b = this.toLocaleTimeString(navigator.language,{hour : "2-digit", minute: "2-digit", second : "2-digit"});
	

	a = a.replace(/\//g,"");
	b = b.replace(/:/g,"");
	if (b.length < 6) {
		b = "0" + b;
	}
	return a+b;
}
Date.prototype.toFormatText = function (ymd,hms) {
	var a = this.toLocaleDateString(navigator.language,{year:"numeric", month: "2-digit", day : "2-digit"});
	var b = this.toLocaleTimeString(navigator.language,{hour : "2-digit", minute: "2-digit", second : "2-digit"});
	var ret =  (ymd === true ? a : "");
	if (hms) {
		if (ymd) {
			ret += " " + b;
		}else{
			ret += b;
		}
	}
	return ret;
}
Date.prototype.toFormatFullText = function(){
	return this.toLocaleString(navigator.language,{year:"numeric", month: "2-digit", day : "2-digit", hour : "2-digit", minute: "2-digit", second : "2-digit"});
}
Date.prototype.diffDateTime = function () {
	//return (target.getTime() - this.getTime()) / (1000 * 60 * 60 * 24);
	var t = this.getTime();
	var now = new Date().getTime();
	var df = (now - t) / 1000;
	var ret = {
		time : 0,
		type : ""
	};
	if (df < 60) { //  < 60 seconds
		ret.time = 1;
		ret.type = "second"; 
	}else if (df < 3600) { // < 60 minutes
		ret.time = df / 60;
		ret.type = "minute";
	}else if (df < 86400) { // < 24 hours
		ret.time = df / 3600;
		ret.type = "hour";
	}else if (df < 2764800) { // < N days
		ret.time = df / 86400;
		ret.type = "day";
	}else{ // default: < N days
		ret.time = df / 86400;
		ret.type = "day";
	}
	return ret;
}
Date.prototype.diffTime = function (target) {
	return (target.getTime() - this.getTime()) / (1000 * 60 * 60);
}
/**
 * 
 * @param {Object} obj 
 * @returns non-reactived clean object
 */
JSON["original"] = function(obj) {
	return JSON.parse(JSON.stringify(obj));
}
/**
 * check wheather val is during min and max
 * @param {Number} min 
 * @param {Number} val 
 * @param {Number} max 
 * @return {Boolean} true / false
 */
function checkRange(min,val,max){
	if ((min <= val) && (val <= max)) {
		return true;
	}
	return false;
}
function fullRound(value, base) {
    return Math.round(value * base) / base;
}

function fullCeil(value, base) {
    return Math.ceil(value * base) / base;
}

function fullFloor(value, base) {
    return Math.floor(value * base) / base;
}

const AppDB = {
	app : null,
	saved : null,
	capture : null,
	temp : null,
	materials : null,
	logs : null,
	loglst : [],

	pose : null,
	motion : null,
	scene_meta : null,
	scene : null,

	avatar_meta : null,
	vrm : null,
	obj : null,
	image : null,
	uimage : null,
	initialize() {
		//---mylocal db
		this.app = localforage.createInstance({
            name: "mylocal",
            driver: localforage.INDEXEDDB,
            storeName: "appconf"
        });
		this.saved = localforage.createInstance({
            name: "mylocal",
            driver: localforage.INDEXEDDB,
            storeName: "savedfiles"
        });
		this.capture = localforage.createInstance({
            name : "mylocal",
            driver : localforage.INDEXEDDB,
            storeName : "capture"
        });
		this.temp = localforage.createInstance({
            name : "mylocal",
            driver : localforage.INDEXEDDB,
            storeName : "temp"
        });
		this.materials = localforage.createInstance({
            name : "mylocal",
            driver : localforage.INDEXEDDB,
            storeName : "materials"
        });
		this.logs = localforage.createInstance({
            name : "mylocal",
            driver : localforage.INDEXEDDB,
            storeName : "logs"
        });

		//---origfile db
        this.pose = localforage.createInstance({
            name : "origfile",
            driver : localforage.INDEXEDDB,
            storeName : "pose"
        });
		this.motion = localforage.createInstance({
            name : "origfile",
            driver : localforage.INDEXEDDB,
            storeName : "motion"
        });
		this.scene_meta = localforage.createInstance({
            name : "origfile",
            driver : localforage.INDEXEDDB,
            storeName : "scene_meta"
        });
		/**
		 * Save-data is JSON data.
		 */
        this.scene = localforage.createInstance({
            name : "origfile",
            driver : localforage.INDEXEDDB,
            storeName : "scene"
        });

		//---history db
		this.avatar_meta = localforage.createInstance({
            name : "history",
            driver : localforage.INDEXEDDB,
            storeName : "avatar_meta"
        });
		/**
		 * Save-data is FileSystemFileHandle
		 */
		this.vrm = localforage.createInstance({
            name : "history",
            driver : localforage.INDEXEDDB,
            storeName : "vrm"
        });
		this.obj = localforage.createInstance({
            name : "history",
            driver : localforage.INDEXEDDB,
            storeName : "obj"
        });
		this.image = localforage.createInstance({
            name : "history",
            driver : localforage.INDEXEDDB,
            storeName : "image"
        });
		this.uimage = localforage.createInstance({
            name : "history",
            driver : localforage.INDEXEDDB,
            storeName : "uimage"
        });

	},
	clearAll() {
		this.temp.clear();
		this.loglst.splice(0, this.loglst.length);
	},
	clearHistory() {
		this.avatar_meta.clear();
		this.vrm.clear();
		this.obj.clear();
		this.image.clear();
		this.uimage.clear();
	},
	writeLog(pgm,logtype,contents) {
		this.loglst.push(
		{
			timestamp : new Date().valueOf(),
			pgm,logtype,contents
		});
	},
	async readLog(start,end) {
		var ret = this.loglst.find(item  => {
			if (checkRange(start.valueOf(),item.timestamp,end.valueOf())) return true;
			return false;
		});
		return ret;
	},
	saveLog() {
		this.logs.setItem(new Date().valueOf(), {
			pgm,logtype,contents
		});
	}
};


/**
 * Cover object for browser localStorage / UWP current.localSettings
 */
const AppStorage = {
    apptype: "",
	filename: "monm.db",
	islocal : true,
    data: {},
    isEnable: function () {
        if (Windows.Storage.ApplicationData.current.localSettings) {
            return true;
        } else {
            return false;
        }
    },
    get: function (key, defaults) {
        var a;
        if (curLocale.environment.platform == "windowsapp") {
            a = Windows.Storage.ApplicationData.current.localSettings.values[key];
        } else {
			if (this.islocal) {
				a = localStorage.getItem(key);
			}else{
				a = sessionStorage.getItem(key);
			}
        }
        if (!a) {
            a = defaults;
        } else {
            a = JSON.parse(a);
        }
        return a;
    },
    set: function (key, value) {
        if (curLocale.environment.platform == "windowsapp") {
            Windows.Storage.ApplicationData.current.localSettings.values[key] = JSON.stringify(value);
        } else {
			if (this.islocal) {
				localStorage.setItem(key, JSON.stringify(value));
			}else{
				sessionStorage.setItem(key, JSON.stringify(value));
			}
        }
	},
	setText: function (key, value) {
        if (curLocale.environment.platform == "windowsapp") {
            Windows.Storage.ApplicationData.current.localSettings.values[key] = JSON.stringify(value);
        } else {
			if (this.islocal) {
				localStorage.setItem(key, (value));
			}else{
				sessionStorage.setItem(key, (value));
			}
        }
    },
    remove: function (key) {
        if (curLocale.environment.platform == "windowsapp") {
            Windows.Storage.ApplicationData.current.localSettings.values.remove(key);
        } else {
			if (this.islocal) {
				localStorage.removeItem(key);
			}else{
				sessionStorage.removeItem(key);
			}
        }
    },
    clear: function () {
        if (curLocale.environment.platform == "windowsapp") {
            Windows.Storage.ApplicationData.current.localSettings.values.clear();
        } else {
			if (this.islocal) {
				localStorage.clear();
			}else{
				sessionStorage.clear();
			}
        }
    },
    initialize: function (callback) {
        this.apptype = "storeapp";
        callback();
    },
    load: function () {
        var folder = Windows.Storage.ApplicationData.current.localFolder;
        folder.getFileAsync("tweem.ini")
		.then(function (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var text = reader.result;
               AppStorage.data = JSON.parse(text);
            }
            reader.onerror = function (e) {
               appAlert("not valid file!!");
            }
            reader.readAsText(file);
		}, function (data) {
            console.log("AppStorage.load: not found ini file.");
		});
    },
    save: function () {
        var folder = Windows.Storage.ApplicationData.current.localFolder;
        folder.getFileAsync(AppStorage.filename)
		.then(function (file) {
            Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(AppStorage.data));
		}, function (data) {
           folder.createFileAsync(AppStorage.filename)
			.then(function (file) {
                Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(AppStorage.data));
			});
		});

    }
};


/**
 * Multiple Utility Object
 */
var MUtility = {
	loadingON : function () {
		//vue_rigardo.elements.navbar.loading = true;
		//$("#jxLoader").jqxLoader("open");
	},
	loadingOFF : function () {
		//vue_rigardo.elements.navbar.loading = false;
		//$("#jxLoader").jqxLoader("close");
	},
	extractPathParams : function (search) {
		var params = search.split("&");
		var ret = {};
        for (var i = 0; i < params.length; i++) {
			var item = params[i].split("=");
			ret[item[0]] = item[1];
		}
		return ret;
	},
	copyClipboard : function (htmlcontent) {
		var a = ID("temporary_area");
		a.innerHTML = htmlcontent.replace(/class="invisible"/g,"");
		var selection = window.getSelection();
		var ran = document.createRange();
		ran.selectNodeContents(a);
		selection.removeAllRanges();
		selection.addRange(ran);

		document.execCommand("Copy");
		selection.removeAllRanges();
	},
	str2array : function(str) {
		return (new Uint16Array([].map.call(str, function(c) {
			return c.charCodeAt(0)
		}))).buffer;

	},
	/**
	 * convert from encoding to utf-8 encoding
	 * @param {ArrayBuffer} arrbuf source text buffer 
	 * @param {String} encoding from encoding
	 */
	strconvert : function(arrbuf,encoding) {
		var tb = new TextDecoder(encoding);
		return tb.decode(arrbuf);
	},
	strdetect : function (arrbuf) {
		var codes = new Uint8Array(arrbuf);
		return Encoding.detect(codes);
	},
	toHexaColor : function (colorstr) {
		var a =  colorstr.indexOf("#") > -1 ? colorstr : "#" + colorstr;
		return a;
	},
	/**
	 * generate NEARLY datetime from Mastodon toot ID 
	 * @param {String} id Mastodon's snowflake id
	 * @return {Date} nearly Date object
	 */
	id2timestamp : function (id) {
		var calc = parseInt(id) / 65536;
		return new Date(calc);
	},
	/**
	 * generate NEARLY Mastodon snowflake ID from Date
	 * @param {Date} date created date of the toot
	 * @return {String} nearly toot ID
	 */
	timestamp2id : function (date) {
		var calc = date.valueOf();
		return (calc * 65536).toString();
	},
	uniqID : function (myStrong){
		var strong = new Date().getTime();
		if (myStrong) strong = myStrong;
		var curdate = new Date();
		return (curdate.getTime() >> 12).toString(16)  + Math.floor(strong*Math.random()).toString(16)
	},
	humanreadableSize : function (size) {
		if (isNaN(parseFloat(size))) return "-";
		var kb = parseFloat(size) / 1024;
		var mb = kb / 1024;
		var gb = mb / 1024;
		var fgb = Math.round(gb);
		var fmb = Math.round(mb);
		var fkb = Math.round(kb);
		if (fgb == 0) {
			if (fmb == 0) {
				if (fkb == 0) {
					return size + " bytes";
				}else{
					return fkb + " KB";
				}
			}else{
				return fmb + " MB";
			}
		}else{
			return fgb + " GB";
		}
	}
};




AppDB.initialize();