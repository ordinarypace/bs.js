if('localStorage' in W) (function(){
var base, L = W['localStorage'];
bs.bsImmutable(
	'localSize', function(unit){
		var key, sum = 0; 
		for(key in L) sum += (key.length + (L[key].length || 0)) * 2; 
		switch(unit){
		case'kb':return sum / 1024;
		case'mb':return sum / 1024 / 1024;
		}
		return sum;
	},
	'local', base = function(){
		var t0, t1, i = 0, j = arguments.length, k, v, m, n;
		while(i < j){
			k = arguments[i++];
			if(i == j){
				if(t0 = localStorage.getItem(k)){
					if(t0.charAt(0) == '⒩'){
						for(t1 = '', m = 0, n = parseInt(t0.substr(1)); m < n; m++) t1 += localStorage.getItem(k + '::' + m);
						t0 = t1;
					}
					if(t0.charAt(0) == '@') t0 = JSON.parse(t0.substr(1));
				}
				return t0;
			}
			v = arguments[i++];
			if(v === null){
				t0 = localStorage.getItem(k);
				if(t0 && t0.charAt(0) == '⒩') for(m = 0, n = parseInt(t0.substr(1)); m < n; m++) localStorage.removeItem(k+'::'+m);
				localStorage.removeItem(k);
			}else{
				t0 = (v && typeof v == OBJ ? '@' + JSON.stringify(v) : v) + '', n = 0;
				while(1){
					try{
						if(!n) localStorage.setItem(k, t0);
						else for(localStorage.setItem(k, '⒩' + n), m = 0, t1 = Math.ceil(t0.length / n); m < n; m++){
							localStorage.setItem(k + '::' + m, t0.substr(t1 * m , t1));
						}
						break;
					}catch(e){
						n++;
					}
				}
			}
		}
		return v;
	}
);
})()