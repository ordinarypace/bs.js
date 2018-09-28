<?php
require_once dirname(__FILE__).'/define.php';
require_once dirname(__FILE__).'/JSMin.php';
$v = preg_replace("/\(([^)]*)\)\=\>/gm", "function($1)", $header.$js.$footer);
_write(realpath('').'/build.js', $v);
_write(realpath('').'/min.js', JavaScriptMinifier::minify($v));
?>