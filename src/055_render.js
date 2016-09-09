bs.css('.tmpl,[' + ns + 'tmpl]{display:none}'),
bs.bsImmutable(
'render', (function(){
	var TMPL = {}, frag, elLoop, param, update, currData, Tmpl;
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
		var stack = [];
		return function(curr, i){
			var hash, s, k, l;
			s = curr[i];
			if(!s)return;
			stack.length = 0;
			stack[0] = s;
			do{
				if(s && typeof s == 'object'){
					delete s['@hash'];
					if(s.splice){
						for(k = 0, l = s.length; k < l; k++) if(s[k] && typeof s[k] == 'object') stack[stack.length] = s[k];
					}else{
						for(k in s) if(s[k] && typeof s[k] == 'object' && s.hasOwnProperty(k)) stack[stack.length] = s[k];
					}
				}
			}while(s = stack.pop());
			delete curr[i]['@hash'];
			hash = JSON.stringify(templateData = curr[i]);
			templateData['@hash'] = hash, templateData['@idx'] = i;
			return hash;
		};
	})();
	param = (function(){
		var defaultvm = function(m){return m;};
		return function(el){
			var p, v, i;
			if(p = el.bsParam, p === undefined){
				p = el.getAttribute(ns + 's');
				if(p) el.removeAttribute(ns + 's'), p = p.split(',');
				if(v = el.getAttribute(ns + 'vm')){
					el.removeAttribute(ns + 'vm');
					if(!p) p = {};
					if(p.view = el.getAttribute(ns + 'view')) el.removeAttribute(ns + 'view');
					else return err('param', 'view');
					i = v.indexOf('(');
					if(i == NONE) p.vm = defaultvm, p.m = v;
					else p.vm = bs(v.substring(0, i)), p.m = v.substring(i + 1, v.length - 1);
				}
				el.bsParam = p || false;
			}
			return p;
		};
	})();
	update = function(el, param, isNew){
		var tmpl, prevData, curr, prev, hash, p, el0, el1, m, i, j;
		if(param.length) domS(el, param);
		if(param.vm){
			if(param.view != '*') tmpl = TMPL[param.view];
			prevData = templateData;
			if(m = param.m){
				switch(m.substr(0, 2)){
				case'.{':m = bs('$' + m.substring(2, m.length - 1)); break;
				case'@{':m = bs(m.substring(2, m.length - 1)); break;
				default:m = bs(param.m.ex());
				}
				curr = param.vm(m);
			}else curr = param.vm();
			if(!(curr instanceof Array)) curr = [curr];
			if(prev = el.bsPrevData || 0, !prev) el.innerHTML = '';
			templateData = curr;
			if(tmpl) tmpl.update(el, curr, prev, isNew);
			else{
				for(i = 0, j = curr.length; i < j; i++){
					hash = currData(curr, i);
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
			if(m = el.bsPrevData, !m) el.bsPrevData = m = [];
			m.length = i = curr.length;
			while(i--) m[i] = curr[i]['@hash'];
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
				Role = function(tmpl, role, root){
					this.tmpl = tmpl, this.role = role, this.root = root;
					this.els = [], this.pool = [];
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
				i = 'header,footer'.indexOf(this.role) == NONE && '@idx' in templateData;
				el.setAttribute(ns + 'group',
					(g.tmpl = this.tmpl) + '|' + 
					(g.role = this.role) + 
					(i ? '|' + (g.idx = templateData['@idx']) : '')
				);
			};
			return Role;
		})();
		return (function(){
			var ROLE = 'footer,bottom,body,top,header'.split(','),
				LOOP = 'bottom,body,top'.split(','),
				Tmpl = function(tmpl){this.tmpl = tmpl;},
				fn = Tmpl.prototype;
			fn.role = function(el){
				var role = el.getAttribute(ns + 'role') || 'body', r;
				r = this[role] = new Role(this.tmpl, role, el);
				el.parentNode.removeChild(el);
				el.removeAttribute(ns + 'role');
				el.removeAttribute(ns + 'tmpl');
				domS(el, 'class-', 'tmpl');
			};
			fn.init = function(){
				var i = ROLE.length;
				while(i--) if(this[ROLE[i]]) this[ROLE[i]].init();
			};
			fn.drain = function(el){this[el.bsGroup.role].drain(el);};
			fn.update = function(el, curr, prev, isNew){
				var target, footer, hash, role, p, isSame, isFrag, f, t, i, j, k;
				f = frag();
				if(prev){
					target = el.firstElementChild;
					if(this.header) this.header.update(target), target = target.nextSibling;
					if(this.footer && prev) el.removeChild(footer = el.lastElementChild);
				}else if(this.header) f.appendChild(this.header.pop()), isFrag = true;
				for(i = 0, j = curr.length; i < j; i++){
					p = prev[i], hash = currData(curr, i), k = 3;
					if(p) isSame = p == hash;
					while(k--) if(role = this[LOOP[k]]){
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
	return (function(){
		var views = {}, isScaned = false, c = 0,
			loop = function(el, view){
				var p = el;
				do{
					if(p.bsGroup) return;
				}while(p = p.parentNode);
				if(c) console.log(el);
				if(p = el.bsParam || param(el)) view.push(el, p);
			};
		return function(el, isNew){
			var view, i, j;
			if(!isScaned){
				isScaned = true;
				elLoop(doc.body, function(el){
					var k = el.getAttribute(ns + 'tmpl');
					if(k) (TMPL[k] || (TMPL[k] = new Tmpl(k))).role(el);
				});
				for(i in TMPL) if(TMPL.hasOwnProperty(i)) TMPL[i].init();
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