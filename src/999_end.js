Object.freeze(bs);
try{
  (new Function('bs', 'export bs;'))(bs);
}catch(e){}
if(W['module'] && module['exports']) module.exports = bs;
else W['bs'] = bs;
}(this);