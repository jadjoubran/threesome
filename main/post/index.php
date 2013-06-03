<?php
$resultsArray = array();
if($_REQUEST['format'] && $_REQUEST['name']){
	if($_REQUEST['format'] == 'json'){
		$resultsArray['to'] = $_REQUEST['name'];
		echo json_encode($resultsArray);
	}
	else if($_REQUEST['format'] == 'javascript'){
		echo "test";
	else{
		echo "error";
	}
}
else{
	echo "error";
}
die;
?>