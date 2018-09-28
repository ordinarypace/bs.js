bs.isMobile = ((a)=>{
  a = a + '';
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4));
})(navigator && navigator.userAgent||navigator.vendor||window.opera);
!()=>{
  const mk = function(m){
    const t = O(null);
    return m = Math[m], r=>t[r] || t[r] === 0 ? 0 : (t[r] = m(r));
  };
	bs.rand = (a, b)=>parseInt(Math.random() * (b - a + 1)) + a;
	bs.randf = (a, b)=>Math.random() * (b - a) + a;
  'sin,cos,tan,atan'.split(',').forEach( v=>{bs[v] = mk(v);});
	bs.toradian = Math.PI / 180, bs.toangle = 180 / Math.PI;
  const uuid = '3b99e3e0-7598-11e8-90be-95472fb3ecbd'.split('-');
  bs.uuid = ()=>{
    let r = '', i, j;
    for(i = 0, j = uuid.length - 1; i < j; i++) r += Math.random().toString(16).substr(2, uuid[i].length) + '-';
    r += Date.now().toString(16).substr(0, uuid[j].length);
    return r.substr(1);  
  };
}();
!()=>{
	const encode = encodeURIComponent, decode = decodeURIComponent, mk = target=>{
		const cache = {};
		return v=>{
			const query = v || location[target].substr(1);
      let t0, t1, i, j;
			if(!query) return;
			if(!cache[query]){
				t0 = query.split('&'), i = t0.length, t1 = {};
				while(i--) t0[i] = t0[i].split('='), t1[decode(t0[i][0])] = decode(t0[i][1]);
				cache[query] = t1;
				cache[query].__full = query;
			}
			return cache[query];
		};
	};
	bs.encode = encode, bs.decode = decode;
	bs.queryString = mk('search'), bs.hash = mk('hash');
	bs.ck = (key)=>{//, val, expire, path
		var t0, t1, t2, i, j, v;
		t0 = doc.cookie.split(';'), i = t0.length;
		if(arguments.length == 1){
			while(i--) if(t0[i].substring(0, j = t0[i].indexOf('=')).trim() == key) return decode(t0[i].substr(j + 1).trim());
			return null;
		}else{
			v = arguments[1], t1 = key + '=' + encode(v) + ';domain=' + doc.domain + ';path=' + (arguments[3] || '/');
			if(v === null) t0 = new Date, t0.setTime(t0.getTime() - 86400000), t1 += ';expires=' + t0.toUTCString();
			else if(arguments[2]) t0 = new Date, t0.setTime(t0.getTime() + arguments[2] * 86400000), t1 += ';expires=' + t0.toUTCString();
			return doc.cookie = t1, v;
		}
	};
}();
