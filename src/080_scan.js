const VMS = O();
bs.scan = p=>{
  if(!p) p = doc.body;
  const attr = 'data-bs';
  let s, el, vm, vms, pos, prev, idx, r, t, a;
  let i, j, k, v;
  if(p.hasAttribute && p.hasAttribute('data-tmpl') || p.querySelectorAll('[data-tmpl]').length) TMPL.$scan(p);
  t = O(LIST);
  s = p.querySelectorAll('[' + attr + ']'), i = s.length;
  r = O(VM, 'el', p);
  if(p == doc.body || p.hasAttribute && p.hasAttribute(attr)) i++;
  while(i--){
    el = s[i] || p;
    #trait(attr0)
    t[t.len++] = vm = el == p ? r : O(VM, 'el', el);
    if(el == doc.body) a.k = 'BODY';
    vm.init(a);
    if(k = vm.k) VMS[k] = vm;
  }  
  i = t.len;
  while(i--){
    vm = t[i], pos = O(LIST), el = vm.el, j = 0;
    if(el == p) vm.newEL(el);
    else do{
      idx = 0, prev = el;
      while(prev = prev.previousElementSibling) idx++;
      pos[pos.len++] = idx;
      el = el.parentNode;
      vms = el == p ? r : el ? VMS[el.k] : 0;
      if(vms){
        vms = vms.vms || (vms.vms = O(LIST));
        vm.p = el, vm.pos = pos, vm.newEL(vm.el);
        vms[vms.len++] = vm;
        break;
      }
    }while(el && j++ < 100);
  }
  return r;
}
bs.vm = k=>VMS[k || 'BODY'];
bs.tmpl = (el, key, role, nth, emptyType)=>{
  TMPL.$add(el, key, role, nth, emptyType);
};
bs.TMPL = k=>TMPL[k];
bs.render = k=>VMS[k || 'BODY'].render();
/*end*/}();