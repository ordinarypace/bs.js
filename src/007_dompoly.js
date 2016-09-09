//DOM
if(doc)(function(){
	var t = 'abbr,article,aside,audio,bdi,canvas,data,datalist,details,figcaption,figure,footer,header,hgroup,mark,meter,nav,output,progress,section,summary,time,video'.split(','),
		f = doc.createDocumentFragment(), i = t.length, j = 'createElement' in f;
	while(i--){
		docNew(t[i]);
		if(j) f.createElement(t[i]);
	}
	if(!docel['firstElementChild'] || !docel['nextElementSibling'])(function(){
		var k, o,
			mk = function(k0, k1){
				return function(){
					var el = this[k0];
					if(!el) return null;
					do if(el.nodeType == 1) return el; while(el = el[k1])
					return null;	
				};
			};
		for(k in o = {
			firstElementChild:mk('firstChild', 'nextSibling'),
			lastElementChild:mk('lastChild', 'previousSibling'),
			previousElementSibling:mk('previousSibling', 'previousSibling'),
			nextElementSibling:mk('nextSibling', 'nextSibling'),
			children:function(){
				var v = {length:0}, el = this.firtsNode;
				do if(el.nodeType == 1) v[v.length++] = el; while(el = el.nextSibling)
				return v;
			}
		}) if(o.hasOwnProperty(k)) if(!docel[k]) Object.defineProperty(Element.prototype, k, {get:o[k]});	
	})();
})();