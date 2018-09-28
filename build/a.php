<?php error_reporting( E_ALL );  ini_set('display_errors', 1);
$v = <<<EOS
`abcd 'dddd'
bfdfdfdf`
EOS;

function rep($v){
  if(gettype($v) != 'array') return '';
  $r = array();
  $v = $v[0];
  $v = explode("\n", substr($v, 1, strlen($v) - 2));
  foreach($v as $value){
    
    array_push($r, "'".str_replace("'", "\'", $value));
  }
  return implode("\\n'+", $r)."'";
}
               
$v = preg_replace_callback('/`[^`]*`/', 'rep', $v);

rep($v);
echo($v);
?>