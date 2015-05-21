<?php 
/* THIS FILE WILL NEED TO BE HOSTED AT http://advancedcontent.trailerparkinteractive.com/TMNT/get_uplynk_video.php */
$apiKey = 'xBhjOva3S8jVMGGGlE5V3MXSwm8q1FJ0szLIb5Nl';
$userIP = '';
$iph = '';
$cid = '';
$ct = 'a';

$currentTime = time();
$timeOffset = 3600;
$exp = $currentTime + $timeOffset;

//if content id was passed as a parameter overwrite default id
if(isset($_GET["id"]) && $_GET["id"] != ""){
 $cid = $_GET["id"];
}

//if type was passed as a parameter overwrite the default type
if(isset($_GET["type"]) && $_GET["type"] != ""){
	$ct = $_GET["type"];
}

if ( isset($_SERVER["REMOTE_ADDR"]) )    { 
    $userIP = $_SERVER["REMOTE_ADDR"];
} else if ( isset($_SERVER["HTTP_X_FORWARDED_FOR"]) )    { 
    $userIP = $_SERVER["HTTP_X_FORWARDED_FOR"]; 
} else if ( isset($_SERVER["HTTP_CLIENT_IP"]) )    { 
    $userIP = $_SERVER["HTTP_CLIENT_IP"]; 
}

if($userIP != '' && $cid != ''){
	$iph = hash('sha256', $userIP);
	$assetString = 'exp=' . $exp . '&ct=' . $ct . '&cid=' . $cid . '&iph=' . $iph;
	//echo $assetString;
	$signatureValue = hash_hmac('sha256', $assetString, $apiKey);
	$finalString = 'http://content.uplynk.com/' . $cid . '.m3u8?' . $assetString . '&sig=' . $signatureValue;
	echo $finalString;
} else {
	echo 'ERROR: VIDEO URL COULD NOT BE FOUND';	
}
?>