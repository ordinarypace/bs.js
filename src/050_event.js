const EV = (()=>{
const c2n = O(), n2c = O();
let scrollState = 0, n;
'a,65,b,66,c,67,d,68,e,69,f,70,g,71,h,72,i,73,j,74,k,75,l,76,m,77,n,78,o,79,p,80,q,81,r,82,s,83,t,84,u,85,v,86,w,87,x,88,y,89,z,90,back,8,tab,9,enter,13,shift,16,control,17,alt,18,pause,19,caps,20,esc,27,space,32,pageup,33,pagedown,34,end,35,home,36,left,37,up,38,right,39,down,40,insert,45,delete,46,numlock,144,scrolllock,145,0,48,1,49,2,50,3,51,4,52,5,53,6,54,7,55,8,56,9,57'.split(',').forEach(
 (v, idx)=>{
  if(!(idx & 1)) n = v; else n2c[n] = v = parseInt(v), c2n[v] = n;
});
const posCat = O(null,
'touchstart', 1, 'touchmove', 2, 'touchend', 3, 'mousedown', 4, 'mousemove', 5, 
'mouseup', 6, 'click', 6, 'mouseover', 6, 'mouseout', 6
);
bs.throttle = (rate, f)=>{
  const delay = ()=>{f.apply(null, a), timeOutId = -1;};
  let timeOutId = -1, next = 0, a;
  return function(){
    const curr = Date.now();
    a = arguments;
    if(next > curr){
      if(timeOutId == -1) timeOutId = setTimeout(delay, next - curr);
    }else{
      if(timeOutId != -1){
        clearTimeout(timeOutId);
        timeOutId = -1;
      }
      f.apply(null, a);
    }
    next = curr + rate;
  };
};
bs.debounce = (rate, f)=>{
  const delay = ()=>{f.apply(null, arguments), timeOutId = -1;};
  let timeOutId = -1, a;
  return function(){
    a = arguments;
    if(timeOutId){
      clearTimeout(timeOutId);
      timeOutId = -1;
    }
    timeOutId = setTimeout(delay, rate);
  };
};
const arg = O();
bs.on = (uuid, e, el, isPrevent)=>{
  let ev = el.bsEv, t, k;
  if(!ev) el.bsEv = ev = O(EV, '_pos', 0, 'vm', VM[uuid], 'target', el);
  ev.event = e, ev.type = t = e.type, ev.arg = arg[k = t + ":" + uuid] ? VAL(arg[k]) : null;
  if(posCat[t] == 1 || posCat[t] == 4) ev.pos();
  if(isPrevent) ev.prevent();
  return el.bsEv;
};
const absEV = O(null, 
down, bs.isMobile ? 'touchstart' : 'mousedown',
move, bs.isMobile ? 'touchmove' : 'mousemove',
up, bs.isMobile ? 'touchend' : 'mouseup',
c, 'click', 
d, 'down',
m, 'move',
u, 'up',
ku, 'keyup',
kd, 'keydown',    
ds, 'dragstart',
dr, 'drop',
de, 'dragenter',
dl, 'dragleave',
do, 'dragover'
);
const EV = O(null,
$add, (el, k, v)=>{
  let f, t, fk, target, l, lt, a, i, isPrevent = false;
  switch(k){
  case'drops':
    EV.$add(el, '-drop', v);
    EV.$add(el, '-dragenter', v);
    EV.$add(el, '-dragleave', v);
    EV.$add(el, '-dragover', v);
    return;
  case'event':case'ev':
    a = v[0].split(','), i = a.length;
    while(i--){
      a[i] = a[i].split(':');
      EV.$add(el, a[i][0].trim(), [a[i][1].trim(), v[1]]);
    }
    return;
  }
  if(k[0] == '-'){
    isPrevent = true;
    k = k.substr(1);
  }
  
  while(a = absEV[k]) k = a;
  if(k == 'dragstart') el.draggable = true;
  if(!('on' + k in doc.body)) return;
  
  if(typeof v[0] == 'string') target = v[0];
  else if(fk = v[0].k){
    if(arg[k + ":" + v[1]] = a = (v[0].a && v[0].a.slice(0)) || null){
      if(i = a.length) while(i--) if(typeof a[i] == 'string' && a[i].substr(0, 2) == '.{') a[i] = bs(a[i]);
    }
    if(l = v[0].l) lt = v[0].lt || 0;
    
#trait evadd0
      bs(target = bs.uuid(), (()=>{
        let F = O();
        return (e)=>{
          const f = bs(fk);
          if(!F[f.___k]) F[f.___k = bs.uuid()] = #body
          F[f.___k](e);
        };
      })());
#end evadd0

    if(t = v[0].t){
      #trait evadd0{ bs.throttle(t, l ? bs.lock(l, f, lt) : f); #}
    }else if(t = v[0].d){
      #trait evadd0{ bs.debounce(t, l ? bs.lock(l, f, lt) : f); #}
    }else if(l){
      #trait evadd0{ bs.lock(l, f, lt); #}
    }else target = fk;
  }else throw 'invalid event:' + console.log(v);
  el.setAttribute('on' + k, "bs('" + target + "')(bs.on('" + v[1] + "', event, this, " + isPrevent + "))");
},
wheelDelta, method(){
  const e = this.event, n = 225, n1 = n - 1, w = e['wheelDelta'] ? e.wheelDelta : -e.deltaY * 20;
  let d = e.detail, f;
  d = d ? w && (f = w/d) ? d/f : -d/1.35 : w/120;
  d = d < 1 ? d < -1 ? (-d * d - n1) / n : d : (d * d + n1) / n / 2;
  if(d < -1) d = -1;
  else if(d > 1) d = 1;
  return d;
},
key, method(k){
  const e = this.event;
  switch(k){
  case'ctrl':return e.metaKey || e.ctrlKey;
  case'shift':return e.shiftKey;
  case'button':return e.button;
  default:return e.keyCode == n2c[k];
  }
},
dropEffect, method(type){if(this.event.dataTransfer) this.event.dataTransfer.dropEffect = type;},
prevent, method(){this.event.preventDefault();},
value, method(){
  if(arguments.length) this.target.value = arguments[0];
  else return this.target.value.trim();
},
data, method(){
  const v = this.target.bsData;
  return !v ? null : arguments.length ? v[arguments[0]] : v;
},
prop, method(target, k){
  if(target = bs.vm(target).el) switch(k[0]){
  case'@':return target.getAttribute(k.substr(1));
  case'*':return this.target.bsData && (k == '*' ? this.target.bsData : this.target.bsData[k.substr(1)]);
  default:return target[k];
  }
},
pos, (()=>{
const docel = doc.documentElement;
const POS = O(null,
clientX, method(v){
  const ev = this.length ? this.touches[v || 0] : this.event;
  return ev.clientX - ev.target.getBoundingClientRect().left - (W.pageXOffset || docel.scrollLeft || 0);
},
clientY, method(v){
  const ev = this.length ? this.touches[v || 0] : this.event;
  return ev.clientY - ev.target.getBoundingClientRect().top - (W.pageYOffset || docel.scrollTop || 0);
});
  return method(){
    let pos, type, e, X, Y, id, t0, t1, t2, i, j, k, m;
    type = posCat[this.type];
    if(!type) return;
    if(!this._pos) this._pos = O(POS, 'touches', []);
    pos = this._pos, e = this.event, t0 = pos.touches, t0.length = 0;
    if(type < 4){
      t1 = '', i = 2;
      while(i--){
        t2 = i ? e.changedTouches : e.touches, j = t2.length;
        while(j--){
          id = t2[j].identifier, t1 += id + ' ', m = t0.length, k = 1;
          while(m--) if(t0[m].identifier == id){
            k = 0;
            break;
          }
          if(k) t0[t0.length] = t2[j];
        }
      }
      i = t0.length;
      while(i--){
        if(t1.indexOf(t0[i].identifier) == NONE) t0.splice(i, 1);
        else{
          t1 = t0[i], X = t1.pageX, Y = t1.pageY;
          if(type == 1) t1.startX = X, t1.startY = Y;
          else{
            t1.distanceX = X - t1.startX, t1.distanceY = Y - t1.startY,
            t1.moveX = X - t1.oldX, t1.moveY = Y - t1.oldY;
          }
          t1.oldX = X, t1.oldX = Y;
        }
      }
      if(t1 = t0[0]){
        pos.pageX = t1.pageX, pos.pageY = t1.pageY,
        pos.distanceX = t1.distanceX, pos.distanceY = t1.distanceY,
        pos.moveX = t1.moveX, pos.moveY = t1.moveY;
      }
    }else{
      pos.pageX = X = e.pageX, pos.pageY = Y = e.pageY;
      if(type == 4) pos.startX = X, pos.startY = Y;
      else{
        pos.distanceX = X - pos.startX, pos.distanceY = Y - pos.startY,
        pos.moveX = X - pos.oldX, pos.moveY = Y - pos.oldY;
      }
      pos.oldX = X, pos.oldY = Y;
    }
    if(type == 1 || type == 4) e.target.bsScrollState = scrollState;
    return pos;
  };
})()
);
bs.systemEvent = (()=>{
  const fs = O();
  return (type, k, f)=>{
    let v = fs[type], t;
    if(f === null){
      if(v) delete v[k];
    }else{
      if(!v){
        v = fs[type] = O();
        if(t = 'on' + type in W ? W : 'on' + type in doc ? doc : null){
          t['on' + type] = ()=>{
            let k;
            for(k in v) v[k]();
          };
        }
      }
    }
    v[k] = f;
  };
})();
bs.systemEvent('scroll', '__', ()=>{if(scrollState++>100000000) scrollState = 0;});
return EV;
})();