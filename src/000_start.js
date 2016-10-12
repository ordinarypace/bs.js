(function(W){
"use strict"
var NONE = -1, STR = 'string', NUM = 'number', OBJ = 'object', FUN = 'function',
	ATTR = 1, UTIL = 2, STYLE = 3, EVENT = 4, THIS = 5,
	FAIL = {toString:function(){return 'bs.FAIL';}},
	doc = W.document, docel, body, head,
	docNew = function(v){
		var el = doc.createElement(v);
		el.S = domS;
		return el;
	},
	docId = (function(){
		var c = {};
		return function(id){
			var el;
			if(id.charAt(0) == '@') c[id = id.substr(1)] = null;
			if(el = c[id], !el) if(c[id] = el = doc.getElementById(id)) el.S = domS;
			return el;
		};
	})(),
	docTag = (function(){
		var c = {};
		return function(tag){
			return c[tag] || (c[tag] = doc.getElementsByTagName(tag));
		};
	})(),
	encode = encodeURIComponent, decode = decodeURIComponent,
	debug, err = (function(){
		var isDebug;
		debug = function(v){isDebug = v;};
		return function(){
			console.log(Array.prototype.join.call(arguments,','));
			if(isDebug) throw new Error(arguments.join(','));
			return FAIL;
		};
	})(),
	DATA = {app:{}, sys:{
		dom:{
			handler:{},
			attr:{}
		},
		sysEv:{}
	}},
	app = DATA.app, sys = DATA.sys, attr = sys.dom.attr, handler = sys.dom.handler, eOn, eOff,
	wkey, bs, ns = 'data-', templateData, render, renderUpdate,
	json, log, detect, 
	Style, Css, domS, domGroup;
	
if(doc) body = docNew('body'), head = docTag('head')[0], docel = doc.documentElement;
wkey = function(k, v){Object.defineProperty(W, k, {value:v});};
bs = function(v){
	var target, a, i, j, k, v, m, n, isCursor;
	if(v && typeof v == OBJ) for(i in v) app[i] = v[i];
	else{
		a = arguments, i = 0, j = a.length;
		while(i < j){
			k = a[i++].trim();
			if(k.charAt(0) == '.'){
				if(k = k.substr(1), !k) return templateData;
				if(k.indexOf('.') == NONE) return templateData[k];
				target = templateData, isCursor = 1;
			}else target = app;
			if(k.indexOf('.') != NONE){
				for(k = k.split('.'), m = 0, n = k.length - 1; m < n; m++){
					if(k[m] in target){
						v = target[k[m]];
						if(!v || typeof v != OBJ) return err('bs:0');
					}else target[k[m]] = v = {};
					target = v;
				}
				k = k[n];
			}
			if(isCursor || i == j) return target[k];
			v = a[i++];
			if(v === null) delete target[k];
			else target[k] = v;
		}
		return v;
	}
};