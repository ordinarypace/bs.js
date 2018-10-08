<?php
function _read($path){
	global $isdoc;
	$result = '';
	$f = fopen($path, "r");
	while($t0 = fread($f, 4096)) $result .= $t0;
	fclose($f);
	return $isdoc ? $result : preg_replace("/\/\*<\*\/.*\/\*>\*\//ms", "", $result);
}
function _write($path, $v){
	$f = fopen($path, "w+");
	flock($f, LOCK_EX);
	fwrite($f, $v);
	flock($f, LOCK_UN);
	fclose($f);
}
$src = array(
  10=>'util',
  15=>'net',
	20=>'dom',
  30=>'style',
  40=>'prop',
  50=>'event',
  60=>'vm',
  70=>'tmpl',
  80=>'scan'
);

$header = _read(realpath('./..').'/src/000_start.js')."\n";
$footer = _read(realpath('./..').'/src/999_end.js')."\n";
$path = realpath('./..').'/src/';
$js = '';
foreach($src as $k=>$v) $js .= _read($path.substr('00'.$k, -3).'_'.$v.'.js', "r")."\n";
$v = $header.$js.$footer;

//전처리기
$trait = '';
function trait0($v){
  global $trait;
  $trait .= trim($v[1]).'@@@@@'.trim($v[2]).'@@@@@';
  return '';
}
function trait1($v){
  global $trait;
  $arr = explode('@@@@@', $trait);
  $r = array();
  for($i = 0, $j = count($arr) - 1; $i < $j; $i +=2) $r[$arr[$i]] = $arr[$i + 1];
  return str_replace("#body", '', $r[trim($v[1])]);
}
function trait2($v){
  global $trait;
  $arr = explode('@@@@@', $trait);
  $r = array();
  for($i = 0, $j = count($arr) - 1; $i < $j; $i +=2) $r[$arr[$i]] = $arr[$i + 1];
  return str_replace("#body", trim($v[2]), $r[trim($v[1])]);
}
$v = preg_replace_callback('/#trait ([a-z_A-Z0-9]+)\s([\s\S]+)\s#end \1/', 'trait0', $v);
$v = preg_replace_callback('/#trait\(([^()]+)\)/', 'trait1', $v);
$v = preg_replace_callback('/#trait ([^()]+)\{\s([\S\s]*?(?(?=#\}).*?))\s#\}/', 'trait2', $v);
//es6 기본처리
$reg = array(
  "/^([^',\s]+)[,] /m",
  "/\(([^()]*)\)\=\>([^{][^;]*);/",
  "/\(([^()]*)\)\=\>/",
  "/\s([^( ]+)\=\>\{([^}]*)\}/",
  "/\s([^( ]+)\=\>([^{][^;]*);/",
  "/let |const /",
  "/method\(/",
);
$rep = array(
  "'\$1', ",
  "function(\$1){return \$2;};",
  "function(\$1)",
  " function(\$1){\$2}",
  " function(\$1){return \$2;};",
  "var ",
  "function("
);
//템플릿문자열 표현식처리
function rep0($v){
  return '@|+'.substr($v[0], 2, strlen($v[0]) - 3).'+@|';
}
function rep1($v){
  $v = preg_replace_callback('/\$\{[^}]+\}/', 'rep0', $v[0]);
  return str_replace("@|", "'",
    "'".preg_replace("/[\n\r]+/", '\n\'+\'', str_replace("'", "\'", substr($v, 1, strlen($v) - 2)))."'");
}
$i = 0;
while($i++<100 && preg_match('/\$\{[^}]+\}/', $v) > 0) $v = preg_replace_callback('/\$\{[^}]+\}/', 'rep0', $v);
//$v = preg_replace_callback('/`[^`]*`/', 'rep1', $v);
$v = preg_replace($reg, $rep, $v);