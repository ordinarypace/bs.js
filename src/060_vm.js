const VM = (()=>{
const key = O(null, 'key', 'k', 'k', 'k', 'data', 'd', 'd', 'd', 'arg', 'a', 'a', 'a', 'tmpl', 't', 't', 't');
return O(null, 'a', null,
init, method(json){
  const prop = O(LIST), stat = O(LIST);
  let k, v, s;
  VM[this.uuid = bs.uuid()] = this;
  for(k in json){
    v = json[k];
    if(s = key[k]){
      this[s] = v;
      if(s == 'k') this.vms = O(LIST);
    }else if(k.substr(0, 2) == 'on') stat[stat.len++] = '~' + k.substr(2), stat[stat.len++] = [v, this.uuid];
    else{
      s = v[1] == '{' ? prop : stat;
      s[s.len++] = k, s[s.len++] = v;
    }
  }
  if(prop.len) this.prop = prop, this.oldProp = O();
  if(stat.len) this.stat = stat;
},
newEL, method(el){
  let stat, i, j, k, v;
  this.el = el;
  if(this.k) el.bsKey = this.k;
  if(this.d && el.firstChild) el.innerHTML = '';
  if(this.prop) el.bsOldProp = O();
  if(stat = this.stat){
    i = 0, j = stat.len;
    while(i < j){
      k = stat[i++], v = stat[i++];
      #trait(elSet)
    }
  }
},
render, method(p){
  let el, elv, i, j, k, v;
  if(p && p != this.p){
    el = this.p = p;
    if(v = this.pos){
      i = v.len;
      while(i-- && (el = el.firstElementChild)){
        j = v[i];
        while(j--) el = el.nextElementSibling;
      }
    }
    this.newEL(el);
  }else el = this.el;
  if(p = this.prop){
    elv = el.bsOldProp, i = 0, j = p.len;
    while(i < j){
      k = p[i++], v = bs(p[i++]);
      if(typeof v == 'function') v = v();
      if(v !== elv[k]){
        elv[k] = v;
        #trait(elSet)
      }
    }
  }
  if((v = bs(this.d)) && (v = typeof v == 'function' ? v.apply(null, VAL(this.a)) : v)){
    v.PARENT = vmData;
    vmData = v instanceof Array ? v : [v];
    if(vmData.length && vmData[0].INFO) vmData.INFO = vmData[0];
    TMPL.$render(el, this.t);
    vmData = v.PARENT;
  }else if(v = this.vms){
    i = v.len;
    while(i--) v[i].render(el);
  }
});
})();