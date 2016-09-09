(function(){
	var RULESET = {}, RULE = {}, FILTER = {}, MSG = {}, VALI = {}, RuleSet, Rule, Vali;
	Rule = (function(){
		var Rule = function Rule(check){this.bsImmutable('_check', check);};
		Rule.prototype.bsImmutable(
			'check', function(v, safe, msg){return this._check(v, this._param, safe) || msg(this._msg(v, this._param, safe));}
		);
		return Rule;
	})(),
	RuleSet = (function(){
		var msg = function(v){return msg.msg = v, 0;},
			sep = /[&|]/g, rmsg = /@value@/gi,
			RuleSet = function(){};
		RuleSet.prototype.bsImmutable(
			'rule', function(a){
				var rules = [], arg, r, i, j, k, v;
				while((i = a.search(sep)) != NONE || (i = a.length)){
					r = a.substring(0, i);
					if((k = r.indexOf('(')) > -1){
						arg = r.substring(k + 1, r.length - 1).split(','),
						j = arg.length;
						while(j--){
							arg[j] = v = arg[j].trim();
							if(v.isNumber()) arg[j] = parseFloat(v);
						}
						r = r.substr(0, k);
					}
					k = r.indexOf(':'),
					rules[rules.length] = v = RULE[r.substr(0, k)](),
					v._msg = MSG[r.substr(k + 1)], v._param = arg || null;
					k = a.charAt(i);
					if(k == '&' || k == '|') rules[rules.length] = k;
					a = a.substr(i + 1);
				}
				this._rules = rules;
				return this;
			},
			'check', function(result, safe){
				var t0 = this._rules, r, k, v, i = 0, j = t0.length;
				v = result.value, msg.msg = '';
				while(i < j){
					if(r = t0[i++].check(v, safe, msg)){
						result.msg = 'ok', v = r;
					}else{
						result.msg = msg.msg || 'invalid value:' + result.key + ' = ' + k,
						result.ok = 0;
					}
					if(i < j && t0[i++] == '|' && !r) result.ok = 1;
					if(!result.ok) return result;
				}
				result.value = safe[result.key] = v;
			}
		);
		return RuleSet;
  	})(),
	Vali = (function(){
		var Vali = function(){this.r = {}, this._rules = {};};
		Vali.prototype.bsImmutable(
			'ruleSet', function(k, v){this._rules[k] = v;},
			'validate', function(data, isPartial){
				var rules, result, values, ok, ruleSet, r, i, j, k, v
				rules = this._rules, result = {}, values = {}, ok = 1;
				if(isPartial){
					for(k in data) if(data.hasOwnProperty(k)){
						rules[k].check(result[k] = r = {key:k, value:data[k], ok:1}, values);
						if(!r.ok) ok = 0;
					}
				}else{
					for(k in rules) if(rules.hasOwnProperty(k)){
						result[k] = r = {key:k, ok:1};
						if(k in data) r.value = data[k], rules[k].check(r, values);
						else r.ok = 0, r.msg = 'no data:' + k;
						if(!r.ok) ok = 0;
					}
				}
				return this.r.ok = ok, this.r.result = result, this.r.values = values, this.r;
			}
		);
		return Vali;
	})(),
	bs.bsImmutable(
	'OR', '||',
	'rule', (function(){
		var mk = function(k){return function(){return new Rule(k);};};
		return function(){
			var a = arguments, i, j;
			i = 0, j = a.length;
			while(i < j) RULE[a[i++]] = mk(a[i++]);
		};
	})(),
	'msg', function(){
		var a = arguments, i = 0, j = a.length;
		while(i < j) MSG[a[i++]] = a[i++];
	},
	'validate', (function(){
		var cache = {}, tags = 'INPUT,TEXTAREA,SELECT'.split(','), stack = {length:0},
			idx = function(el){
				var i = 0;
				while(el = el.previousSibling) i++;
				return i;
			};
		return function(el, group, partial){
			var cacheKey, vali, data, i, k, v;
			if(!(cacheKey = el.getAttribute('data-cache')) || !cache[cacheKey] || !(v = cache[cacheKey][group])){
				vali = new Vali, data = {}, stack.length = 0;
				if((v = el.getAttribute('data-vali')) && (v = v.trim()) && domGroup(el) == group){
					i = v.indexOf(','),
					vali.ruleSet(k = v.substring(0, i), new RuleSet().rule(v.substr(i + 1))),
					data[k] = el;
				}
				el = el.firstElementChild;
				do{
					if(v = el.firstElementChild) stack[stack.length++] = v;
					if(v = el.nextElementSibling) stack[stack.length++] = v;
					if((v = el.getAttribute('data-vali')) && (v = v.trim()) && domGroup(el) == group){
						i = v.indexOf(','),
						vali.ruleSet(k = v.substring(0, i), new RuleSet().rule(v.substr(i + 1))),
						data[k] = el;
					}
				}while(stack.length && (el = stack[--stack.length]))
				v = {vali:vali, data:data};
				if(cacheKey) (cache[cacheKey] || (cache[cacheKey] = {}))[group] = v;
			}
			data = {};
			for(k in v.data) if(v.data.hasOwnProperty(k) && (!partial || partial.indexOf(k) != NONE)){
				el = v.data[k];
				data[k] = el.S(tags.indexOf(el.tagName) == NONE  ? 'html' : '@value');
			}
			return v.vali.validate(data, partial);
		};
	})()
	);
	(function(){
		var reg = {
			'ip':	 	/^((([0-9])|(1[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-9])|(1[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
			'url':	 	/^^https?:[/][/][a-zA-Z0-9.-]+[.]+[A-Za-z]{2,4}([:][0-9]{2,4})?/, 
			'email': 	/^[0-9a-zA-Z-_.]+@[0-9a-zA-Z-]+[.]+[A-Za-z]{2,4}$/,
			'korean':	/^[ㄱ-힣]+$/, 
			'japanese':	/^[ぁ-んァ-ヶー一-龠！-ﾟ・～「」“”‘’｛｝〜−]+$/,
			'alpha':	/^[a-z]+$/, 
			'ALPHA':	/^[A-Z]+$/, 
			'num':		/^-?[0-9.]+$/, 
			'alphanum':	/^[a-z0-9]+$/,
			'1alpha':	/^[a-z]/,
			'1ALPHA':	/^[A-Z]/
		}, f = {
			'equalto':	function(v, a, safe){return v == safe[a[0]] ? v : 0;},
			'max':		function(v, a){return v.length < a[0] ? v : 0;},
			'?max':		function(v, a){return v !== null && v.length < a[0] ? v : 0;},
			'min':		function(v, a){return v.length > a[0] ? v : 0;},
			'?min':		function(v, a){return v !== null && v.length > a[0] ? v : 0;},
			'length':	function(v, a){return v.length == a[0] ? v : 0;},
			'?length':	function(v, a){return v !== null &&  v.length == a[0] ? v : 0;},
			'range':	function(v, a){return a[0] <= v.length && v.length <= a[1] ? v : 0;},
			'?range':	function(v, a){return v !== null && a[0] <= v.length && v.length <= a[1] ? v : 0;},
			'float':	function(v, a){return '' + parseFloat(v) === v ? v : 0;}, 
			'?float':	function(v, a){return v !== null && '' + parseFloat(v) === v ? v : 0;}, 
			'int':		function(v, a){return '' + parseInt(v, 10) === v ? v : 0;},
			'?int':		function(v, a){return v !== null && '' + parseInt(v, 10) === v ? v : 0;},
			'in':		function(v, a){return a.indexOf(v) > -1 ? v : 0;},
			'?in':		function(v, a){return v !== null && a.indexOf(v) > -1 ? v : 0;},
			'notin':	function(v, a){return a.indexOf(v) == -1 ? v : 0;},
			'?notin':	function(v, a){return v !== null && a.indexOf(v) == -1 ? v : 0;},
			'indexof':	function(v, a){
				var i = a.length, j = 0;
				while(i--) if(v.indexOf(a[i]) == -1) j = 1;
				return j ? 0 : v;
			},
			'ssn':(function(){
				var r = /\s|-/g, key = [2,3,4,5,6,7,8,9,2,3,4,5];
				return function(v, a){
					var t0 = v.replace( r, '' ), t1, i;
					if( t0.length != 13 ) return;
					for( t1 = i = 0 ; i < 12 ; i++ ) t1 += key[i] * t0.charAt(i);
					return parseInt( t0.charAt(12) ) == ( ( 11 - ( t1 % 11 ) ) % 10) ? v : 0;
				};
			})(),
			'biz':(function(){
				var r = /\s|-/g, key = [1,3,7,1,3,7,1,3,5,1];
				return function(v, a){
					var t0, t1, t2 = v.replace( r, '' ), i;
					if( t2.length != 10 ) return;
					for( t0 = i = 0 ; i < 8 ; i++ ) t0 += key[i] * t2.charAt(i);
					t1 = "0" + ( key[8] * t2.charAt(8) ), t1 = t1.substr( t1.length - 2 ),
					t0 += parseInt( t1.charAt(0) ) + parseInt( t1.charAt(1) );
					return parseInt( t2.charAt(9) ) == ( 10 - ( t0 % 10)) % 10 ? v : 0;
				};
			})()
		}, k, mk;
		mk = function(k){return function(v, a, safe){return reg[k].test(v) ? v : 0;};};
		for(k in reg) bs.rule(k, mk(k));
		for(k in f) bs.rule(k, f[k]);
	})();
})();