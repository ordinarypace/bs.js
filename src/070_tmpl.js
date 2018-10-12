const TMPL = (()=>{
const nf = O(null,
even, (i, j)=>{return !(i & 1);},
odd, (i, j)=>{return i & 1;},
first, (i, j)=>{return !i;},
last, (i, j)=>{return i == j - 1;},
all, (i, j)=>{return true;}
);
const nthf = v=>{
  const r = O(null, 'p', [], 'd', []);
  if(!v) v = '+all';
  v.split(',').forEach((v)=>{
    v = v.trim();
    const type = v[0];
    v = v.substr(1);
    r[type == '+' ? 'p' : 'd'].push(nf[v] || (nf[v] = new Function('i,j', 'return ' + v)));
  });
  return r;
};
const keys = 'header,footer,body'.split(',');
const isPresent = (nth, i, j)=>{
  let m, n;
  for(m = 0, n = nth.p.length; m < n; m++){
    if(nth.p[m](i, j)){
      for(m = 0, n = nth.d.length; m < n; m++) if(nth.d[m](i, j)) return nth[i] = false;
      return nth[i] = true;
    }
  }
  return nth[i] = false;
};
const add = (el, key, role, nth, d)=>{
  let tmpl, i, j, k;
  if(typeof el == 'string') el = t2h(el.trim());
  role = keys.indexOf(role) != -1 ? role : 'body';
  nth = role == 'body' && nthf(nth);
  key = key.split(','), i = key.length;
  while(i--){
    k = key[i], k = TMPL[k] || (TMPL[k] = O(TMPL, 'k', k));
    k.isInited = false;
    tmpl = k[role] || (k[role] = O(LIST));
    tmpl[tmpl.len++] = O(LIST, 'el', el, 'nth', nth, 'd', d);
  }
};
const CLONE = O(LIST,
render, method(){
  let i = this.len, k, el;
  while(i--){
    k = this[i], el = k.el;
    if(k = k.vm) k.render(el);
  }
});
const tArr = [];
const TMPL = O(null,
$add, add,
$scan, p=>{
  const attr = 'data-tmpl';
  let el, s, a, i, j, k, l;
  for(s = p.querySelectorAll('[' + attr + ']'), i = p.hasAttribute(attr) ? -1 : 0, j = s.length; i < j; i++){
    el = i == -1 ? p : s[i];
  #trait attr0
    a = el.getAttribute(attr) || '';
    el.removeAttribute(attr);
    switch(a[0]){
    case'@':case'.':a = bs(a); break;
    case'{':a = (new Function('', 'return ' + a))(); break;
    default:a = !a ? O() : a.indexOf(':') != -1 ? (new Function('', 'return {' + a + '}'))() : {k:a};
    }
  #end attr0
  #trait(attr0)
    el.parentNode.removeChild(el);
    k = (a.key || a.k).split(','), l = k.length;
    while(l--) add(el, k[l], a.role, a.nth, a.data || a.d);
  }
},
$render, (el, k)=>{
  k = k || '';
  if(typeof k == 'string'){
    if(k = TMPL[k]) k.render(el);
    else throw 'invalid tmpl:' + k;
  }else TMPL[''].render(el, k.header, k.footer, k.empty);
},
init, method(){
  let el, i, j, k, v;
  this.isInited = true;
  i = keys.length;
  while(i--) if(v = this[k = keys[i]]){
    j = v.len;
    while(j--) v[j].vm = bs.scan(v[j].el);
  }
},
clone, method(p, k){
  const pk = 'bs' + k[0].toUpperCase() + k.substr(1).toLocaleLowerCase();
  const begin = p[pk + 'Begin'] = p.appendChild(doc.createComment(k + 'Begin(' + this.k + ')'));
  const end = p[pk + 'End'] = p.appendChild(doc.createComment(k + 'End(' + this.k + ')'));
  k = this[k];
  const r = O(CLONE, 'begin', begin, 'end', end);
  let i = r.len = k.len, el, vm;
  while(i--){
    el = k[i].el.cloneNode(true);
    r[i] = O(null, 'k', this.k, 'i', i, 'el', el, 'vm', vm = k[i].vm);
    if(vm) vm.render(el);
    p.insertBefore(el, end);
  }
  return r;
},
render, method(p, H, F, E){
  if(!p.bsTmpl || (p.bsBodyBegin && p.bsBodyBegin.parentNode != p)){
    p.bsTmpl = O();
    p.innerHTML = '';
  }
  const vm = vmData, info = vm.INFO, old = p.bsTmpl;
  let body, el, i, j, i0, j0, k, v, t, nth, m, tmpl, ti, tj, r, o, idx, cnt, comment, bodyEnd, isEnd;
  if(!this.isInited) this.init();
  j = vm.length;
  #trait tmpl1
  if((t = TMPL[v] || this) && t[k]){
    if(!t.isInited) t.init();
    if(!old[k]) old[k] = t.clone(p, k);
    old[k].render();
  }
  #end tmpl1
  k = 'header', v = H;#trait(tmpl1)
  if(!old.body) old.body = O(null, 
    'begin', p.bsBodyBegin = p.appendChild(doc.createComment('bsBodyBegin(' + this.k + ')')), 
    'end', p.bsBodyEnd = p.appendChild(doc.createComment('bsBodyEnd(' + this.k + ')'))
  );
  bodyEnd = old.body.end;
  for(i = info ? 1 : 0, cnt = j - i, el = old.body.begin, idx = 0; i < j; i++, idx++){
    vmData = vm[i], vmData.PARENT = vm.PARENT, vmData.INFO = info, vmData.IDX = idx, vmData.CNT = cnt;
    tmpl = vmData['@tmpl'] || this.k;
    if(typeof tmpl == 'string') tArr[0] = tmpl, tmpl = tArr;
    for(ti = 0, tj = tmpl.length; ti < tj; ti++){
      t = TMPL[tmpl[ti]];
      if(!t.isInited) t.init();
      t = t.body;
      for(i0 = 0, j0 = t.len; i0 < j0; i0++){
        k = t[i0], nth = k.nth;
        if(typeof nth[i] == 'boolean' ? nth[i] : isPresent(nth, i, j)){
          if(!isEnd){
            el = el.nextSibling;
            if(el == bodyEnd){
              isEnd = true;
              p.insertBefore(el = k.pull() || k.el.cloneNode(true), bodyEnd);
            }else{
              v = el.bsRendered;
              if(v != k){
                v.push(el);
                p.replaceChild(m = k.pull() || k.el.cloneNode(true), el);
                el = m;
              }
            }
          }else p.insertBefore(el = k.pull() || k.el.cloneNode(true), bodyEnd);
          if(!el.bsRendered) el.bsRendered = k;
          if(m = k.vm){
            if(k.d &&(v = bs(k.d)(vmData, i))) vmData = v, vmData.PARENT = vm.PARENT, vmData.INFO = info, vmData.IDX = idx, vmData.CNT = cnt;
            m.render(el);
          }
        }
      }
    }
  }
  while((el = el.nextSibling) && el != bodyEnd) el.bsRendered.push(el), p.removeChild(el);
  k = 'footer', v = F; #trait(tmpl1)
});
add('<div data-bs="html:\'.{v}\'"></div>', '', '', '', '');
return TMPL;
})();