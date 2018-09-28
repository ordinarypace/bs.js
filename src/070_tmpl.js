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
    const type = v[0];
    v = v.substr(1);
    r[type == '+' ? 'p' : 'd'].push(nf[v] || (nf[v] = new Function('i,j', 'return ' + v)));
  });
  return r;
};
const keys = 'empty,header,footer,body'.split(',');
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
    default:a = O();
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
init, ()=>{
  let el, i, j, k, v;
  this.isInited = true;
  i = keys.length;
  while(i--) if(v = this[k = keys[i]]){
    switch(k){
    case'header':case'footer':
      el = EL(k);
      el.className = 'bs-tmpl-' + k;
      break;
    case'empty':
      el = EL('section');
      el.className = 'bs-tmpl-empty';
      break;
    default: el = null;
    }
    v.el = el, j = v.len;
    while(j--){
      if(el) el.appendChild(v[j].el.cloneNode(true));
      else v[j].vm = bs.scan(v[j].el);
    }
    if(el) v.vm = bs.scan(el);
  }
},
render, (p, H, F, E)=>{
  const vm = vmData, old = p.bsTmpl || (p.bsTmpl = O());
  let body, el, i, j, i0, j0, k, v, t, nth, m, tmpl, ti, tj, r, o, oren, render;
  if(!this.isInited) this.init();
  if(j = vm.length){
    #trait tmpl0
    if(t = old.header) t.style.display = k;
    if(t = old.body) t.style.display = k;
    if(t = old.footer) t.style.display = k;
    if(t = old.empty) t.style.display = v;
    #end tmpl0
    k = 'block', v = 'none'; #trait(tmpl0)
    #trait tmpl1
    t = v ? TMPL[v] : this;
    if(v = t[k]){
      if(!t.isInited) t.init();
      if(!old[k]) p.appendChild(old[k] = v.el.cloneNode(true));
      el = old[k];
      if(t = t.vm) t.render(el);
      #body
    }
    #end tmpl1
    k = 'header', v = H;#trait(tmpl1)
    if(!old.body){
      old.vm = [];
      old.render = [];
      p.appendChild(old.body = body = EL('section'));
      body.className = 'bs-tmpl-body';
    }else body = old.body;
    oren = old.render, o = oren.length, r = 0;
    for(render = [], i = 0, el = null; i < j; i++){
      vmData = vm[i], vmData.PARENT = vm;
      tmpl = vmData['@tmpl'] || this.k;
      if(typeof tmpl == 'string') tArr[0] = tmpl, tmpl = tArr;
      for(ti = 0, tj = tmpl.length; ti < tj; ti++){
        t = TMPL[tmpl[ti]];
        if(!t.isInited) t.init();
        t = t.body;
        for(i0 = 0, j0 = t.len; i0 < j0; i0++){
          k = t[i0], nth = k.nth;
          if(typeof nth[i] == 'boolean' ? nth[i] : isPresent(nth, i, j)){
            if(r < o){
              el = el ? el.nextElementSibling : body.firstElementChild;
              if(old.render[r] != k){
                body.replaceChild(m = k.pull() || k.el.cloneNode(true), el);
                old.render[r].push(el);
                el = m;
              }
            }else body.appendChild(el = k.pull() || k.el.cloneNode(true));
            if(m = k.vm){
              if(k.d &&(v = bs(k.d)(vmData, i))) v.PARENT = vm, v.ORIGIN = vmData, vmData = v;
              m.render(el);
            }
            render[r++] = k;
          }
        }
      }
    }
    for(; r < o; r++){
      oren[r].push(m = el.nextElementSibling);
      body.removeChild(m);
    }
    old.vm = vmData = vm;
    old.render = render;
    k = 'footer', v = F; #trait(tmpl1)
  }else{
    k = 'empty', v = E;
    #trait tmpl1{
      k = 'none', v = 'block'; #trait(tmpl0)
      old.body = [];
    #}
  }
});
add('<div></div>', '');
return TMPL;
})();