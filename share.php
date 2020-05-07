<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title><?php echo $_GET['title'];?></title>
        <meta property="og:title" content="<?php echo $_GET['title'];?>" />
        <meta property="og:description" content="<?php echo $_GET['desc'];?> "/>
        <meta property="og:image" content="<?php echo $_GET['thumb'];?>"/>
        <meta property="og:image:width" content="<?php echo $_GET['width'];?>"/>
		<meta property="og:image:height" content="<?php echo $_GET['height'];?>"/>
    </head>
    <body>
        <script>
            window.location.href = "<?php echo $_GET['url'];?>";
        </script>
    </body>

</html>