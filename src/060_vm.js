const VM = O(null, 'a', null,
init, method(json){
  const prop = O(LIST), stat = O(LIST);
  let k, v, s;
  VM[this.uuid = bs.uuid()] = this;
  for(k in json){
    v = json[k];
    switch(k){
    case'key':case'k':this.k = v, this.vms = O(LIST);break;
    case'data':case'd':this.d = v;break;
    case'arg':case'a':this.a = v;break;    
    case'tmpl':case't':this.t = v;break;
    default:
      if(k.substr(0, 2) == 'on') stat[stat.len++] = '~' + k.substr(2), stat[stat.len++] = [v, this.uuid];
      else{
        s = v[1] == '{' ? prop : stat;
        s[s.len++] = k, s[s.len++] = v;
      }
    }
  }
  if(prop.len) this.prop = prop, this.oldProp = O();
  if(stat.len) this.stat = stat;
},
newEL, method(el){
  let p, i, j, k, v;
  this.el = el;
  el.k = this.k;
  if(this.prop) el.oldProp = O();
  if(p = this.stat){
    i = 0, j = p.len;
    while(i < j){
      k = p[i++], v = p[i++];
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
    elv = el.oldProp, i = 0, j = p.len;
    while(i < j){
      k = p[i++], v = bs(p[i++]);
      if(v !== elv[k]){
        elv[k] = v;
        #trait(elSet)
      }
    }
  }
  if((v = bs(this.d)) && (v = v.apply(null, this.a)) && (v instanceof Array)){
    v.PARENT = vmData;
    vmData = v;
    TMPL.$render(el, this.t);
    vmData = v.PARENT;
  }else if(v = this.vms){
    i = v.len;
    while(i--) v[i].render(el);
  }
});