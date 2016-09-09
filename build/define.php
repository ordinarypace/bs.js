<?php
function _read($path){
	$result = '';
	$f = fopen($path, "r");
	while($t0 = fread($f, 4096)) $result .= $t0;
	fclose($f);
	return $result;
}
function _write($path, $v){
	$f = fopen($path, "w+");
	flock($f, LOCK_EX);
	fwrite($f, $v);
	flock($f, LOCK_UN);
	fclose($f);
}
$src = array(
	5=>'polyfill',
	6=>'es6',
	7=>'dompoly',
	10=>'detect',
	15=>'date',
	20=>'util',
	25=>'network',
	30=>'style',
	35=>'css',
	40=>'dom',
	45=>'event',
	50=>'vali',
	55=>'render',
//	60=>'history',
	65=>'local',
	900=>'boot'
);

$header = _read(realpath('./..').'/src/000_start.js')."\n";
$footer = _read(realpath('./..').'/src/999_end.js')."\n";
$path = realpath('./..').'/src/';
$js = '';
foreach($src as $k=>$v) $js .= _read($path.substr('00'.$k, -3).'_'.$v.'.js', "r")."\n";