<?php
$resultsArray = array();
$resultsArray['from'] = "_3";
$resultsArray['action'] = "says";
$resultsArray['greeting'] = "Hello 1";
$resultsArray['to'] = "World";
echo json_encode($resultsArray);
die;
?>