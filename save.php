<?php

$saveEnable = false;
$savePassord = '12345';

$password = isset($_POST['password']) == 1 ? $_POST['password'] : '';
$xmldata = isset($_POST['data']) == 1 ? $_POST['data'] : '';

if($saveEnable){
	if($savePassord == $password){
		$fp = fopen('questions.xml', 'w');
		fwrite($fp, $xmldata);
		fclose($fp);
		
		echo '{"status":true, "option":true}';
	}else{
		echo '{"status":false, "option":true}';	
	}
}else{
	echo '{"status":false, "option":false}';	
}
?>