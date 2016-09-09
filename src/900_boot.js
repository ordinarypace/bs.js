bs.boot = function(){
	var s, style, i;
	s = doc.getElementsByTagName('style'), i = s.length;
	while(i--){
		style = s[i];
		if(!style.getAttribute('data-ignore') && !style.getAttribute('data-boot')){
			style.setAttribute('data-boot', 'processed');
			(style.styleSheet || style.sheet).disabled = true;
			bs.css(style['styleSheet'] ? style.styleSheet.cssText : style.innerHTML);
		}
	}
	s = null;
};