(function(){
var CR = W['CSSRule'], id = 0, sheet, ruleSet, idx, add, del, Css,
	Font, KeyFrame;
Css = function(key){
	var t0, v;
	if(key.charAt(0) == '@'){
		if(key == '@font-face') this.type = 5, this.s = new Font;
		else if(!key.indexOf('@keyframes')) this.type = 7, this.s = new KeyFrame(key);
		else return;
	}else{
		this.type = 1,
		this.r = add(t0, v),
		this.s = new Style(this.r.style);
	}
},
Css.prototype.bsImmutable('S', function(v){
	var type = this.type, t0, t1;
	if(v === null){
		if(type == 1) del(this.r);
		else this.s.S(null);
	}else return this.s.S(v, 0);
}),
bs.bsImmutable(
'css', (function(){
	var VAR = {}, parser, p;
	parser = (function(){
		var rc = /\/\*(?:.|[\r\n])*?\*\//g,
			r0 = /[-][-][a-zA-Z][a-zA-Z0-9]+/g, rf = function(v){return VAR[v];};
		return function(v){
			var t0, prefix, body, i, j, k, l;
			v = v.replace(rc, '').trim();
			if(v.indexOf('}}') > -1){
				for(v = v.split('}}'), i = 0, j = v.length; i < j; i++ ){
					t0 = v[i],
					prefix = t0.substring(0, k = t0.indexOf('{{'));
					if((l = prefix.lastIndexOf('}')) > -1) p(prefix.substring(0, l + 1), ''), prefix = prefix.substr(l + 1);
					prefix = prefix.trim(),
					body = t0.substr(k + 2).trim();
					if(prefix.substr(0, 2) == '--') VAR[prefix] = body;
					else p(body.replace(r0, rf), prefix + (prefix ? ' ' : ''));
				}
			}else p(v, '');
		};
	})(),
	p = (function(){
		var arg = [], c = docNew('div').style,
			css = function(){
				c.cssText = '', (new Style(c)).S(arg, 0);
				return c.cssText;
			};
		return function(v, prefix){
			var w = '', s, b, t0, t1, i, j, k, l, m;
			for(v = v.split('}'), i = 0, j = v.length; i < j; i++) if(t0 = v[i].trim()){
				s = t0.substring(0, k = t0.indexOf('{')).trim(), b = t0.substr(k + 1);
				for(t0 = b.split(';'), arg.length = k = 0, l = t0.length; k < l; k++ ){
					t1 = t0[k], arg[arg.length] = t1.substring(0, m = t1.indexOf(':')).trim(), 
					arg[arg.length] = (t1 = t1.substr(m + 1).trim()).isNumber() ? parseFloat(t1) : t1;
				}
				if(s.indexOf('@') == NONE){
					w += prefix + s.split(',').trim().join(',' + prefix) + '{' + css() + '}\n';
				}else new Css(s).S(v);
			}
			if(w){
				head.appendChild(t0 = docNew('style')),
				t0['styleSheet'] ? (t0['styleSheet'].cssText = w) : (t0.innerHTML = w);
			}
		};
	})();
	return function(v){
		v.substr(v.length - 4) == '.css' ? bs.get(parser, v) : 
		parser(v);
	};
})()),

head.appendChild(sheet = docNew('style')),
sheet.id = 'utCss' + (id++),
sheet = sheet.styleSheet || sheet.sheet,
ruleSet = sheet.cssRules || sheet.rules,
idx = function(rs, rule){
	var i, j, k, l;
	for(i = 0, j = rs.length, k = parseInt(j * .5) + 1, j--; i < k; i++){
		if(rs[l = i] === rule || rs[l = j - i] === rule) return l;
	}
	return -1;
},
add = sheet['insertRule'] ? function(k){return sheet.insertRule(k + '{}', ruleSet.length);} :
	function(k, v){return sheet.addRule(k, ' '), ruleSet[ruleSet.length - 1];},
del = sheet['deleteRule'] ? function(v){sheet.deleteRule(idx(ruleSet, v));} :
	function(v){sheet.removeRule(idx(ruleSet, v));},
KeyFrame = function(k){
	if(CR){
		if(!CR.KEYFRAME_RULE){
			k = k.substr(k.indexOf(' ') + 1);
			if(CR.WEBKIT_KEYFRAME_RULE) k = '@-webkit-keyframes ' + k;
			else if(CR.MOZ_KEYFRAME_RULE) k = '@-moz-keyframes ' + k;
			else return err('Css0', k);
		}
		this.__r__ = add(k);
	}
	return err('Css1', k);
},
KeyFrame.prototype.S = function(a){
	var t0, k, i, j;
	if(a === null) return del(this.r);
	k = a[0], i = 1, j = a.length;
	if(!this[k] && a[1] !== null){
		this.__r__.insertRule(k + '{}'),
		this[k] = {r:t0 = this.__r__.cssRules[this.__r__.cssRules.length - 1], s:Style(t0.style)};
	}
	if(a[1] === null){
		if(this[k]){
			this.__r__.deleteRule(idx(this.__r__.cssRules, this[k].r)),
			delete this[k];
		}
		return;
	}
	return this[k].s.S(arguments, 1);
},
Font = function(){},
Font.prototype.S = function(a){
	var src, local, t0, i, j;
	if(a === null){
		if(this.updated) head.removeChild(docId('utCss' + this.updated));
		return;
	}
	i = 0, j = a.length;
	while(i < j){
		k = a[i++];
		if(i == j) return this[k];
		v = a[i++];
		if(v === null) delete this[k];
		else this[k] = v;
	}
	if(this['font-family'] && this.src){
		if(this.updated) head.removeChild(docId('utCss' + this.updated));
		src = this.src.split(','), i = src.length, local = [];
		while(i--){
			src[i] = src[i].trim();
			if(!src[i].indexOf('local(')) local[local.length] = src[i];
			else switch(src[i].substr(src[i].length - 4)){
			case'.eot':src.eot = src[i]; break;
			case'woff':src.woff = src[i]; break;
			case'.ttf':src.ttf = src[i]; break;
			case'.svg':src.svg = src[i]; break;
			default:
				src.eot = src[i] + '.eot',
				src.woff = src[i] + '.woff',
				src.ttf = src[i] + '.ttf',
				src.svg = src[i] + '.svg';
			}
		}
		j = (local.length ? local.join(',') + ',' : '') +
			(src.eot ? detect.browser == 'ie' ? "url('" + src.eot + "?#iefix') format('embedded-opentype')," : "url('" + src.eot + "')," : '') +
			(src.woff ? "url('" + src.woff + "')," : '') +
			(src.ttf ? "url('" + src.ttf + "')  format('truetype')," : '') +
			(src.svg ? "url('" + src.svg + "')  format('svg')," : '');
		if(j.charAt(j.length - 1) == ',') j = j.substring(0, j.length - 1);
		t0 = docNew('style'),
		t0.id = 'utCss' + (this.updated = id++),
		head.appendChild(t0),
		(t0.styleSheet || t0.sheet).cssText = '@font-face{font-family:' + this['font-family'] + ';src:' + j + '}';
	}
	return v;
};
})();