<?php
require_once dirname(__FILE__).'/define.php';

_write(realpath('').'/build.js', $header.$js.$footer);

require_once dirname(__FILE__).'/JSMin.php';
$min = JavaScriptMinifier::minify($js);
_write(realpath('').'/min.js', $header.$min.$footer);

$root = isset($_GET['root']) && $_GET['root'] == 'true' ? TRUE : FALSE;
switch(isset($_GET['live']) ? $_GET['live'] : 'full'){
case'min': _write(realpath('./..').'/index.js', $header.$min.$footer); $live = 'min'; if($root) _write(realpath('./../..').'/index.js', $header.$min.$footer); break;
case'full': _write(realpath('./..').'/index.js', $header.$js.$footer); $live = 'full'; if($root) _write(realpath('./../..').'/index.js', $header.$js.$footer); break;
default: $live = 'none';
}
echo 'full:<a href="build.js" target="_blank">build.js</a><br>minify:<a href="min.js" target="_blank">min.js</a>'.
	'<br>lived('.$live.'):<a href="http://js.bsapi.co/3/" target="_blank">http://js.bsapi.co/3/</a>';
if($root) echo '<br>root changed:<a href="http://js.bsapi.co/" target="_blank">http://js.bsapi.co/</a>';
?>