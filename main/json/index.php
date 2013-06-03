<?php
$resultsArray = array();
$resultsArray['from'] = "_3";
$resultsArray['action'] = "says";
$resultsArray['greeting'] = "Hello";
$resultsArray['to'] = "World";
echo json_encode($resultsArray);
die;
?>