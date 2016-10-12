bs.bsImmutable('FAIL', FAIL);
(function(){
	var lock = {};
	bs.bsImmutable(
	'lock', function(){
		var a = arguments, i = a.length;
		while(i--) lock[a[i]] = 1;
	},
	'unlock', function(){
		var a = arguments, i = a.length;
		while(i--) lock[a[i]] = 0;
	},
	'isLock', function(){
		var a = arguments, i = a.length;
		while(i--) if(lock[a[i]]) return 1;
	},
	'locker', function(k, f, time){
		var t;
		if(time) t = function(){if(bs.isLock(k)) bs.unlock(k);};
		return function(){
			if(lock[k]) return;
			if(time) setTimeout(t, time);
			return lock[k] = 1, f.apply(this, arguments);
		};
	},
	'unlocker', function(k, f){
		return function(){
			if(!lock[k]) return;
			return lock[k] = 0, f.apply(this, arguments);
		};
	});
})();
bs.bsImmutable('white', (function(){
	var white, e = {},
		check = function(obj, vali, i){
			var v = obj[i];
			if(vali = vali && vali[i]) if(vali(v)) return v;
			if(typeof v == 'string') v = obj[i] = v.trim();
			return v ? 1 : (err('bsW:' + i), e);
		};
	return function(obj, vali){
		var i, j;
		if(!arguments.length) return white;
		if(obj instanceof Array){
			if(vali && !(vali instanceof Array)) return err('bsW:vali!=array', vali);
			for(i = 0, j = obj.length; i < j; i++) if(e === check(obj, vali, i)) return FAIL;
		}else for(i in obj) if(obj.hasOwnProperty(i)) if(e === check(obj, vali, i)) return FAIL;
		return white = obj;
	};
})());
bs.bsImmutable('log', log = (function(){
	var log, div, r = /[<]/g, d = new Date, init = function(){
		if(docId('bsConsole')) return;
		div = docNew('div');
		div.innerHTML = '<style>'+
		'#bsConsole{font-family:arial;position:fixed;z-index:999999;background:#fff;bottom:0;left:0;right:0;height:200px;overflow:hideen}'+
		'#bsConsoleTab{background:#999;height:20px;color:#fff}'+
		'#bsConsoleTabConsole,#bsConsoleTabElement{font-size:11px;margin:0 10px;line-height:20px;float:left}'+
		'#bsConsoleView{font-size:10px;overflow-y:scroll;height:180px}'+
		'#bsConsoleViewElement{word-break:break-all;word-wrap:break-word}'+
		'.bsConsoleItem{font-size:11px;border:1px solid #000;padding:5px;margin:0 5px;float:left}'+
		'.bsConsoleTime{font-size:10px;padding:5px}'+
		'</style>'+
		'<div id="bsConsole">'+
			'<div id="bsConsoleTab">'+
				'<div id="bsConsoleTabConsole">Console</div><div id="bsConsoleTabElement">Element</div>'+
			'</div>'+
			'<div id="bsConsoleView">'+
				'<div id="bsConsoleViewConsole"></div><div id="bsConsoleViewElement" style="display:none"></div>'+
			'</div>'+
		'</div>';
		doc.body.appendChild(div.firstChild),
		doc.body.appendChild(div.firstChild),
		docId('bsConsole').onclick = function(e){
			e = e.target;
			switch(e.id){
			case'bsConsoleTab':docId('bsConsole').style.height = docId('bsConsole').style.height == '200px' ? '20px' : '200px'; break;
			case'bsConsoleTabElement':
				docId('bsConsoleViewConsole').style.display = 'none';
				docId('bsConsoleViewElement').style.display = 'block';
				docId('bsConsoleViewElement').innerHTML = '<pre>' + 
					('<html>\n' + docTag('html')[0].innerHTML + '\n</html>').replace(r, '&lt;') + 
					'</pre>';
				break;
			case'bsConsoleTabConsole':
				doc.getElementById('bsConsoleViewConsole').style.display = 'block';
				doc.getElementById('bsConsoleViewElement').style.display = 'none';
			}
		};
	};
	log = function(){
		var a = arguments, i = 0, j = a.length, v, item = '<div style="clear:both"><div class="bsConsoleTime">' + (d.setTime(Date.now()), d.toJSON()) + '</div>';
		init();
		while(i < j){
			if((v = a[i++]) && typeof v == 'object') v = JSON.stringify(v); 
			item += '<div class="bsConsoleItem">' + v + '</div>';
		}
		div.innerHTML = item + '</div>';
		docId('bsConsoleViewConsole').appendChild(div.childNodes[0]);
	};
	if(!W['console']) W.console = {log:log};
	return log;
})());
bs.bsImmutable('namespace', function(v){ns = 'data-' + v + '-';}),
(function(){
    var mk = function(m){
			var t = {};
			return m = Math[m], function(r){return t[r] || t[r] === 0 ? 0 : (t[r] = m(r));};
		},
		rc = 0, rand = {};
    bs.bsImmutable(
	/*
	'rand', function(a, b){return parseInt((rand[rc = (++rc) % 7000] || (rand[rc] = Math.random())) * (b - a + 1)) + a;},
	'randf', function(a, b){return (rand[rc = (++rc) % 7000] || (rand[rc] = Math.random())) * (b - a) + a;},
	*/
	'rand', function(a, b){return parseInt(Math.random() * (b - a + 1)) + a;},
	'randf', function(a, b){return Math.random() * (b - a) + a;},
	'sin', mk('sin'), 'cos', mk('cos'), 'tan', mk('tan'), 'atan', mk('atan'),
	'toradian', Math.PI / 180, 'toangle', 180 / Math.PI
	);
})(),
(function(){
	var encode = encodeURIComponent, decode = decodeURIComponent, mk = function(target){
		var cache = {};
		return function(v){
			var query = v || location[target].substr(1), t0, t1, i, j;
			if(!query) return;
			if(!cache[query]){
				t0 = query.split('&'), i = t0.length, t1 = {};
				while(i--) t0[i] = t0[i].split('='), t1[decode(t0[i][0])] = decode(t0[i][1]);
				cache[query] = t1;
			}
			return cache[query];
		};
	};
	bs.bsImmutable(
	'encode', encode, 'decode', decode,
	'queryString', mk('search'),
	'hash', mk('hash'),
	'ck', function(key/*, val, expire, path*/){
		var t0, t1, t2, i, j, v;
		t0 = doc.cookie.split(';'), i = t0.length;
		if(arguments.length == 1){
			while(i--) if(t0[i].substring(0, j = t0[i].indexOf('=')).trim() == key) return decode(t0[i].substr(j + 1).trim());
			return null;
		}else{
			v = arguments[1], t1 = key + '=' + encode(v) + ';domain=' + doc.domain + ';path=' + (arguments[3] || '/');
			if(v === null) t0 = new Date, t0.setTime(t0.getTime() - 86400000), t1 += ';expires=' + t0.toUTCString();
			else if(arguments[2]) t0 = new Date, t0.setTime(t0.getTime() + arguments[2] * 86400000), t1 += ';expires=' + t0.toUTCString();
			return doc.cookie = t1, v;
		}
	});
})(),
bs.bsImmutable(
	'xml', (function(){
		var filter = function(v){
			if(typeof v == 'string'){
				if(v.substr(0, 20).indexOf('<![CDATA[') > -1) v = v.substring(0, 20).replace('<![CDATA[', '') + v.substr(20);
				if(v.substr(v.length - 5).indexOf(']]>') > -1) v = v.substring(0, v.length - 5) + v.substr(v.length - 5).replace(']]>', '');
				return v.trim();
			}else return '';
		}, text, stack = [], type,
		parse = W['DOMParser'] ? (function(){
			var worker = new DOMParser;
			text = 'textContent';
			type = 1;
			return function(v){return worker.parseFromString(v, "text/xml");};
		})() : (function(){
			var t0 = 'MSXML2.DOMDocument', i, j;
			text = 'text';
			t0 = ['Microsoft.XMLDOM', 'MSXML.DOMDocument', t0, t0+'.3.0', t0+'.4.0', t0+'.5.0', t0+'.6.0'], i = t0.length;
			while(i--){
				try{new ActiveXObject(j = t0[i]);}catch(e){continue;}
				break;
			}
			return function(v){
				var worker = new ActiveXObject(j);
				return worker.loadXML(v), worker;
			};
		})();
		return function(v, result){
			var node, attr, name, sub, prev, parent, i, j, k, l, n, m;
			if(!result || typeof result != 'object' || typeof result != 'function') result = {};
			stack.length = 0,
			v = {nodes:parse(filter(v)).childNodes,parent:result};
			do{
				for(i = 0, j = v.nodes.length; i < j; i++){
					sub = {}, node = type ? v.nodes[i] : v.nodes.nextNode(), name= node.nodeName,
					parent = v.parent;
					switch(node.nodeType){
					case 3:parent.value = node[text].trim(); break;
					case 4:parent.value = filter(node[text].trim()); break;
					case 1:
						if(attr = node.attributes){
							k = attr.length;
							while(k--) sub['$' + attr[k].name] = attr[k].value;
						}
						if(node.childNodes && (n = node.childNodes.length)) stack[stack.length] = {parent:sub, nodes:node.childNodes};
						if(prev = parent[name]){
							if(prev.length === undefined) parent[name] = {length:2, 0:prev, 1:sub};
							else parent[name][prev.length++] = sub;
						}else parent[name] = sub;
					}
				}
			}while(v = stack.pop())
			return result;
		};
	})()
),
(function(){
	var pool = {length:0}, lists = [], keys = {}, max = 100, uuid = 0, loop, ani, rate,
		stop = 1, pause = 0, inc = 0,
		PI = Math.PI, HPI = PI * .5, bio, a;
	rate = 0,
	ani = {
		linear:function(c,b){return a = rate, b*a+c},
		backIn:function(c,b){return a = rate, b*a*a*(2.70158*a-1.70158)+c},
		backOut:function(c,b){return a = rate - 1, b*(a*a*(2.70158*a+1.70158)+1)+c},
		backInOut:bio = function(c,b){
			a = rate * 2;
			if(1 > a) return .5*b*a*a*(3.5949095*a-2.5949095)+c;
			else return a -= 2, .5*b*(a*a*(3.70158*a+2.70158)+2)+c;
		},
		sineIn:function(c,b){return a = rate, -b*Math.cos(a*HPI)+b+c;},
		sineOut:function(c,b){return a = rate, b*Math.sin(a*HPI)+c;},
		sineInOut:function(c,b){return a = rate, .5*-b*(Math.cos(PI*a)-1)+c;},
		circleIn:function(c,b){return a = rate, -b*(Math.sqrt(1-a*a)-1)+c;},
		circleOut:function(c,b){return a = rate - 1, b*Math.sqrt(1-a*a)+c;},
		circleInOut:function(c,b){
			a = rate * 2;
			if(1>a) return .5*-b*(Math.sqrt(1-a*a)-1)+c;
			return a-=2, .5*b*(Math.sqrt(1-a*a)+1)+c;
		},
		quadraticIn:function(c,b){return a = rate, b*a*a+c;},
		quadraticOut:function(c,b){return a = rate, -b*a*(a-2)+c;},
		bounceOut:function(c,b){
			a = rate;
			if(0.363636 > a)return 7.5625*b*a*a+c;
			if(0.727272 > a) return a-=0.545454, b*(7.5625*a*a+0.75)+c;
			if(0.90909 > a) return a-=0.818181, b*(7.5625*a*a+0.9375)+c;
			return a-=0.95454, b*(7.5625*a*a+0.984375)+c;
		}
		//bounceIn:function(a,c,b,d,e){return b-bio((e-d)/e,0,b)+c},
		//bounceInOut:function(a,c,b,d,e){if(d<0.5*e)return d*=2,0.5*ease[13](d/e,0,b,d,e)+c;d=2*d-e;return 0.5*ease[14](d/e,0,b,d,e)+0.5*b+c},
	},
	loop = function(t){
		var f, r, i, j, k, isEnd, cnt, list;
		if(stop) return;
		if(!pause && (i = lists.length)){
			t += inc;
			while(i--){
				list = lists[i], cnt = 0, k = j = list.length;
				while(j--){
					if(f = list[j]){
						if(f.__start__ < t){
							isEnd = 0;
							if(f.__term__){
								r = (t - f.__start__) / f.__term__;
								r = r > 1 ? 1 : r < 0 ? 0 : r;
								if(f.__end__ < t){
									isEnd = 1;
								}
							}else r = 0;
							ani.rate = rate = r;
							if(f.update) f.update(t, ani);
							if(f.ANI(t, ani) || isEnd){
								f.__key__ = keys[f.__key__] = list[j] = 0, cnt++;
								if(f.end) f.end(t, ani);
							}
						}
					}else cnt++;
				}
				if(cnt == k) pool[pool.length++] = list, lists.splice(i, 1);
			}
		}
		requestAnimationFrame(loop);
	},
	bs.bsImmutable(
	'ani', function(key, f){
		var list, i, j;
		if(f){
			if(typeof f.ANI != FUN) return err('ani0');
			if(f.__key__) return err('ani1');
			if(key && keys[key]) return err('ani2');
			
			f.__key__ = key || uuid++,
			f.__start__ = (f.delay * 1000 || 0) + performance.now() + inc,
			f.__term__ = f.time ? f.time * 1000 : 0,
			f.__end__ =  f.__term__ ? (f.__start__ + f.__term__) : 0;
			
			if((i = lists.length) && (i = lists[i - 1]).length < max) list = i;
			else lists[lists.length] = list = pool.length ? pool[--pool.length] : {length:0};
			list[list.length++] = keys[key] = f;
			if(stop) stop = 0, requestAnimationFrame(loop);
		}else if(key && f === null){
			if(keys[key]){
				i = lists.length;
				out:
				while(i--){
					list = lists[i], j = list.length;
					while(j--) if(list[j].key == key){
						list[j] = 0;
						break out;
					}
				}
			}
		}
	},
	'stop', function(){
		var list, i, j, f;
		if(stop) return;
		stop = 1, inc = pause = 0, i = lists.length;
		while(i--){
			list = lists[i], j = list.length;
			while(j--) f = list[j], f.__key__ = keys[f.__key__] = list[j] = 0;
			list.length = 0, pool[pool.length++] = list;
		}
		lists.length = 0;
	},
	'pause', function(){
		if(pause) return;
		pause = performance.now();
	},
	'resume', function(){
		if(!pause) return;
		inc += performance.now() - pause;
		pause = 0;
	});
})(),
(function(){
	var root = 'scrollHeight' in body ? 0 : docel, scroll, prev;
	scroll = function(t, ani){
		var ease;
		ease = ani[this.ease],
		W.scrollTo(ease(this.sx, this.tx), ease(this.sy, this.ty));
	};
	bs.bsImmutable(
	'scrollTo', function(x, y, isPercent, time, ease, end){
		var a = arguments, i, j;
		if(!root && !(root = doc.body)) return;
		if(isPercent){
			x *= ((i = root.scrollWidth) > (j = root.clientWidth) ? i : j) * .01,
			y *= ((i = root.scrollHeight) > (j = root.clientHeight) ? i : j) * .01;
		}
		if(time){
			bs.ani('@scroll', null);
			a.ANI = scroll,
			a.end = end,
			a.x = x, a.y = y,
			a.sx = docel.scrollLeft || W.pageXOffset || 0,
			a.sy = docel.scrollTop || W.pageYOffset || 0,
			a.tx = x - a.sx, a.ty = y - a.sy,
			a.time = time,
			a.ease = ease || 'linear',
			bs.ani('@scroll', prev = a);
		}else W.scrollTo(x, y);
	});
})();
(function() {
	var c = doc.createElement('canvas'), ct;
	if(typeof c.getContext == 'function'){
		ct = c.getContext('2d');
		bs.bsImmutable(
		'img2src', function(img){
			var w = c.width = img.width, h = c.height = img.height;
			ct.drawImage(img, 0,0,w,h, 0,0,w,h);
			return c.toDataURL();
		});
	}
})();