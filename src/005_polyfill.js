(function(){
	var through = function(v){return v;}, o, k, f;
	o = {
		value:(function(){
			var r = {};
			return function(){
				var a = arguments, i = 0, j = a.length;
				while(i < j) Object.defineProperty(this, a[i++], (r.value = a[i++], r));
				return this;
			};
		})()
	};
	try{
		Object.defineProperty(Object.prototype, 'bsImmutable', o);
	}catch(e){
		Object.prototype.bsImmutable = function(){
			var a = arguments, i = 0, j = a.length;
			while(i < j) this[a[i++]] = a[i++];
			return this;
		};
	}
	Object.prototype.isArguments = (function(){
		var f = Object.prototype.toString;
		return function(){return f.call(this) == '[object Arguments]';};
	})();
	
	//Object
	for(k in o = {
		freeze:through,
		seal:through,
		defineProperty:function(o, k, d){
			if('value' in d) o[k] = d.value;
			else if('get' in d){
				if('set' in d) o[k] = function(){
						if(arguments.length) d['set'].call(o, arguments[0]);
						else return d['get'].call(o);
					};
				else o[k] = d['get'];
			}
			return o;
		},
		defineProperties:function(o, d){
			var k;
			for(k in d) Object.defineProperty(o, k, d[k])
			return o;
		},
		assign:function(t){
			var a = arguments, i, j, k;
			for(i = 1, j = a.length; i < j; i++){
				for(k in a[i]) if(a[i].hasOwnProperty(k)) t[k] = a[i][k];
			}
			return t;
		},
		create:(function(){
			var cls = function(){};
			return function(fn, prop){
				var r;
				cls.prototype = fn;
				r = new cls();
				if(prop) Object.defineProperties(r, prop);
				cls.prototype = null;
				return r;
			};
		})()
	}) if(o.hasOwnProperty(k)) if(!Object[k]) Object.bsImmutable(k, o[k]);
	//Array
	for(k in o = {
		from:function(v){
			var r = [], i;
			if(typeof v[Symb.iterator] == 'function'){
				v = v[Symb.iterator]();
			}
			if(typeof v.next == 'function'){
				do{
					i = v.next();
					if(i.done) break;
					else r[r.length] = i.value;
				}while(true);
			}else if(i = v.length){
				while(i--) r[i] = v[i];
			}
			return r;
		},
		isArray:function(v){
			return v instanceof Array;
		}
	}) if(o.hasOwnProperty(k)) if(!Array[k]) Array.bsImmutable(k, o[k]);
	//Array.prototype
	for(k in o = {
		trim:function(isNew){
			var arr = isNew ? [] : this, i = arr.length;
			while(i--) if(typeof arr[i] == 'string') arr[i] = arr[i].trim();
			return arr;
		},
		indexOf:function(v, I){
			var i, j, k, l;
			if(j = this.length) for(I = I || 0, i = I, k = parseInt((j - i) * .5) + i + 1, j--; i < k; i++) if(this[l = i] === v || this[l = j - i + I] === v) return l; 
			return -1;
		},
		forEach:function(f){
			for(var i = 0, j = this.length; i < j; i++) f(this[i], i, this);
		},
		forInterval:function(f, t){
			var i = 0, id, self = this;
			id = setInterval(function(){
				if(f(self[i], i, self) || ++i == self.length) clearInterval(id);
			}, t || 1);
		},
		map:function(f){
			for(var r = [], i = 0, j = this.length; i < j; i++) r[i] = f(this[i], i, this);
			return r;
		},
		filter:function(f){
			for(var r = [], i = 0, j = this.length; i < j; i++) if(f(this[i], i, this)) r[r.length] = this[i];
			return r;
		},
		reduce:function(){
			for(var f = arguments[0], i = 0, j = this.length, r = arguments.length == 2 ? arguments[1] : this[i++]; i < j; i++) r = f(r, this[i], i, this);
			return r;
		},
		watch:function(){
			for(var f = arguments[0], i = 0, j = this.length, r = arguments.length == 2 ? arguments[1] : this[i++]; i < j; i++){
				r = f(r, this[i], i, this);
				if(r == bs.FAIL) break;
			}
			return r;
		},
		reduceInterval:function(){
			var a = arguments, f = a[0], i = 0, r = a.length > 1 ? a[1] : this[i++], id, self = this;
			var s, stop = function(){s = true;};
			id = setInterval(function(){
				s = false;
				r = f(r, self[i], i, self);
				if(s || ++i == self.length){
					clearInterval(id);
					if(typeof a[2] == 'function') a[2]();
				}
			}, t || 1);
		},
		reverse:function(){
			var i, j, k, l;
			for(i = 0, j = parseInt(this.length / 2); i < j; i++) k = this[i], this[i] = this[l = this.length - 1 - i], this[l] = k;
			return this;
		}
	}) if(o.hasOwnProperty(k)) if(!Array.prototype[k]) Array.prototype.bsImmutable(k, o[k]);
	//String.prototype
	for(k in o = {
		isNumber:function(){return parseFloat(this) + '' == this;},
		ex:(function(){
			var arg = [bs], param = ['bs'], p,
				r0 = /\.\{([^}]+)\}/g, f0 = function(_, v){
					var i, j, k;
					if(v.indexOf('.') == NONE) v = templateData[v];
					else{
						for(v = v.split('.'), i = 0, j = v.length, k = templateData; i < j; i++){
							if(!k) return '';
							k = k[v[i]];
						}
						v = k;	
					}
					return typeof v == 'function' ? v() : v;
				},
				r1 = /\@\{([^}]+)\}/g, f1 = function(_, v){
					v = bs(v);
					return typeof v == 'function' ? v() : v;
				},
				r2 = /\$\{([^}]+)\}/g, f2 = function(_, v){
					return (new Function(p, 'return (' + v + ');')).apply(null, arg);
				};
			return function(v){
				var s = this, a, i, j, k, c = 10;
				do{
					k = 0;
					if(s.indexOf('.{') != NONE) s = s.replace(r0, f0), k = 1;
					if(s.indexOf('@{') != NONE) s = s.replace(r1, f1), k = 1;
					if(s.indexOf('${') != NONE){
						param.length = arg.length = 1, a = arguments, i = 0, j = a.length;
						while(i < j) param[param.length] = a[i++], arg[arg.length] = a[i++];
						p = param.join(','), s = s.replace(r2, f2), k = 1;
					}
				}while(k && c--);
				return s;
			};
		})(),
		trim:(function(){
			var trim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			return function(){return this.replace(trim, '');};
		})(),
		cut:function(l, r){
			var v = this;
			if(l) v = v.substr(l);
			if(r) v = v.substr(0, v.length - r);
			return v;
		},
		right:function(v){return this.substr(this.length - v);},
		startsWith:function(v){return this.substr(0, v.length) == v;},
		endsWith:function(v){return this.substr(this.length - v.length) == v;},
		repeat:function(v){
			var r = '', key = this;
			while(v--) r += key;
			return r;
		}
	}) if(o.hasOwnProperty(k)) if(!String.prototype[k]) String.prototype.bsImmutable(k, o[k]);
	//Date.prototype
	if(!Date.now) Date.bsImmutable('now', function(){return +new Date;});
	for(k in o = {
		toISOString:f = function(){
			var v;
			return this.getUTCFullYear() +
				'-' + (v = '0' + (this.getUTCMonth() + 1)).substr(v.length - 2) +
				'-' + (v = '0' + this.getUTCDate()).substr(v.length - 2) +
				'T' + (v = '0' + this.getUTCHours()).substr(v.length - 2) +
				':' + (v = '0' + this.getUTCMinutes()).substr(v.length - 2) +
				':' + (v = '0' + this.getUTCSeconds()).substr(v.length - 2) +
				'.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
				'Z';
		},
		toJSON:f
	}) if(o.hasOwnProperty(k)) if(!Date.prototype[k]) Date.prototype.bsImmutable(k, o[k]);
	if(!W['requestAnimationFrame'])(function(){
		var offset = Date.now();
		v = 'equestAnimationFrame';
		W['r' + v] = W['webkitR' + v] || W['mozR' + v] || W['msR' + v] || (Date.now ? function(v){
			return setTimeout(v.__raf__ || (v.__raf__ = function(){v(Date.now() - offset);}), 16.7);
		} : function(v){
			return setTimeout(v.__raf__ || (v.__raf__ = function(){v(+new Date - offset);}), 16.7);
		});
		v = 'ancelAnimationFrame';
		wkey('c' + v, W['webkitC' + v] || W['mozC' + v] || W['msC' + v] || clearTimeout);
	})();
	if(!W['performance']) wkey('performance', {});
	if(!W.performance.now) performance.bsImmutable('now', function(){return Date.now() - offset;});
})();

