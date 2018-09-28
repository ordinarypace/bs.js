const style = (()=>{
const prefix = 'webkit,Moz,chrome,ms'.split(','), r = /-[a-z]/g, re = v=>v[1].toUpperCase();
const bodyStyle = doc.body.style, keys = {};
const key = k=>{
  let i, j, v, t;
  if(k[0] == '-') k = k.substr(k.indexOf('-', 1) + 1);
  v = k.replace(r, re);
  if(v in bodyStyle) return keys[k] = v;
  else{
    v = v[0].toUpperCase() + v.substr(1);
    for(i = 0, j = prefix.length; i < j; i++){
      if((t = prefix[i] + v) in bodyStyle) return keys[k] = t;
    }
  }
  return keys[k] = null;
};
const style = (el, k, v)=>{
  if(!(k = keys[k] || key(k))) return;
  if(v === null) delete el.style[k];
  else el.style[k] = v;
};
return style;
})();