const doc = W.document;if(doc)!()=>{
  
const EL = tag=>{
  const el = typeof tag == 'string' ? doc.createElement(tag.trim()) : tag, a = arguments;
  let i = 1, j = a.length, k, v;
  while(i < j){
    k = a[i++], v = a[i++];
    #trait elSet
    prop[k] ? prop[k](el, v) : prop[k[0]] ? prop[k[0]](el, k.substr(1), v) : style(el, k, v);
    #end elSet
    #trait(elSet)
  }
  return el;
};
const t2h = (()=>{
  const table = EL('table'), body = EL('body'), select = EL('select');
  return txt=>{
    const tag = txt.substring(1, txt.indexOf('>')).split(' ')[0].toUpperCase();
    let k, v, depth;
    #trait t2h
    k.innerHTML = txt, v = k;
    while(v = v.firstElementChild) if(v.tagName == tag) return v; else if(!depth) break;
    #end t2h
    k = body, depth = false; #trait(t2h)
    k = table, depth = true; #trait(t2h)
    k = select, depth = true; #trait(t2h)
    throw 'invalid tag:' + txt;
  };
})();
!()=>{
  const el = EL('style');
  doc.head.appendChild(el);
  (el.styleSheet || el.sheet).cssText = (
    'abbr,article,aside,audio,bdi,canvas,data,datalist,'+
    'details,figcaption,figure,footer,header,hgroup,'+
    'main,mark,meter,nav,output,progress,section,summary,template,time,video'
  ).split(',').reduce((p, c)=>{return p + (EL(c) instanceof HTMLUnknownElement ? ',' + c : '');}, '').substr(1) +
  '{display:block;margin:0;padding:0}\n[data-tmpl]{display:none}';
}();