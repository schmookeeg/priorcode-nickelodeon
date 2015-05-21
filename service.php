<?php


session_start();
require_once("response_codes.php");

$ip = VisitorIP();  


if(isset($_POST['team'])):        
    postTeams($_POST['team'],$ip);
endif;

if(isset($_POST['user'])):        
     postUser($_POST['user'],$ip);
endif;

if(isset($_GET['team'])):        
    getTeams();
endif;

if(isset($_GET['mission'])):        
    getMissions();
endif;


function postTeams($team, $ip)
{

    

        $_SESSION[$ip] = time();

        $api = "http://api.turtlesvsfoot.com/api/teamApi";
        $ch = curl_init($api);

        $headers = array("Content-type: application/json; charset=UTF-8");

        echo 'name='.$team['name'];

        curl_setopt($ch, CURLOPT_HTTPHEADERS, $headers);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'name='.$team['name']."&ip=".$ip);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $response = curl_exec($ch);


        echo json_encode($response);

        curl_close($ch);


}

function postUser($user, $ip)
{


        $_SESSION[$ip] = time();

        $api = "http://api.turtlesvsfoot.com/api/userApi";
        $ch = curl_init($api);

        $headers = array("Content-type: application/json; charset=UTF-8");

        curl_setopt($ch, CURLOPT_HTTPHEADERS, $headers);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, 'name='.$user['name']."&email=".$user['email']."&phone=".$user['phone']."&team=".$user['team']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $response = curl_exec($ch);

        echo json_encode($response);

        curl_close($ch);
}


function getTeams()
{
        $api = "http://api.turtlesvsfoot.com/api/teamApi";
        $ch = curl_init($api);

        $headers = array("Content-type: application/json; charset=UTF-8");

        curl_setopt($ch, CURLOPT_HTTPHEADERS, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $response = curl_exec($ch);
        http_response_code(200);
        echo json_encode($response);

        curl_close($ch);
}


function getMissions()
{
        $api = "http://api.turtlesvsfoot.com/api/missionApi";
        $ch = curl_init($api);

        $headers = array("Content-type: application/json; charset=UTF-8");

        curl_setopt($ch, CURLOPT_HTTPHEADERS, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        $response = curl_exec($ch);
        http_response_code(200);
        echo json_encode($response);

        curl_close($ch);
}






function VisitorIP()
{ 
    if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
        $TheIp=$_SERVER['HTTP_X_FORWARDED_FOR'];
    else if(isset($_SERVER['REMOTE_ADDR']))
        $TheIp=$_SERVER['REMOTE_ADDR'];
    else if(isset($_SERVER['LOCAL_ADDR']))
        $TheIp=$_SERVER['LOCAL_ADDR'];

    return trim($TheIp);
}

?>