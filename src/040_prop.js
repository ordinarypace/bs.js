const prop = O(null,
@, (el, k, v)=>{v === null ? el.removeAttribute(k) : el.setAttribute(k, v);},
~, (el, k, v)=>{EV.$add(el, k, v);},
*, (el, k, v)=>{(el.bsData || (el.bsData = O()))[k] = v;},
+class, (el, v)=>{
  const cls = el.className.trim();
  if(cls.split(' ').indexOf(v) == -1) el.className = cls + ' ' + v;
},
-class, (el, v)=>{
  const cls = el.className.trim().split(' '), i = cls.indexOf(v);
  if(i != -1){
    cls.splice(i, 1);
    el.className = cls.join(' ');
  } 
},
class, (el, v)=>{el.className = v || '';},
html, (el, v)=>{el.innerHTML = v || '';},
+html, (el, v)=>{el.innerHTML = (v || '') + el.innerHTML;},
html+, (el, v)=>{el.innerHTML += v || '';},
submit, (el)=>{el.submit();},
focus, (el)=>{el.focus();},
blur, (el)=>{el.blur();},
checked, (el, v)=>{el.checked = v ? true : null;},
selected, (el, v)=>{el.selected = v ? true : null;},
style, (el, v)=>{
  const s = el.style;
  let i, k;
  if(typeof v == 'string'){
    if(v){
      v = v.split(';');
      if(i = v.length) while(i--){
        k = v[i].split(':');
        s[k[0].trim()] = k[1].trim();
      }
    }
  }else for(k in v) own.call(v, k) && (s[k] = v[k]);
},
value, (el, v)=>{
  v === null ? el.removeAttribute('value') : el.setAttribute('value', v);
  v === null ? delete el.value : (el.value = v);
}
);