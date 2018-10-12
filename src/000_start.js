!()=>{
  //https://raw.github.com/taylorhakes/promise-polyfill/master/dist/polyfill.min.js 8.0
  !(e,n)=>{"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){"use strict";function e(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})}function n(){}function t(e){if(!(this instanceof t))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],u(e,this)}function o(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,t._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var o;try{o=t(e._value)}catch(f){return void i(n.promise,f)}r(n.promise,o)}else(1===e._state?r:i)(n.promise,e._value)})):e._deferreds.push(n)}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var o=n.then;if(n instanceof t)return e._state=3,e._value=n,void f(e);if("function"==typeof o)return void u(function(e,n){return function(){e.apply(n,arguments)}}(o,n),e)}e._state=1,e._value=n,f(e)}catch(r){i(e,r)}}function i(e,n){e._state=2,e._value=n,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&t._immediateFn(function(){e._handled||t._unhandledRejectionFn(e._value)});for(var n=0,r=e._deferreds.length;r>n;n++)o(e,e._deferreds[n]);e._deferreds=null}function u(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e))},function(e){t||(t=!0,i(n,e))})}catch(o){if(t)return;t=!0,i(n,o)}}var c=setTimeout;t.prototype["catch"]=function(e){return this.then(null,e)},t.prototype.then=function(e,t){var r=new this.constructor(n);return o(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}(e,t,r)),r},t.prototype["finally"]=e,t.all=function(e){return new t(function(n,t){function o(e,f){try{if(f&&("object"==typeof f||"function"==typeof f)){var u=f.then;if("function"==typeof u)return void u.call(f,function(n){o(e,n)},t)}r[e]=f,0==--i&&n(r)}catch(c){t(c)}}if(!e||"undefined"==typeof e.length)throw new TypeError("Promise.all accepts an array");var r=Array.prototype.slice.call(e);if(0===r.length)return n([]);for(var i=r.length,f=0;r.length>f;f++)o(f,r[f])})},t.resolve=function(e){return e&&"object"==typeof e&&e.constructor===t?e:new t(function(n){n(e)})},t.reject=function(e){return new t(function(n,t){t(e)})},t.race=function(e){return new t(function(n,t){for(var o=0,r=e.length;r>o;o++)e[o].then(n,t)})},t._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){c(e,0)},t._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in l?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=e):l.Promise=t});
  //https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.4/fetch.min.js
  !(t)=>{"use strict";if(!t.fetch){var s={searchParams:"URLSearchParams"in t,iterable:"Symbol"in t&&"iterator"in Symbol,blob:"FileReader"in t&&"Blob"in t&&function(){try{return new Blob,!0}catch(t){return!1}}(),formData:"FormData"in t,arrayBuffer:"ArrayBuffer"in t};if(s.arrayBuffer)var e=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],r=function(t){return t&&DataView.prototype.isPrototypeOf(t)},o=ArrayBuffer.isView||function(t){return t&&-1<e.indexOf(Object.prototype.toString.call(t))};f.prototype.append=function(t,e){t=a(t),e=h(e);var r=this.map[t];this.map[t]=r?r+","+e:e},f.prototype.delete=function(t){delete this.map[a(t)]},f.prototype.get=function(t){return t=a(t),this.has(t)?this.map[t]:null},f.prototype.has=function(t){return this.map.hasOwnProperty(a(t))},f.prototype.set=function(t,e){this.map[a(t)]=h(e)},f.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},f.prototype.keys=function(){var r=[];return this.forEach(function(t,e){r.push(e)}),u(r)},f.prototype.values=function(){var e=[];return this.forEach(function(t){e.push(t)}),u(e)},f.prototype.entries=function(){var r=[];return this.forEach(function(t,e){r.push([e,t])}),u(r)},s.iterable&&(f.prototype[Symbol.iterator]=f.prototype.entries);var i=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];b.prototype.clone=function(){return new b(this,{body:this._bodyInit})},c.call(b.prototype),c.call(w.prototype),w.prototype.clone=function(){return new w(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},w.error=function(){var t=new w(null,{status:0,statusText:""});return t.type="error",t};var n=[301,302,303,307,308];w.redirect=function(t,e){if(-1===n.indexOf(e))throw new RangeError("Invalid status code");return new w(null,{status:e,headers:{location:t}})},t.Headers=f,t.Request=b,t.Response=w,t.fetch=function(r,n){return new Promise(function(o,t){var e=new b(r,n),i=new XMLHttpRequest;i.onload=function(){var t,n,e={status:i.status,statusText:i.statusText,headers:(t=i.getAllResponseHeaders()||"",n=new f,t.replace(/\r?\n[\t ]+/g," ").split(/\r?\n/).forEach(function(t){var e=t.split(":"),r=e.shift().trim();if(r){var o=e.join(":").trim();n.append(r,o)}}),n)};e.url="responseURL"in i?i.responseURL:e.headers.get("X-Request-URL");var r="response"in i?i.response:i.responseText;o(new w(r,e))},i.onerror=function(){t(new TypeError("Network request failed"))},i.ontimeout=function(){t(new TypeError("Network request failed"))},i.open(e.method,e.url,!0),"include"===e.credentials?i.withCredentials=!0:"omit"===e.credentials&&(i.withCredentials=!1),"responseType"in i&&s.blob&&(i.responseType="blob"),e.headers.forEach(function(t,e){i.setRequestHeader(e,t)}),i.send(void 0===e._bodyInit?null:e._bodyInit)})},t.fetch.polyfill=!0}function a(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.\^_|~]/i.test(t))throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function h(t){return"string"!=typeof t&&(t=String(t)),t}function u(e){var t={next:function(){var t=e.shift();return{done:void 0===t,value:t}}};return s.iterable&&(t[Symbol.iterator]=function(){return t}),t}function f(e){this.map={},e instanceof f?e.forEach(function(t,e){this.append(e,t)},this):Array.isArray(e)?e.forEach(function(t){this.append(t[0],t[1])},this):e&&Object.getOwnPropertyNames(e).forEach(function(t){this.append(t,e[t])},this)}function d(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function y(r){return new Promise(function(t,e){r.onload=function(){t(r.result)},r.onerror=function(){e(r.error)}})}function l(t){var e=new FileReader,r=y(e);return e.readAsArrayBuffer(t),r}function p(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function c(){return this.bodyUsed=!1,this._initBody=function(t){if(this._bodyInit=t)if("string"==typeof t)this._bodyText=t;else if(s.blob&&Blob.prototype.isPrototypeOf(t))this._bodyBlob=t;else if(s.formData&&FormData.prototype.isPrototypeOf(t))this._bodyFormData=t;else if(s.searchParams&&URLSearchParams.prototype.isPrototypeOf(t))this._bodyText=t.toString();else if(s.arrayBuffer&&s.blob&&r(t))this._bodyArrayBuffer=p(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer]);else{if(!s.arrayBuffer||!ArrayBuffer.prototype.isPrototypeOf(t)&&!o(t))throw new Error("unsupported BodyInit type");this._bodyArrayBuffer=p(t)}else this._bodyText="";this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):s.searchParams&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},s.blob&&(this.blob=function(){var t=d(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?d(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(l)}),this.text=function(){var t,e,r,o=d(this);if(o)return o;if(this._bodyBlob)return t=this._bodyBlob,e=new FileReader,r=y(e),e.readAsText(t),r;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),o=0;o<e.length;o++)r[o]=String.fromCharCode(e[o]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},s.formData&&(this.formData=function(){return this.text().then(m)}),this.json=function(){return this.text().then(JSON.parse)},this}function b(t,e){var r,o,n=(e=e||{}).body;if(t instanceof b){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new f(t.headers)),this.method=t.method,this.mode=t.mode,n||null==t._bodyInit||(n=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"omit",!e.headers&&this.headers||(this.headers=new f(e.headers)),this.method=(r=e.method||this.method||"GET",o=r.toUpperCase(),-1<i.indexOf(o)?o:r),this.mode=e.mode||this.mode||null,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&n)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(n)}function m(t){var n=new FormData;return t.trim().split("&").forEach(function(t){if(t){var e=t.split("="),r=e.shift().replace(/\+/g," "),o=e.join("=").replace(/\+/g," ");n.append(decodeURIComponent(r),decodeURIComponent(o))}}),n}function w(t,e){e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=200<=this.status&&this.status<300,this.statusText="statusText"in e?e.statusText:"OK",this.headers=new f(e.headers),this.url=e.url||"",this._initBody(t)}}("undefined"!=typeof self?self:this);
}();
!(W)=>{
"use strict"
const O = Object.freeze( p=>{
  let a = arguments, i = 1, j = a.length, r = Object.create(p || null);
  if(p) r.is = p; while(i < j) r[a[i++]] = a[i++];
  return r;
});
const LIST = O(null, 
len, 0, 
plen, 0,
pull, method(){return this.plen ? this[--this.plen] : 0;},
push, method(v){this[this.plen++] = v;}
);
const LAZY = Object.freeze(O());
let vmData;
const app = O(), bs =(()=>{
  const ex0 = /[@.]\{[^}]+\}/g, ex1 = /^(?:[#@.]\{|\.$)/, ex2 = /`/g;
  let isT;
  try{
    isT = (new Function('', 'return `a` === "a";'))();
  }catch(e){}
  return ()=>{
    let a = arguments, t, i = 0, j = a.length, k, v, m, n;
    while(i < j){
      t = app, k = a[i++];
      if(!k) return null;
      switch(k){
      case'.{SELF}': return vmData;
      default: 
        if(k.indexOf('...') > -1){
          k = k.split('...'), v = [];
          for(m = parseInt(k[0].trim(), 10), n = parseInt(k[1].trim(), 10); m <= n; m++) v.push({v:m});
          return v;
        }
      }
      if(k.indexOf('#{') == 0){
        k = k.substring(2, k.length - 1).replace(ex0, "bs('$&')");
        if(!isT) k = k.replace(ex2, "'");
        return (new Function('', 'return ' + k))();
      }
      if(k.indexOf('@{') == 0) k = k.substring(2, k.length - 1);
      else if(k.indexOf('.{') == 0) k = k.substring(2, k.length - 1), t = vmData;
      if(k.indexOf('.') != -1){
        k = k.split('.'), m = 0, n = k.length - 1;
        while(m < n){
          t = t[k[m++]];
          if(typeof t == 'string' && t.indexOf('@{') == 0) t = bs(t.substring(2, t.length - 1));
        }
        k = k[n];
      }
      if(i == j){
        if(!t) return null;
        v = t[k];
        if(typeof v == 'string' && ex1.test(v)) v = bs(v);
        else if(v && v.is == LAZY) v = v.f();
        return v;
      }else v = a[i++], v === null ? delete t[k] : t[k] = v;
    }
    return v;
  };
})();
bs.lazy = f=>O(LAZY, 'f', f);
!()=>{
  const lock = O();
  bs.lock = (k, f, t)=>{
    return ()=>{
      if(lock[k]) return;
      lock[k] = 1;
      if(t) setTimeout(()=>{lock[k] = 0;}, t);
      return f.apply(null, arguments);
    };
  };
  bs.unlock = (k, t)=>{t ? setTimeout(()=>{lock[k] = 0;}, t) : lock[k] = 0};
}();
const own = Object.prototype.hasOwnProperty;
const VAL = v=>{
  const st = VAL.st;
  let n, c, i, t;
  st.len = 0;
  st[st.len++] = n = O();
  n.c = VAL, n.k = 0, n.v = v;
  while(c = st[--st.len]){
    if(!c.v || typeof c.v != 'object'){ 
      c.c[c.k] = typeof c.v == 'string' && c.v[1] == '{' ? bs(c.v) : c.v;
    }else if(c.v instanceof Array){
      c.c[c.k] = t = [], i = c.v.length;
      while(i--){
        st[st.len++] = n = O();
        n.c = t, n.k = i, n.v = c.v[i];
      }
    }else{
      c.c[c.k] = t = O();
      for(i in c.v) if(own.call(v, i)){
        st[st.len++] = n = O();
        n.c = t, n.k = i, n.v = c.v[i];
      }
    }
  }
  return VAL[0];
};
VAL.st = O(LIST);