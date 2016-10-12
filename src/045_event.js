bs.bsImmutable('systemEvent', function(){
	var a = arguments, i = 0, j = a.length, k, v, s;
	while(i < j) k = a[i++], v = a[i++], s = sys.sysEv[k] || (sys.sysEv[k] = []), s[s.length] = v, bs.on(k);
});
(function(){
var ev,	attach = {}, //IE 중복 리스너
	on = eOn = W['addEventListener'] ? function(el, type, listener){el.addEventListener(type, listener);} :
		W['attachEvent'] ? function(el, type, listener){
			var i, j, t0;
			if(!attach[type]) attach[type] = {el:[], li:[]};
			for(t0 = attach[type], i = 0, j = t0.el.length; i < j; i++) if(t0.el[i] == el && t0.li[i] == listener) return;
			t0.el.push(el), t0.li.push(listener), el.attachEvent('on' + type, listener);
		} : function(el, type, listener){el['on' + type] = listener;},
	off = eOff = W['removeEventListener'] ? function(el, type, listener){el.removeEventListener(type, listener);} :
		W['detachEvent'] ? function(el, type, listener){
			var i, j, t0;
			if(t0 = attach[type]){
				i = t0.el.length;
				while(i--) if(t0.el[i] == el && t0.li[i] == listener) t0.el.splice(i, 1), t0.li.splice(i, 1);
			}
			el.detachEvent('on' + type, listener);
		} : function(el, type, listener){el['on' + type] = null;},		
	e2v = {}, v2e = {}, scrollState = 0,
	delay = {touchmove:1, mousemove:1, resize:1},//, scroll:1},
	throttleEvent = (function(){
		var wrap = {}, E, etype = {}, mk = function(type){
				var f = function(t){handleEvent(f.e);};
				return f;
			};
		return function(e){
			var v, type = e.type;
			if(v = etype[type]) cancelAnimationFrame(v);
			v = wrap[type] || (wrap[type] = mk(type));
			v.e = e, etype[type] = requestAnimationFrame(v);
		};
	})(),
	bindTarget = (function(){
		var bind = {click:doc};
		return function(type){return bind[type] || ('on' + type in W ? W : 'on' + type in doc ? doc : 0);};
	})(),
	handleEvent = (function(){
		var cache = {}, ls = {},
			KEY = (function(){
				var t0 = {downed:{}, code2name:{}, name2code:{}},
					t1 = 'a,65,b,66,c,67,d,68,e,69,f,70,g,71,h,72,i,73,j,74,k,75,l,76,m,77,n,78,o,79,p,80,q,81,r,82,s,83,t,84,u,85,v,86,w,87,x,88,y,89,z,90,back,8,tab,9,enter,13,shift,16,control,17,alt,18,pause,19,caps,20,esc,27,space,32,pageup,33,pagedown,34,end,35,home,36,left,37,up,38,right,39,down,40,insert,45,delete,46,numlock,144,scrolllock,145,0,48,1,49,2,50,3,51,4,52,5,53,6,54,7,55,8,56,9,57'.split(','),
					i = 0, j = t1.length, k, v;
				while(i < j) t0.name2code[k = t1[i++]] = v = parseInt(t1[i++]), t0.code2name[v] = k;
				return t0;
			})(), keyName = KEY.code2name, keyCode = KEY.name2code,
			posCat = {
				down:detect.device =='pc' ? 4 : 1, move:detect.device =='pc' ? 5 : 2, up:detect.device =='pc' ? 6 : 3,
				touchstart:1, touchmove:2, touchend:3, 
				mousedown:4, mousemove:5, mouseup:6, click:6, mouseover:6, mouseout:6
			};
		bs.bsImmutable('KEY', KEY);
		ev = {__pos__:0};
		ev.bsImmutable(
			'wheelDelta', function(){
				var e = this.event, d = e.detail, w = e['wheelDelta'] ? e.wheelDelta : -e.deltaY * 20, n = 225, n1 = n - 1;
				d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120;
				d = d < 1 ? d < -1 ? (-d * d - n1) / n : d : (d * d + n1) / n / 2;
				if( d < -1 ) d = -1;
				else if( d > 1 ) d = 1;
				return d;
			},
			'data', function(k, v){
				if(v === null) return this.target.removeAttribute('data-'+k);
				if(v !== undefined) this.target.setAttribute('data-'+k, v);
				return this.target.getAttribute('data-'+k);
			},
			'key', function(k){
				var e = this.event;
				switch(k){
				case'ctrl':return e.metaKey || e.ctrlKey;
				case'shift':return e.shiftKey;
				case'button':return e.button;
				default:return this.keyCode == keyCode[k];
				}
			},
			'isLeave', function(){
				var pos = this.pos(), el;
				if(arguments.length) pos = pos.touches[arguments[0]];
				if(this.target.scrollState != scrollState + '') return true;
				if(pos.distanceX < -5 || pos.distanceX > 5 || pos.distanceY < -5 || pos.distanceY > 5) return true;
				if(el = doc.elementFromPoint(pos.pageX - (docel.scrollLeft || W.pageXOffset || 0), pos.pageY - (docel.scrollTop || W.pageYOffset || 0))){
					do{if(this.target == el) return false;
					}while(el = el.parentNode)
					return true;
				}
				return true;
			},
			'group', (function(){
				var stack = {length:0}, groups = {'__root__':{el:doc.body, find:{}, keys:{}}},
					init = function(){
						var t = ev.groupTarget, i, j, k;
						if(t.__group__) return t.__group__;
						i = t; 
						do{if(i.attributes[ns + 'group']) return t.__group__ = {el:(i.S = domS, i), find:{}, keys:{}};
						}while((i = i.parentNode) && i.nodeType == 1);
						return t.__group__ = groups.__root__;
					};
				return {}.bsImmutable(
					'el',function(){return init().el;},
					'S', function(){return domS(init().el, arguments);},
					'info', function(){return init().el.bsGroup || {};},
					'record', function(){return init().el.bsGroup.record || {};},
					'data', function(k, v){
						var el = init().el;
						if(v === null) return el.removeAttribute('data-'+k);
						if(v !== undefined) el.setAttribute('data-'+k, v);
						return el.getAttribute('data-'+k);
					},
					'key', function(key){
						var group = init(), k = group.name + ':' + key, r, keys = group.keys;
						if(r = keys[k], !r) keys[k] = r = this.find('key', key);
						return r;
					},
					'find', function(k){
						var group, el, i, v, v0, t0;
						group = init(), i = k.charAt(0) == '@' ? (k = k.substr(1), 1) : 0, v = arguments[1];
						if(!i && (el = group.find[k+':'+v])) return el;
						el = group.el.firstElementChild, i = stack.length = 0;
						do{
							if(!el.attributes[ns + 'group']){
								if((v0 = el.getAttribute(ns + k)) && !v || v0 == v) return el.S = domS, group.find[k+':'+v] = el;
								if(t0 = el.firstElementChild) stack[stack.length++] = t0;
							}
							if(t0 = el.nextElementSibling) stack[stack.length++] = t0;
						}while(stack.length && (el = stack[--stack.length]))
						return null;
					},
					'parent', function(){
						ev.groupTarget = init().el.parentNode;
						return this;
					},
					'prev', function(){
						ev.groupTarget = init().el.previousSibling;
						return this;
					},
					'next', function(){
						ev.groupTarget = init().el.nextSibling;
						return this;
					},
					'child', function(k){
						var v, el = init().el.firstElementChild, i;
						stack.length = 0;
						do{
							if((k == (v = el.getAttribute(ns + 'group')))){
								ev.__group__ = 0, ev.groupTarget = el;
								return this;
							}
							if(v = el.firstElementChild) stack[stack.length++] = v;
							if(i){
								if(v = el.nextElementSibling) stack[stack.length++] = v;
							}else i = 1;
						}while(stack.length && (el = stack[--stack.length]))
						return null;
					}
				);
			})(),
			'pos', (function(){
				var client, pos, pageX, pageY;
				client = function(k, prop, off, scr){
					return function(v){
						var rect;
						if(this.length){//터치일때
							if(!v) v = 0;
							rect = this.touches[v].target.getBoundingClientRect();
							this.touches[v][k] - rect[prop] - (W[off] || docel[scr] || 0);
						}else{
							rect = ev.target.getBoundingClientRect();
							return ev.event[k] - rect[prop] - (W[off] || docel[scr] || 0);
						}
					};
				},
				pos = {},
				pos.bsImmutable(
					'touches', [],
					'clientX', client('clientX', 'left', 'pageXOffset', 'scrollLeft'),
					'clientY', client('clientY', 'top', 'pageYOffset', 'scrollTop')
				);
				if(detect.browser != 'ie' || detect.browserVer > 8) pageX = 'pageX', pageY = 'pageY';
				else pageX = 'clientX', pageY = 'clientY';
				return function(){
					var type, e, X, Y, id, t0, t1, t2, i, j, k, m;
					if(this.__pos__) return pos;
					this.__pos__ = 1;
					if(type = posCat[this.type] || posCat[v2e[this.type]]){
						e = this.event, t0 = pos.touches, t0.length = 0;
						if(type < 4){
							t1 = '', i = 2;
							while(i--){
								t2 = i ? e.changedTouches : e.touches, j = t2.length;
								while(j--){
									id = t2[j].identifier, t1 += id + ' ', m = t0.length, k = 1;
									while(m--) if(t0[m].identifier == id){
										k = 0;
										break;
									}
									if(k) t0[t0.length] = t2[j];
								}
							}
							i = t0.length;
							while(i--){
								if(t1.indexOf(t0[i].identifier) == NONE) t0.splice(i, 1);
								else{
									t1 = t0[i], X = t1.pageX, Y = t1.pageY;
									if(type == 1) t1.startX = X, t1.startY = Y;
									else{
										t1.distanceX = X - t1.startX, t1.distanceY = Y - t1.startY,
										t1.moveX = X - t1.oldX, t1.moveY = Y - t1.oldY;
									}
									t1.oldX = X, t1.oldX = Y;
								}
							}
							if(t1 = t0[0]){
								pos.pageX = t1.pageX, pos.pageY = t1.pageY,
								pos.distanceX = t1.distanceX, pos.distanceY = t1.distanceY,
								pos.moveX = t1.moveX, pos.moveY = t1.moveY;
							}
						}else{
							pos.pageX = X = e[pageX], pos.pageY = Y = e[pageY];
							if(type == 4) pos.startX = X, pos.startY = Y;
							else{
								pos.distanceX = X - pos.startX, pos.distanceY = Y - pos.startY,
								pos.moveX = X - pos.oldX, pos.moveY = Y - pos.oldY;
							}
							pos.oldX = X, pos.oldY = Y;
						}
						if(type == 1 || type == 4) this.target.scrollState = scrollState;
					}
					return pos;
				};
			})()
		);
		return function(e){
			var type0, type, el, a, i, j, k;
			if(!e) e = event;
			el = e.target || e.srcElement, type = e.type;
			if(!el) return console.log('no e.target,e.srcElement');
			if(el == W || el === doc){
				if(k = sys.sysEv[type]){
					ev.event = e, ev.target = el, ev.type = type;
					for(i = 0, j = k.length; i < j; i++) if(k[i].call(W, ev)) break;
				}
			}else do{
				a = el.attributes, type0 = 0;//이벤트에 해당되는 키확인(가상키포함) : data-click, data-down(가상)
				if(k = a[ns + type] || (type0 = e2v[type]) && a[ns + type0]){
					ev.event = e, ev.type = type, ev.keyName = keyName[ev.keyCode = e.keyCode];
					ev.groupTarget = ev.target = el, ev.__group__ = domGroup(el), ev.__pos__ = 0;
					if(posCat[type] == 1 || posCat[type] == 4) ev.pos();
					k = k.value;
					if(k = ls[k] || (ls[k] = bs(k))) k.call(el, ev);
					return;
				}
				if(a[ns + 'group']) return;
			}while((el = el.parentNode) && el.nodeType == 1);
		};
	})();
bs.bsImmutable(
'dom2e', function(el, type){
	if(typeof el == 'string') el = bs.getId(el);
	ev.groupTarget = ev.target = el,
	ev.type = type,
	ev.__group__ = domGroup(el),
	ev.__pos__ = 0;
	return ev;
},
'on', function(){
	var a = arguments, i = a.length, k, type;
	while(i--){
		type = a[i], type = v2e[type] || type;
		if(typeof type == FUN) type(1);
		else if(k = bindTarget(type)) on(k, type, delay[a[i]] ? throttleEvent : handleEvent);
	}
},
'off', function(){
	var a = arguments, i = a.length, k, type;
	while(i--){
		type = a[i], type = v2e[type] || type;
		if(typeof type == FUN) type();
		if(k = bindTarget(type)) off(k, type, delay[a[i]] ? throttleEvent : handleEvent);
	}
}),
(function(){
	var downed = bs.KEY.downed, code2name = bs.KEY.code2name;
	bs.systemEvent(
		'keydown', function(e){downed[code2name[e.keyCode]] = 1;},
		'keyup', function(e){downed[code2name[e.keyCode]] = 0;}
	);
	bs.on('keydown', 'keyup');
})(),
(function(){
	var f = function(){
			var a = arguments, i = 0, j = a.length, k, v;
			while(i < j) k = a[i++], v = a[i++], v2e[k] = v, e2v[v] = k;
		};
	if(detect.device =='pc') f('down', 'mousedown', 'up', 'mouseup', 'move', 'mousemove', 'over', 'mouseover', 'out', 'mouseout');
	else f('down', 'touchstart', 'up', 'touchend', 'move', 'touchmove', 'over', 'mouseover', 'out', 'mouseout');
	f('wheel', 'DOMMouseScroll' in body ? 'DOMMouseScroll' : 'onwheel' in body ? 'wheel' : 'mousewheel');
})();
if(!W['onorientationchange']) (function(){
	var listener = function(e){handleEvent(E);}, E = {target:W, type:'orientationchange'};
	v2e['orientationchange'] = function(isOn){(isOn ? on : off)(W, 'resize', listener);};
})();
if(!W['onhashchange']) v2e['hashchange'] = (function(){
	var on, old, E = {target:W, type:'hashchange'},
		f = function(){
			if(!on) return;
			if(old != location.hash) old = location.hash, handleEvent(E);
			requestAnimationFrame(f);
		};
	return function(isOn){if(on = isOn) old = location.hash, requestAnimationFrame(f);};
})();
if(!('onscroll' in W)) v2e['scroll'] = (function(){
	var on, oldX, oldY, E = {target:W, type:'hashchange'},
		f = function(){
			var x, y;
			if(!on) return;
			x = W.pageXOffset || docel.scrollLeft || 0, y = W.pageYOffset || docel.scrollTop || 0;
			if(oldX != x || oldY != y) oldX = x, oldY = y, handleEvent(E);
			requestAnimationFrame(f);
		};
	return function(isOn){if(on = isOn) oldX = W.pageXOffset || docel.scrollLeft|| 0, oldY = W.pageYOffset || docel.scrollTop || 0, requestAnimationFrame(f);};
})();
bs.systemEvent('scroll', function(e){scrollState++;});
})();