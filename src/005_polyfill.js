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
	if(Object.defineProperty){
		try{
			Object.defineProperty(Object.prototype, 'bsImmutable', o);
		}catch(e){
			Object.prototype.bsImmutable = o.value;
		}
	}else Object.prototype.bsImmutable = o.value;
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
				var s = this, a, i, j;
				if(s.indexOf('.') != NONE) s = s.replace(r0, f0);
				if(s.indexOf('@') != NONE) s = s.replace(r1, f1);
				if(s.indexOf('$') != NONE){
					param.length = arg.length = 1;
					a = arguments, i = 0, j = a.length;
					while(i < j) param[param.length] = a[i++], arg[arg.length] = a[i++];
					p = param.join(',');
					s = s.replace(r2, f2);
				}
				return s;
			};
		})(),
		trim:(function(){
			var trim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			return function(){return this.replace(trim, '');};
		})()
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

