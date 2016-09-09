(function(){
	if(W.bsES6) return;
	Object.defineProperty(W, 'bsES6', {value:true});
	var rF2T = /^.+\/\*\n([\s\S]+)\n\*\/.+$/g;
	(function(){ //Symbol
		var uuid = 0, keys = {}, syms = {},
			S = function(key){return new Sym(key);},
			Sym = function(key){
				this.id = (key || '') + '@@Symb:' + (+new Date) + ':' + (uuid++) + ':' + bs.randf(10000, 99999);
				return Object.freeze(this);
			};
		Sym.prototype.bsImmutable('toString', function(){return this.id;});
		Object.freeze(Sym.prototype);
		S.bsImmutable(
			'iterator', '@@iterator',
			'for', function(k){return keys[k] || (syms[keys[k] = S(k)] = k, keys[k]);},
			'keyFor', function(s){return syms[s];}
		);
		wkey('Symb', Object.freeze(S));
	})();
	(function(){ //template
		var rEX = /\$\{([^}]+)\}/g, rSpt = /\$\{[^}]+\}/g,
			defaultTag = function(strings){
				var result = '', values = arguments, i, j, k;
				for(i = 0, j = strings.length, k = values.length; i < j; i++){
					result += strings[i];
					if(i + 1 < k) result += values[i + 1];
				}
				return result;
			};
		wkey('Tmpl', function(tag, str, vo){
			var values, k, key, val;
			if(!tag) tag = defaultTag;
			if(!vo) vo = {};
			if(typeof str == 'function') str = str.toString().replace(rF2T, '$1');
			values = [str.split(rSpt)];
			if(str.indexOf('${') > -1){
				key = [], val = [];
				for(k in vo) key.push(k), val.push(vo[k]);
				key = key.join(',');
				str.replace(rEX, function(v, ex){
					values.push((new Function(key, 'return ' + ex)).apply(null, val) + '');
				});
			}
			return tag.apply(null, values);
		});
	})();
	(function(){ //Iterator
		var pool = [], done = Object.freeze({value:undefined, done:true}),
			next = {
				string:function(){
					if(this.c < this.v.length) return this.value = this.v.charAt(this.c++), this;
					return pool.push(this), done;
				},
				object:function(){
					if(this.c < this.v.length) return this.value = this.v[this.c++], this;
					return pool.push(this), done;
				}
			};
		Array.prototype[Symb.iterator] = String.prototype[Symb.iterator] = function(){
			var iter = pool.length ? pool.pop() : {}, t = typeof this;
			iter.c = 0, iter.v = this, iter.next = next[t], 
			iter.done = !this.length, 
			iter.value = t == 'string' ? this.charAt(0) : this[0];
			return iter;
		};
	})();
	(function(){//destructuring
		var pool = {}, Dest = (function(){
			var DEST = '[^dest^]', DEFAULT = '[^default^]',
				getVal, getData, parse, destructuring, Var, Dest,
				arr = [], obj = [], a, o, ad, od, at, ot,
				rObj = /\{[^\{\[\]\}]*\}/g, rArr = /\[[^\{\[\]\}]*\]/g,
				oR = function(v){return ot[o] = v, '@o_'+ od +'_' + (o++) + '@';},
				aR = function(v){return at[a] = v, '@a_'+ ad +'_' + (a++) + '@';},
				rO = /@o_[^@]+@/g, rA = /@a_[^@]+@/g, rR = /^@o_[^@]+@|@a_[^@]+@$/,
				rNum = /^[-]?[.0-9]+$/, rStr = /^('[^']*'|"[^"]*")$/,
				primi = {'true':true, 'false':false, 'null':null};
			getData = function(d){
				var target = d.search(rO) > -1 ? obj : d.search(rA) > -1 ? arr : 0;
				if(target) return d = d.substring(1, d.length - 1).split('_'), target[d[1]][d[2]];
				return false;
			};
			getVal = function(d){
				var target = d.search(rO) > -1 ? obj : d.search(rA) > -1 ? arr : 0;
				if(target) return d = d.substring(1, d.length - 1).split('_'), JSON.parse(target[d[1]][d[2]]);
				else if(d.search(rStr) > -1) return d.substring(1, d.length - 1);
				else if(d.search(rNum) > -1) return parseFloat(d);
				else if(d = primi[d]) return d;
			};
			Dest = function(dest){
				var loop, r = this[DEST] = {};
				arr.length = obj.length = a = o = ad = od = 0, dest = dest.trim();
				do{
					loop = 0;
					if(dest.search(rObj) > -1) obj[od] = ot = [], dest = dest.replace(rObj, oR), od++, loop = 1;
					if(dest.search(rArr) > -1) arr[ad] = at = [], dest = dest.replace(rArr, aR), ad++, loop = 1;
				}while(loop);
				if(dest.indexOf('=') > -1) dest = dest.split('='), r[DEFAULT] = getVal(dest[1].trim()), dest = dest[0].trim();
				if(dest.search(rR) == -1) throw 'invalid destructuring';
				parse(dest, r);
			};
			Dest.prototype.bsImmutable('value', function(v){
				var result = {};
				destructuring(this[DEST], v === undefined ? this[DEST][DEFAULT] : v, result);
				return result;
			});
			Var = function(k){
				var i = k.indexOf('=');
				if(i > -1) this[DEFAULT] = getVal(k.substr(i + 1).trim()), k = k.substring(0, i).trim();
				this.k = k;
			};
			Var.prototype.toString = function(){return this.k;};
			parse = function(dest, r){
				var v, isObj;
				dest = dest.trim();
				if(v = getData(dest)){
					isObj = v.charAt(0) == '{' ? 1 : 0;
					v.substring(1, v.length - 1).split(',').forEach(function(v, idx){
						var p;
						v = v.trim();
						if(isObj){
							p = v.indexOf(':');
							v = p > -1 ? [v.substring(0, p), v.substr(p + 1)] : [v, v];
							if(p = parse(v[1], {})) r[v[0].trim()] = p;
						}else if(p = parse(v, {})) r[idx] = p;
					});
					return r;
				}else return dest ? new Var(dest) : undefined;
			};
			destructuring = function(target, v, result){
				var k, key, iter, iterR, i, j;
				if(iter = v){
					while(typeof iter[Symb.iterator] == 'function') iter = iter[Symb.iterator]();
					if(typeof iter.next == 'function') iterR = [];
				}
				for(k in target){
					if(target.hasOwnProperty(k)){
						key = target[k];
						if(key instanceof Var){
							if(key.k.substr(0, 3) == '...'){
								i = key.k.substr(3);
								if(iterR){
									For.Of(iter, function(v){iterR.push(v);});
									result[i] = iterR.slice(k);
								}else if(v instanceof Array) result[i] = v.slice(k);
								else throw 'invalid Array';
							}else{
								if(parseInt(k, 10) + '' == k){
									if(!(v instanceof Array) && iterR){
										k = parseInt(k, 10);
										while(iterR.length - 1 < k){
											j = iter.next();
											if(j.done) break;
											iterR.push(j.value);
										}
										result[key] = iterR[k] === undefined ? key[DEFAULT] : iterR[k];
										continue;
									}
								}
								result[key] = v[k] === undefined ? key[DEFAULT] : v[k];
							}
						}else if(key && typeof key == 'object') destructuring(key, v[k], result);
					}
				}
			};
			return Dest;
		})();
		wkey('Dest', function(dest, v){
			if(typeof dest == 'function') dest = dest.toString().replace(rF2T, '$1');
			return (pool[dest] || (pool[dest] = new Dest(dest))).value(v);
		});
	})();
	(function(){//for of
		var f = function(iter, f){
				var cnt = 100000, v;
				while(iter[Symb.iterator]) iter = iter[Symb.iterator]();
				while(cnt--){
					v = iter.next();
					if(v.done) break;
					f(dest ? Dest(dest, v.value) : v.value);
				}
				dest = prev;
			}, dest, prev, obj = Object.freeze({Of:f}),
			For = function(d){return prev = dest, dest = d, obj;};
		For.bsImmutable('Of', f);
		wkey('For', For);
	})();
	wkey('Gene', (function(){
		var SELF, pool = [], Generator = function(){}, fn = Generator.prototype;
		fn.init = (function(){
			var ONCE = '[^once^]', ID = '[^ID^]',
				once = function(){
					var id, a, i, j;
					if(this[ONCE][id = this[ID]++]) return;
					this[ONCE][id] = 1;
					a = arguments, i = 0, j = a.length;
					while(i < j) this[a[i++]] = a[i++];
				};
			return function(f, ec, context, su, suCall){
				this.f = f;
				if(!ec) ec = {};
				ec[ONCE] = {}, ec[ID] = 1, ec.once = once, this.ec = ec;
				this.ids = {};
				if(typeof context == 'function') delete this._context, this.context = context;
				else this._context = context, delete this.context;
				if(suCall) delete this._super, this.Super = su;
				else this._super = su, delete this.Super;
				this.value = undefined, this.done = false;
			};
		})();
		fn.Super = function(){return this._super;};
		fn.context = function(){return this._context;};
		fn.next = (function(){
			var done = Object.freeze({done:true});
			return function(){
				var r, prevS, prevSelf;
				if(this.done) return this;
				if(this.stack){
					r = this.stack.next();
					if(r.done) this.stack = null;
					else return r;
				}
				this.isYieldActive = false, this.seed = 1, this.y$ = this.y = FAIL;
				prevSelf = SELF, SELF = this, prevS = W.Super, W.Super = this.Super();
				this.f.call(this.context(), this.ec);
				SELF = prevSelf, W.Super = prevS;
				if(this.y !== FAIL) return this.value = this.y, this;
				if(this.y$ !== FAIL){
					r = this.y$.next();
					if(!r.done) return this.stack = this.y$, r;
				}
				return pool[pool.length] = this, done;
			};
		})();
		wkey('Unused', function(){
			var id = 'U' + (SELF.seed++);
			if(SELF.ids[id]) return false;
			return SELF.ids[id] = true;
		});
		(function(){
			var order = function(cnt){
				var id;
				if(SELF.isYieldActive) return true;
				id = 'Y' + (SELF.seed++);
				if(SELF.ids[id] === undefined) SELF.ids[id] = cnt ? cnt < 0 ? 100000 : cnt : 1;
				if(!SELF.ids[id]) return true;
				SELF.ids[id]--;
				SELF.isYieldActive = true;
			};
			wkey('Yield', function(v, cnt){
				if(order(cnt)) return true;
				return SELF.y = v, false;
			});
			wkey('Yield$', function(v, cnt){
				if(order(cnt)) return true;
				while(typeof v[Symb.iterator] == 'function') v = v[Symb.iterator]();
				return SELF.y$ = v, false;
			});
		})();
		return function(f, context, su, suCall){
			return function(ec){
				var g = pool.length ? pool.pop() : new Generator();
				g.init(f, ec, context || null, su || null, suCall);
				return g;
			};
		};
	})());
	wkey('Class', (function(){
		var instances = {}, ID = '[^id^]', 
			getId = function(){return this[ID];},
			removeId = function(){return delete instances[this[ID]];};
		bs.bsImmutable(
			'fromId', function(id){return instances[id];},
			'removeId', function(id){delete instances[id];}
		);		

		var keyword = {constructor:1, register:1}, protoInit = {};
		var SC = (function(){
			var ext, self, sc = function(){ext.apply(self, arguments);}, root = function(){};
			return function(s, e){W.Super = e ? (self = s, ext = e, sc) : root;};
		})();
		var mkSM = function(sm, f){return function(){return f.apply(sm['^self^'], arguments);};};
		var mkS = function(c, ext, f){
			var m = function(){
				var r, prev;
				if(this instanceof m) throw 'only method';
				prev = W.Super;
				W.Super = ext, r = f.apply(c, arguments), W.Super = prev;
				return r;
			};
			return m;
		};
		var mkSG = function(c, ext, f){
			f = Gene(f, null, ext);
			return function(ec){return f(ec);};
		};
		var mkM = function(f, sm){
			var m = function(){
				var r, prev;
				if(this instanceof m) throw 'only method';
				prev = W.Super;
				return sm['^self^'] = this, W.Super = sm, r = f.apply(this, arguments), W.Super = prev, r;
			};
			return m;
		};
		var mkMG = function(f, sm){
			var self, m;
			f = Gene(f, function(){return self;}, function(){return sm['^self^'] = self, sm;}, true);
			return function(ec){return self = this, f(ec);};
		};
		return function(){
			var a = arguments, ext = typeof a[0] == 'function' ? a[0] : null, cls = a[ext ? 1 :0];
			var register = cls && cls.register, cstrt = cls && cls['constructor'], cname = cstrt ? cstrt.name || '' : '';
			var c, sm, fn, k, proto;

			c = function(v){
				var prev;
				if(v === protoInit) return;
				if(!(this instanceof c)) throw 'only new';
				if(register) instances[this[ID] = cname + ':' + Symb()] = this;
				if(cstrt) prev = W.Super, SC(this, ext), cstrt.apply(this, arguments), W.Super = prev;
			};
			sm = {'^self^':null}; //super method
			if(ext){
				proto = ext.prototype;
				for(k in proto) if(proto.hasOwnProperty(k)) sm[k] = mkSM(sm, proto[k]);
				Object.seal(sm);
				c.prototype = new ext(protoInit);
			}
			fn = c.prototype;
			if(register) fn.getId = getId, fn.removeId = removeId;
			if(cls)for(k in cls) if(!keyword[k] && cls.hasOwnProperty(k)){
				if(k.substr(0, 7) == 'static '){
					if(k.charAt(7) != '*') c[k.substr(7)] = mkS(c, ext, cls[k]);
					else c[k.substr(8)] = mkSG(c, ext, cls[k]);		
				}else{
					if(k.charAt(0) != '*') fn[k] = mkM(cls[k], sm);
					else fn[k.substr(1)] = mkMG(cls[k], sm);
				}
			}
			return c;	
		};
	})());
})();