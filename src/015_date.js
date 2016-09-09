(function(){
	var zone = (new Date()).getTimezoneOffset() * 60000,
		_get = function(date, isUTC){
			var i, t0, h, m, s;
			if(typeof date == 'string'){
				if(date.indexOf('Z') != NONE && date.indexOf('T') != NONE){
					date = date.replace('Z', '').replace('T', ' ');
					isUTC = true;
				}
				i = date.split('-');
				if(i[2] && i[2].indexOf(' ') > -1){
					t0 = i[2].split(' '), i[2] = t0[0], t0 = t0[1].split(':'),
					t0[2] = t0[2].split('.');
					h = parseInt(t0[0], 10), m = parseInt(t0[1], 10), s = parseInt(t0[2][0], 10);
				}else h = m = s = 0;
				i = new Date(parseInt(i[0], 10), parseInt(i[1], 10) - 1, parseInt(i[2], 10), h, m, s);
				if(t0 && t0[2][1]) i.setTime(i.getTime() + parseInt(t0[2][1], 10));
			}else i = date instanceof Date ? date : new Date;
			if(isUTC) i.setTime(i.getTime() + zone);
			return i;
		},
		_leapYear = function(v){return (v% 4 == 0 && v % 100 != 0) || v % 400 == 0;},
		_date = function(part, date){
			var i;
			switch(part){
			case'Y':return date.getFullYear() + '';
			case'y':return i = _date('Y', date), i.substr(i.length - 2);
			case'm':return i = '00' + _date('n', date), i.substr(i.length - 2);
			case'n':return (date.getMonth() + 1) + '';
			case'd':return i = '00' + _date('j', date), i.substr(i.length - 2);
			case'j':return date.getDate() + '';
			case'H':return i = '00' + _date('G', date), i.substr(i.length - 2);
			case'h':return i = '00' + _date('g', date), i.substr(i.length - 2);
			case'G':return date.getHours() + '';
			case'g':return parseInt(date.getHours()) % 12 + '' || '0';
			case'i':return i = '00' + date.getMinutes(), i.substr(i.length - 2);
			case's':return i = '00' + date.getSeconds(), i.substr(i.length - 2);
			case'u':return date.getMilliseconds() + '';
			case'w':return prettyData[_ln].day[date.getDay()];
			default:return part;
			}
		},
		addKey = {y:'FullYear', m:'Month', d:'Date', h:'Hours', i:'Minutes', s:'Seconds', ms:'Milliseconds'},
		_diff, 
		prettyKey = 'second,minute,hour,day,month,year'.split(','), prettyData, _ln = detect.language;
		sys.date = prettyData = {};
	bs.bsImmutable(
	'date', _get,
	'dateAdd', function(k, v, d, isUTC){
		return (k = addKey[k]) ? (d = _get(d, isUTC), d['set' + k](d['get' + k]() + v), d) : err('DATE.add');
	},
	'dateDiff',_diff = function(interval, dateOld, isUTCOld, dateNew, isUTCNew){
		var date1, date2, d1_year, d1_month, d1_date, d2_year, d2_month, d2_date, i, j, k, d, year, month, order, temp;
		date1 = _get(dateOld, isUTCOld);
		date2 = _get(dateNew, isUTCNew);
		switch(interval.toLowerCase()){
		case'y':return date2.getFullYear() - date1.getFullYear();
		case'm':return (date2.getFullYear() - date1.getFullYear()) * 12 + date2.getMonth() - date1.getMonth();
		case'd':
			if(date2 > date1) order = 1;
			else order = -1, i = date1, date1 = date2, date2 = i;
			d1_year = date1.getFullYear(), d1_month = date1.getMonth(), d1_date = date1.getDate(),
			d2_year = date2.getFullYear(), d2_month = date2.getMonth(), d2_date = date2.getDate(),
			j = d2_year - d1_year, d = 0;
			if(j > 0){
				d += _diff('d', new Date(d1_year , d1_month, d1_date), new Date(d1_year, 11, 31));
				d += _diff('d', new Date(d2_year , 0, 1), new Date(d2_year, d2_month, d2_date));
				for(year = d1_year + 1, i = 1; i < j; i++, year++) d += _leapYear(year) ? 366 : 365;
			}else{
				temp = [31,28,31,30,31,30,31,31,30,31,30,31];
				if(_leapYear(d1_year)) temp[1]++;
				j = d2_month - d1_month;
				if(j > 0){
					d += _diff('d', new Date(d1_year , d1_month, d1_date), new Date(d1_year , d1_month, temp[d1_month])) + 1;
					d += _diff('d', new Date(d2_year , d2_month, 1), new Date(d2_year , d2_month, d2_date));
					month = d1_month + 1;
					for(i = 1; i < j; i++) d += temp[month++];
				}else d += d2_date - d1_date;
			}
			return d * order;
		case'h':return parseInt((date2.getTime() - date1.getTime()) / 3600000);
		case'i':return parseInt((date2.getTime() - date1.getTime()) / 60000);
		case's':return parseInt((date2.getTime() - date1.getTime()) / 1000);
		case'ms':return date2.getTime() - date1.getTime();
		default:return null;
		}
	},  
	'datePart', function(part, date, isUTC){
		var part, i, j, result;
		date = _get(date, isUTC), part = part || 'Y-m-d H:i:s', result = '';
		for(i = 0, j = part.length; i < j; i++) result += _date(part.charAt(i), date);
		return result;
	},
	'datePretty', function(targetDate, isUTC0, baseDate, isUTC1){
		var m = prettyData[_ln].pretty, t0, t1, v;
		targetDate = _get(targetDate, isUTC0),
		baseDate = _get(baseDate, isUTC1), 
		v = Math.round(+baseDate / 1000 - targetDate / 1000);
		if(v == 0) return m.now;
		if(v > 0) t0 = m.past;
		else if(v < 0){
			t0 = targetDate, targetDate = baseDate, baseDate = t0;
			t0 = m.future, v *= -1;
		}
		if(v < 60) t1 = m.second;
		else if((v = Math.round(v / 60)) < 60) t1 = m.minute;
		else if((v = Math.round(v / 60)) < 60) t1 = m.hout;
		else if((v = Math.round(v / 24)) < 30) t1 = m.day, v = _diff('d', targetDate, baseDate);
		else if(v < 365) t1 = m.month, v = _diff('m', targetDate, baseDate);
		else t1 = m.year, v = _diff('y', targetDate, baseDate);
		t1 = t1[v] || t1[t1.length - 1];
		return t0.ex('time', t1.ex('time', v));
	},
	'dateLang', function(v){_ln = v;},
	'dateTemplate', function(ln, v){
		var t0, i, k;
		if(v && typeof v == 'object' &&
			v.day instanceof Array && v.day.length == 7 &&
			v.pretty && typeof v.pretty == 'object' &&
			typeof v.pretty.now == 'string' &&
			typeof v.pretty.past == 'string' && v.pretty.past.indexOf('${time}') != NONE &&
			typeof v.pretty.future == 'string' && v.pretty.future.indexOf('${time}') != NONE
		){
			i = prettyKey.length;
			while(i--){
				t0 = v.pretty[prettyKey[i]];
				if(!(t0 instanceof Array) || t0.length < 2 || t0[t0.length - 1].indexOf('${time}') == NONE){
					k = 1;
					break;
				}
			}
			if(!k) return prettyData[ln] = v;
		}
		return err('DATE.i18n');
	}
	);
	bs.dateTemplate('ko-KR', {
		day:['일','월','화','수','목','금','토'],
		pretty:{
			now:'지금', past:'${time} 후', future:'${time} 전',
			second:[0, '${time}초'], minute:[0, '${time}분'], hour:[0, '${time}시간'],
			day:[0, '${time}일'], month:[0, '${time}개월'], year:[0, '${time}년']
		}
	}),
	bs.dateTemplate('en-US', {
		day:['sun','mon','tue','wed','thu','fri','sat'],
		pretty:{
			now:'Now', past:'${time} ago', future:'in ${time}',
			second:[0, 'a few second', '${time} seconds'], 
			minute:[0, 'a minute', '${time} minutes'],
			hour:[0, 'an hour', '${time} hours'],
			day:[0, 'a day', '${time} days'],
			month:[0, 'a month', '${time} months'],
			year:[0, 'a year', '${time} years']
		}
	}),
	bs.dateLang('ko-KR');
})();