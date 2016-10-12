bs.css('.tmpl,.bsMarker[' + ns + 'tmpl]{display:none}'),
bs.bsImmutable(
'render', (function(){
	var TMPL = {}, frag, elLoop, param, update, currData, Tmpl, T = 'top,body,bottom'.split(',');
	frag = (function(){
		var pool = [];
		return function(){
			if(arguments.length) pool.push(arguments[0]);
			else return pool.length ? pool.pop() : doc.createDocumentFragment();
		};
	})();
	elLoop = function(el, f, arg){
		var stack = {length:0}, k;
		do{
			if(k = el.firstElementChild) stack[stack.length++] = k;
			if(k = el.nextElementSibling) stack[stack.length++] = k;
			f(el, arg);
		}while(stack.length && (el = stack[--stack.length]));
	};
	currData = (function(){
		var stack = [], c = 'INFO,LIST,SUP,INDEX,@hash,clone'.split(','), clone = function(){
			var a = arguments, i, obj;
			if(a.length){
				i = a.length, obj = {};
				while(i--) obj[a[i]] = this[a[i]];
			}else{
				i = c.length, obj = Object.assign({}, this);
				while(i--) delete obj[c[i]];
			}
			return obj;
		}, toJSON = function(){
			var r = Object.assign({}, this), k;
			k = c.length;
			while(k--) delete r[c[k]];
			return r;
		};
		return function(prevData, curr, i){
			var s = curr[i], k, l;
			if(!s) return;
			templateData = s;/*
			stack.length = 0, stack[0] = templateData = s;
			do{
				if(s && typeof s == 'object'){
					k = c.length;
					while(k--) delete s[c[k]];
					if(s.splice){
						for(k = 0, l = s.length; k < l; k++) if(s[k] && typeof s[k] == 'object') stack[stack.length] = s[k];
					}else{
						for(k in s) if(s[k] && typeof s[k] == 'object' && s.hasOwnProperty(k)) stack[stack.length] = s[k];
					}
				}
			}while(s = stack.pop());*/
			templateData['@hash'] = k = JSON.stringify(templateData);
			templateData.INDEX = i;
			templateData.INFO = curr[0].INFO, templateData.LIST = curr, templateData.SUP = prevData;
			templateData.clone = clone;
			templateData.toJSON = toJSON;
			return k;
		};
	})();
	param = (function(){
		var defaultvm = function(m){return m;},
			stack = [], uuid,
			r0 = /\[@.$]{[^}]+\}/g, r1 = /~([0-9]+)~/g,
			rf0 = function(_){return stack[uuid] = _, '~' + (uuid++) + '~';},
			rf1 = function(_, v){return stack[v];},
			mkBS = function(k){return function(){return bs(k);};},
			mk$ = function(k){return function(){return (new Function('bs', 'return (' + k + ');'))(bs);};},
			param = [],
			primitive = {'true':true, 'false':false, 'null':null};
		return function(el){
			var p, v, i, j, k;
			if(p = el.bsParam, p === undefined){
				p = el.getAttribute(ns + 's');
				if(p) el.removeAttribute(ns + 's'), p = p.split(',');
				if(v = el.getAttribute(ns + 'vm')){
					el.removeAttribute(ns + 'vm');
					if(!p) p = {};
					if(p.view = el.getAttribute(ns + 'view')) el.removeAttribute(ns + 'view');
					else return err('param', 'view');
					i = v.indexOf('(');
					if(i == NONE) p.vm = defaultvm, k = v.indexOf('{') == NONE ? '@{' + v + '}' : v;
					else{
						p.vm = bs(v.substring(0, i));
						k = v.substring(i + 1, v.length - 1).trim();
					}
					if(k){
						stack.length = uuid = 0;
						k = k.replace(r0, rf0).split(','), i = k.length;
						while(i--){
							j = k[i];
							if(j.indexOf('~') != NONE) j = j.replace(r1, rf1);
							switch(j.substr(0, 2)){
							case'.{':k[i] = mkBS('.' + j.substring(2, j.length - 1));break;
							case'@{':k[i] = mkBS(j.substring(2, j.length - 1));break;
							case'${':k[i] = mk$(j.substring(2, j.length - 1));break;
							default:
								if(j in primitive) k[i] = primitive[j];
								else if(j.isNumber()) k[i] = parseFloat(j);
								else if(
									(j.charAt(0) == '[' && j.charAt(j.length - 1) == ']') ||
									(j.charAt(0) == '{' && j.charAt(j.length - 1) == '}')
								) k[i] = JSON.parse(j);
							}
						}
						p.m = function(){
							var i = k.length;
							param.length = 0;
							while(i--) param[i] = typeof k[i] == 'function' ? k[i]() : k[i];
							return param;
						};
					}
				}
				el.bsParam = p || false;
			}
			return p;
		};
	})();
	update = renderUpdate = function(el, param, isNew){
		var tmpl, prevData, curr, prev, hash, p, el0, el1, i, j;
		if(param.length) domS(el, param);
		if(param.vm){
			if(param.view != '*') tmpl = TMPL[param.view];
			if(prev = el.bsPrevData || 0, !prev) el.innerHTML = '';
			curr = param.vm.apply(null, param.m ? param.m() : null);
			if(!(curr instanceof Array)) curr = [curr];
			prevData = templateData;
			templateData = curr;
			if(tmpl) tmpl.update(el, curr, prevData, prev, isNew);
			else{
				for(i = curr[0] && curr[0].INFO ? 1 : 0, j = curr.length; i < j; i++){
					hash = currData(prevData, curr, i);
					el0 = TMPL[templateData['@tmpl']].body.pop();
					if(p = prev[i], !p) el.appendChild(el0);
					else if(p != hash){
						el1 = el.children[i];
						el1.bsTMPL.drain(el1);
						el.insertBefore(el0, el1);
						el.removeChild(el1);
					}
				}
				if(i < prev.length){
					el0 = el.children[i];
					do{
						el1 = el0.nextSibling;
						el0.bsTMPL.drain(el0);
						el.removeChild(el0);	
					}while(el0 = el1);
				}
			}
			if(j = el.bsPrevData, !j) el.bsPrevData = j = [];
			j.length = i = curr.length;
			while(i--) j[i] = curr[i]['@hash'];
			templateData = prevData;
		}
	};
	Tmpl = (function(){
		var Idom, Role;
		Idom = (function(){
			var Idom = function(el, param){
					var idx, prev;
					this.param = param;
					this.length = 0, this.id = Symb();
					while(el.parentNode && el.parentNode.nodeType == 1){
						idx = 0, prev = el;
						while(prev = prev.previousSibling) idx++;
						this[this.length++] = idx;
						el = el.parentNode;
					}
				}, fn = Idom.prototype;
			fn.render = function(el){
				var id = this.id, r = el.bsIdoms, el0, i;
				if(!r) el.bsIdoms = r = {};
				if(el0 = r[id], !el0){
					el0 = el, i = this.length;
					while(i-- && el0) el0 = el0.childNodes[this[i]];
					r[id] = el0;
				}
				el0.bsParam = this.param;
				update(el0, this.param);
			};
			return Idom;
		})();
		Role = (function(){
			var loop = function(el, els){
					var p = param(el);
					if(p) els.push(new Idom(el, p));
				},
				Role = function(tmpl, role, root, drop){
					this.tmpl = tmpl, this.role = role, this.root = root;
					this.els = [], this.pool = [];
					this.drop = drop;
				}, fn = Role.prototype;
			fn.init = function(){elLoop(this.root, loop, this.els);};
			fn.drain = function(el){this.pool.push(el);};
			fn.pop = function(){
				var el;
				if(this.pool.length) el = this.pool.pop();
				else{
					el = this.root.cloneNode(true);
					el.bsTMPL = TMPL[this.tmpl];
				}
				this.update(el);
				return el;
			};
			fn.update = function(el){
				var els = this.els, i = els.length, g;
				while(i--) els[i].render(el);
				if(g = el.bsGroup, !g) el.bsGroup = g = {};
				i = 'header,footer'.indexOf(this.role) == NONE && 'INDEX' in templateData;
				g.record = templateData;
				el.setAttribute(ns + 'group',
					(g.tmpl = this.tmpl) + '|' + 
					(g.role = this.role) + 
					(i ? '|' + (g.index = i ? templateData.INDEX : -1) : '')
				);
			};
			return Role;
		})();
		return (function(){
			var ROLE = 'footer,bottom,body,top,header'.split(','),
				LOOP = 'bottom,body,top'.split(','),
				DROP = 'first,last,odd,even'.split(','),
				Tmpl = function(tmpl){this.tmpl = tmpl;},
				fn = Tmpl.prototype;
			fn.role = function(el){
				var role = el.getAttribute(ns + 'role') || 'body', drop, d, i, r;
				drop = el.getAttribute(ns + 'drop') || '', d = {}, i = DROP.length;
				while(i--) d[DROP[i]] = drop.indexOf(DROP[i]) != NONE;
				r = this[role] = new Role(this.tmpl, role, el, d);
				el.parentNode.removeChild(el);
				el.removeAttribute(ns + 'drop');
				el.removeAttribute(ns + 'role');
				el.removeAttribute(ns + 'tmpl');
				domS(el, 'class-', 'tmpl');
			};
			fn.init = function(){
				var i = ROLE.length;
				while(i--) if(this[ROLE[i]]) this[ROLE[i]].init();
			};
			fn.drain = function(el){this[el.bsGroup.role].drain(el);};
			fn.update = function(el, curr, prevData, prev, isNew){
				var target, footer, hash, role, p, isSame, isFrag, f, t, i, j, k, first, isOdd, drop;
				f = frag();
				if(prev){
					target = el.firstElementChild;
					if(this.header) this.header.update(target), target = target.nextSibling;
					if(this.footer && prev) el.removeChild(footer = el.lastElementChild);
				}else if(this.header) f.appendChild(this.header.pop()), isFrag = true;
				
				for(isOdd = true, first = i = curr[0] && curr[0].INFO ? 1 : 0, j = curr.length; i < j; i++, isOdd = !isOdd){
					p = prev[i], hash = currData(prevData, curr, i), k = 3;
					if(p) isSame = p == hash;
					while(k--) if(role = this[LOOP[k]]){
						drop = role.drop;
						if((i == first && drop.first) || (i == j - 1 && drop.last) || (isOdd && drop.odd) || (!isOdd && drop.even)) continue;
						if(p){
							if(isNew || !isSame) role.update(target);
							target = target.nextSibling;
						}else f.appendChild(role.pop()), isFrag = true;
					}
				}
				if(prev){
					for(j = prev.length; i < j; i++){
						k = 3;
						while(k--) if(role = this[LOOP[k]]){
							role.drain(t = target);
							target = target.nextSibling;
							el.removeChild(t);
						}
					}
				}
				if(this.footer){
					if(footer) this.footer.update(footer);
					else footer = this.footer.pop();
					f.appendChild(footer);
					isFrag = true;
				}
				if(isFrag) el.appendChild(f);
				frag(f);
			};
			return Tmpl;
		})();
	})();
	bs('VM', {
		range:(function(){
			var r = [];
			return function(s, e){
				var a = arguments, i, j = a.length, v;
				r.length = 0;
				while(s <= e){
					v = {INDEX:s++}, i = 2;
					while(i < j) v[a[i++]] = a[i++];
					r[r.length] = v;
				}
				return r;
			};
		})(),
		item:(function(){
			var r = [];
			return function(){
				var a = arguments, i = 0, j = a.length, v;
				r.length = 0;
				while(i < j) r[r.length] = {INDEX:i, item:a[i]}, i++;
				return r;	
			};
		})()
	});
	return (function(){
		var views = {}, isScaned = false, c = 0,
			loop = function(el, view){
				var p = el;
				do{
					if(p.bsGroup) return;
				}while(p = p.parentNode);
				if(c) console.log(el);
				if(p = el.bsParam || param(el)) view.push(el, p);
			},
			scan = function(el){
				var key, i;
				if(typeof el == STR) el = docId(el);
				if(el.bsScaned) return;
				key = [];
				elLoop(el, function(el){
					var k = el.getAttribute(ns + 'tmpl');
					if(k){
						key[key.length] = k;
						if(!TMPL[k]) TMPL[k] = new Tmpl(k);
						TMPL[k].role(el);
					}
				});
				i = key.length;
				while(i--) TMPL[key[i]].init();
				el.bsScaned = true;
			};
		bs.bsImmutable('scan', scan);
		return function(el, isNew){
			var view, i, j;
			if(!isScaned){
				isScaned = true;
				scan(doc.body);
			};
			el = typeof el == STR ? el = docId(el) : el || doc.body;
			if(view = views[el.bsId], !view){
				loop(el, views[el.bsId = Symb() + ''] = view = []);
				if(el.firstElementChild) elLoop(el.firstElementChild, loop, view);
			}
			for(i = 0, j = view.length; i < j;) update(view[i++], view[i++], isNew);
		};
	})();
})()
);