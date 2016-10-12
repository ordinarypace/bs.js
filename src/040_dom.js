if(doc)(function(){
domGroup = function(el){
	var el0, group;
	if(group = el.bsG) return group;
	el.S = domS, el0 = el;
	do{if(group = el0.getAttribute(ns + 'group')) return el.bsG = group;
	}while((el0 = el0.parentNode) && el0.nodeType == 1);
	return el.bsG = '__root__';
},
bs.bsImmutable(
'getId', docId,
'size', (function(){
	var v = {}, ow, oh, w, h;
	if(W['outerWidth']){
		return function(){
			v.outerWidth = W.outerWidth,
			v.outerHeight = W.outerHeight,
			v.innerHeight = W.innerHeight;
			if(W.outerWidth - W.innerWidth < 40) v.innerWidth = W.innerWidth;
			else v.innerWidth = v.outerWidth - (detect.device == 'pc' && (docel.scrollHeight || (doc.body ? doc.body.scrollHeight : 0)) - (docel.offsetHeight || (doc.body ? doc.body.offsetHeight : 0)) ? 17 : 0) - 16;
			return v;
		};
	}else{
		ow = docel.offsetWidth, oh = docel.offsetHeight;
		W.resizeTo(500, 500),
		w = 500 - docel.offsetWidth, h = 500 - docel.offsetHeight, 
		W.resizeTo(w + ow, h + oh);
		return function(){
			v.outerWidth = docel.offsetWidth + w,
			v.outerHeight = docel.offsetHeight + h,
			v.innerWidth = docel.clientWidth || doc.body.clientWidth,
			v.innerHeight = docel.clientHeight || doc.body.clientHeight;
			return v;
		};
	}
})(),
'scroll', (function(){
	var v = {};
	return function(){
		v.left = docel.scrollLeft || W.pageXOffset || 0,
		v.top = docel.scrollTop || W.pageYOffset || 0,
		v.height = doc.body.scrollHeight,
		v.width = doc.body.scrollWidth;
		return v;
	};
})(),
'marker', function(v){
	var r = doc.getElementsByTagName('b'), el, els, i, j;
	for(els = [], i = 0, j = r.length; i < j; i++){
		if(!v || r[i].getAttribute('data-marker') == v){
			els[els.length] = {
				key:v,
				el:r[i].nextElementSibling, 
				data:r[i].getAttribute('data-data')
			};
		}
	}
	return els;
},
'domS', domS = (function(){
	var html, del, insertBefore, util, x, y;
	del = function(el){
		if(el.parentNode){
			el.parentNode.removeChild(el);
			if('outerHTML' in el && el.parentNode) el.outerHTML = '';
		}
	},
	html = (function(){
		var div = doc.createElement('div'), tbody = doc.createElement('tbody'),
		tags = {
			tr:[1, '<table><tbody>', '</tbody></table>'], th:[2, '<table><tbody><tr>', '</tr></tbody></table>'],
			col:[1, '<table><tbody></tbody><colgroup>', '</colgroup></table>'], option:[0, '<select>', '</select>']
		}, t0, i;
		tags.td = tags.th, tags.optgroup = tags.option,
		t0 = 'thead,tfoot,tbody,caption,colgroup'.split(','), i = t0.length;
		while(i--) tags[t0[i]] = [0,'<table>','</table>'];
		return function(str, target, mode){
			var t0, t1, t2, t3, i, j, n0, n1, n2, parent, tbodyStr;
			str += '',
			tbodyStr = str.toLowerCase().indexOf('tbody') > -1 ? true : false,
			t0 = str.trim(), n0 = t0.indexOf(' '), n1 = t0.indexOf('>'), n2 = t0.indexOf('/'),
			t1 = (n0 != -1 && n0 < n1) ? t0.substring(1, n0) : (n2 != -1 && n2 < n1) ? t0.substring(1, n2) : t0.substring(1, n1),
			t1 = t1.toLowerCase();
			if(mode == 'html' && target.nodeName.toLowerCase() == 'table' && t1 == 'tr') tbodyStr = true, t1 = 'tbody';
			if(mode == '>' || 'html+' && t1 == 'tr' && target) target = target.getElementsByTagName('tbody')[0] || (target.appendChild(tbody), target.getElementsByTagName('tbody')[0]);
			if(tags[t1]){
				if(div.innerHTML) del(div.childNodes);
				div.innerHTML = tags[t1][1] + str + tags[t1][2], t2 = div.childNodes[0];
				if(tags[t1][0]) for(i = 0 ; i < tags[t1][0] ; i++) t2 = t2.childNodes[0];
				parent = t2;
			}else div.innerHTML = str, parent = div;
			i = parent.childNodes.length;
			if(!target) return parent.childNodes;
			else if(mode == 'html'){
				if(target.innerHTML) del(target.childNodes);
				while(i--) target.appendChild(parent.childNodes[0]);
			}else if(mode == 'html+') while(i--) target.appendChild(parent.childNodes[0]);
			else if(mode == '+html') {
				i = target.childNodes.length, t0 = {length:i};
				while(i--) t0[i] = target.childNodes[i];
				for(i = 0, j = parent.childNodes.length ; i < j ; i++) target.appendChild(parent.childNodes[0]);
				for(i = 0, j = t0.length ; i < j ; i++) target.appendChild(t0[i]);
			}
			else while(i--) target.appendChild(parent.childNodes[0]);
			j = target.childNodes.length;
			while(j--) if(target.childNodes[j].nodeType == 1 && target.childNodes[j].nodeName == 'TBODY' && !target.childNodes[j].childNodes.length && !tbodyStr) target.removeChild(target.childNodes[j]);
			return target.innerHTML || target;
		};
	})(),
	insertBefore = function(parent, child, n){
		var t0, cnt, i, j;
		for(t0 = parent.childNodes, cnt = i = 0, j = t0.length; i < j; i++){
			if(t0[i].nodeType == 1){
				if(cnt == n){
					parent.insertBefore(t0[i], child);
					break;
				}
				cnt++;
			}
		}
	},
	util = {
		'@':(function(){
			var key = {};
			return function(el, k, v){
				k = k.substr(1);
				if(v === undefined) return el[k] || (k != 'value' && el.getAttribute(k)) || null;
				if(v === null){
					el.removeAttribute(k);
					try{delete el[k];}catch(e){};
				}else if(el) el[k] = v, el.setAttribute(k, v);
				return v;
			};
		})(),
		'*':function(el, k, v){
			k = 'data-' + k.substr(1);
			if(v === undefined) return el.getAttribute(k);
			if(v === null) el.removeAttribute(k);
			else el.setAttribute(k, v);
			return v;
		},
		'_':(function(){
			var view = doc.defaultView;
			return view && view.getComputedStyle ? function(el, k){
				return view.getComputedStyle(el, '').getPropertyValue(k.substr(1));
			} : function(el, k){
				return el.currentStyle[Style.key(k.substr(1))];
			};
		})(),
		'<':function(el, k, v){
			var t0, cnt, i, j;
			if(v === undefined) return el.parentNode;
			if(v === null) del(el);
			else{
				if(v.nodeType != 1) return;
				if((k = k.substr(1)) && k.isNumber()) insertBefore(v, el, parseInt(k, 10));
				else v.appendChild(el);
			}
		},
		'>':(function(){
			var children, nodes = [], r = /^[0-9]+$/;
			children = doc.createElement('div').children ? function(el){
				return el.children;
			} : function(el){
				var result = {length:0}, i, j;
				for(el = el.childNodes, i = 0, j = el.length; i < j; i++){
					if(el[i].nodeType == 1) result[result.length++] = el[i];
				}
				return result;
			}
			return function(el, k, v){
				var t0, t1, i, j;
				k = k.substr(1);
				if(v === undefined){
					t0 = children(el);
					if(k == '$') return t0[t0.length - 1];
					else if(k.isNumber()) return t0[k];
					else if(k){
						return el.querySelectorAll(k);
					}
					return t0;
				}
				if(v === null){
					if(k.isNumber()) del(children(el)[k]);
					else{
						t0 = el.childNodes, i = t0.length;
						while(i--) del(t0[i]);
					}
				}else if(v = typeof v == STR ? html(sel) : v.nodeType == 1 || v.nodeType == 11 ? v : 0){
					if(k.isNumber()) insertBefore(el, v, parseInt(k, 10));
					else el.appendChild(v);
				}else if(ev.nodeName == 'TABLE' && typeof v == STR) return html(v, el, '>');
			};
		})(),
		pageX:x = function(el){var i = 0; do i += el.offsetLeft; while(el = el.offsetParent); return i;},
		pageY:y = function(el){var i = 0; do i += el.offsetTop; while(el = el.offsetParent); return i;},
		clientX:function(el){return x(el) - x(el.parentNode);},
		clientY:function(el){return y(el) - y(el.parentNode);},
		submit:function(el){el.submit();},
		focus:function(el){el.focus();},
		blur:function(el){el.blur();},
		group:function(el){
			do{
				if(el[ns + 'group']) return el;
			}while(el = el.parentNode)
			return doc.body;
		},
		html:function(el, k, v){return v === undefined ? el.innerHTML : el.innerHTML = v;},//html(v, el, 'html');
		'html+':function(el, k, v){return html(v, el, 'html+');},
		'+html':function(el, k, v){return html(v, el, '+html');},
		'class':function(el, k, v){return v === undefined ? el.className : (el.className = v);},
		'class+':function(el, k, v){
			var i;
			return !(i = el.className.trim()) ? (el.className = v) : i.split(' ').indexOf(v) == NONE ? (el.className = v + ' ' + i) : i;
		},
		'class-':function(el, k, v){
			var t0 = el.className.trim(), i;
			if(!t0) return;
			t0 = t0.split(' '); 
			if((i = t0.indexOf(v)) != NONE) t0.splice(i, 1);
			el.className = (t0 = t0.join(' ').trim()) ? t0 : '';
		},
		checked:function(el, k, v){
			if(v === undefined) return el.checked;
			el.checked = v ? true : null;
		},
		selected:function(el, k, v){
			if(v === undefined) return el.selected;
			el.selected = v ? true : null;
		}
	};
	return function(){
		var prefix, a = arguments, i = 0, j = a.length, k, v, f, info, self;
		if(a[0] === null) return del(this);
		if(a[0].nodeType == 1) self = a[0], i = 1;
		else self = this;
		if(a[i] instanceof Array || a[i].isArguments()) a = a[i], i = 0, j = a.length;
		while(i < j){
			if(!attr[k = a[i++]]){
				if(k == 'this') attr[k] = THIS;
				else if(v = (util[k] || util[k.charAt(0)])) attr[k] = v;
				else Style.key(k);
			}
			f = attr[k];
			if(i == j) switch(f){
			case STYLE:return (self.bsStyle || (self.bsStyle = new Style(self.style))).g(k);
			case THIS:return self;
			default:return f != NONE ? f(self, k) : null;
			}
			v = a[i++];
			if(typeof v == STR){
				v = v.ex();
				if(v.isNumber()) v = parseFloat(v);
				if(v == 'null') v = null;
			}
			if(f == STYLE) (self.bsStyle || (self.bsStyle = new Style(self.style))).s(k, v);
			else if(f != NONE) f(self, k, v);
		}
		return v;
	};
})()
);
})();