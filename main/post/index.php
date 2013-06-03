<?php
$resultsArray = array();
if($_POST['format'] && $_POST['name']){
	$resultsArray['to'] = $_POST['name'];
}
else{
	$resultsArray['to'] = 'error';	
}
echo json_encode($resultsArray);
die;
?>