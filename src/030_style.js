(function(){
var conf = {key:{}, keyF:{}, val:{}, nopx:{}}, key,
	nopx = conf.nopx, keys = conf.key, keyF = conf.keyF, vals = conf.val,
	bodyStyle = body.style, fn;

sys.dom.style = conf,
Style = function(s){this.st = s, this.u = {};},
Style.bsImmutable(
	'fn', fn = function(type, k, v){
		if(type == 'key'){
			attr[k] = STYLE;
			if(typeof v == FUN) keyF[k] = v;
			else keys[k] = v;
		}else conf[type][k] = v;
		return v;
	},
	'key', key = (function(){
		var prefix = detect.stylePrefix,
			r = /-[a-z]/g, re = function(_0){return _0.charAt(1).toUpperCase();};
		return function(k){
			var t0;
			if(k.charAt(0) == '-') k = k.substr(k.indexOf('-', 1) + 1);
			t0 = k.replace(r, re);
			if(t0 in bodyStyle || (t0 = prefix + t0.charAt(0).toUpperCase() + t0.substr(1)) in bodyStyle) return fn('key', k, t0);
			else attr[k] = NONE;
		};
	})()
),
Style.prototype.bsImmutable(
	'S', function(arg, i){
		var j = arg.length, k, v;
		while(i < j){
			k = arg[i++];
			if(i == j) return this.g(k);
			v = this.s(k, arg[i++]);
		}
		return v;
	},
	'g', (function(){
		var self, K, rn = /^([-]?[.0-9]+)([^-.0-9]*)$/g,
			rne = function(){self[K] = parseFloat(arguments[1]), self.u[K] = arguments[2];};
		return function(k){
			var t0;
			if(t0 = keys[k]) k = t0;
			else if(t0 = keyF[k]) return t0(this);
			else if(!(k = key(k))) return null;
			if(!(k in this)){
				if(rn.test(t0 = this.st[k])) self = this, K = k, t0.replace(rn, rne);
				else this[k] = t0.isNumber() ? parseFloat(t0) : t0, this.u[k] = '';
			}
			return this[k];
		};
	})(),
	's', (function(){
		var tester = docNew('div').style;
		return function(k, v){
			var isStr, t0, s, u;
			if(t0 = keys[k]) k = t0;
			else if(t0 = keyF[k]) return t0(this, v);
			else if(!(k = key(k))) return null;
			s = this.st, u = this.u;
			if(v === null && k in this) return delete this[k], delete u[k], s[k] = '', null;
			if(isStr = typeof v == STR){
				if((v = v.ex(this)).isNumber()) v = parseFloat(v), isStr = 0;
				else if(t0 = vals[v.substr(0,4)]){
					if((v = t0(v)).isNumber()) isStr = 0;
				}else if((t0 = v.indexOf(':')) != NONE && v.charAt(t0 + 1) != '/'){
					u[k] = v.substr(t0 + 1), v = parseFloat(v.substr(0, t0)), isStr = 0;
				}
			}
			if(!(k in u)){
				if(isStr || nopx[k]) u[k] = '';
				else{
					tester[k] = '11px';
					if(tester[k] == '11px') u[k] = 'px';
					else u[k] = '', nopx[k] = 1;
				}
			}
			if(!isStr || v.charAt(0) != '-') return s[k] = (this[k] = v) + u[k], v;
			return null;
		};
	})()
),
fn('key', 'style', (function(){
	var arg = [];
	return function(self, v){
		var t0, t1, i, j;
		v = v.split(';'), i = v.length;
		while(i--) t0 = v[i], self.s(t0.substring(0, t1 = t0.indexOf(':')).trim(), t0.substr(t1 + 1).trim());
	};
})()),
fn('key', 'float', 'styleFloat' in body.style ? 'styleFloat' : 'cssFloat' in body.style ? 'cssFloat' : 'float'),
(function(){
	var mode, transform, mx, i, t0, tkey = key('transform'), prefix = detect.stylePrefix;
	if(detect.device == 'pc'){
		if(detect.browser == 'ie') mode = detect.browserVer > 9 ? 1 : detect.browserVer > 8 ? 1 : 0;
		else mode = 2;
	}else{
		mode = docNew('div');
		mode.style['transform' in mode.style ? 'transform' : prefix + 'Transform'] = 'rotateX(0)';
		mode = mode.style.cssText.indexOf('rotateX(') > -1 ? 1 : 1;
	}
	transform = function(){}, i = transform.prototype;
	i.length = i.tx = i.ty = i.tz = i.rx = i.ry = i.rz = 0, i.sx = i.sy = i.sz = 1,
	i.txu = i.tyu = i.tzu = 'px', i.rxu = i.ryu = i.rzu = 'deg',
	i.toString = mode == 2 ? function(){
		return 'translateX(' + this.tx + this.txu + ') translateY(' + this.ty + this.tyu + ') translateZ(' + this.tz + this.tzu + ') ' +
		'scaleX(' + this.sx + ') scaleY(' + this.sy + ') scaleZ(' + this.sz + ') ' +
		'rotateX(' + this.rx + this.rxu + ') rotateY(' + this.ry + this.ryu + ') rotateZ(' + this.rz + this.rzu + ')';
	} : mode ? function(){
		return 'translate(' + this.tx + this.txu + ',' + this.ty + this.tyu + ') ' +
		'scale(' + this.sx + ',' + this.sy + ') ' +
		'rotate(' + this.rz + this.rzu + ')';
	} : function(){return '';},
	mx = function(k){
		return function(self, v){
			var t0 = self.bsTrans || (self.bsTrans = new transform);
			if(v === undefined) return t0[k];
			else if(v === null) return delete t0[k], self.s[tkey] = t0, v;
			else return t0[k] = v, self.s[tkey] = t0;
		};
	};
	for(i in (t0 = 'tx,ty,tz,sx,sy,sz,rx,ry,rz,txu,tyu,tzu,rxu,ryu,rzu'.split(','))) fn('key', t0[i], mx(t0[i]));
})();
if(!('opacity' in body.style)){
	fn('key', 'opacity', function(self, v){
		if(v === undefined) return self.opacity;
		else if(v === null) return delete self.opacity, style.filter = '', v;
		else return self.s.filter = 'alpha(opacity=' + parseInt(v * 100) + ')', self.opacity = v;
	}),
	fn('val', 'rgba', function(v){
		var t0 = v.substring(v.indexOf('(') + 1, v.indexOf(')')).split(',');
		t0[3] = parseFloat(t0[3]);
		return 'rgb(' + parseInt((255 + t0[0] * t0[3]) * .5) + ',' + 
			parseInt((255 + t0[1] * t0[3]) * .5) + ',' + 
			parseInt((255 + t0[2] * t0[3]) * .5) + ')';
	});
}
})();