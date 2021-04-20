<!DOCTYPE html>
<html lang="en-US">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>Web Story Ad</title>

	<!-- /wp-admin/load-styles.php?load[chunk_0]=common -->
	<link rel='stylesheet' href='web-stories-ad/assets/wp-assets/load-style-php.css'/>
	<link rel='stylesheet' crossorigin='anonymous' href='https://fonts.googleapis.com/css?family=Google+Sans%7CGoogle+Sans%3Ab%7CGoogle+Sans%3A500&#038;display=swap&#038;ver=1.7.0-alpha.0'/>
	<link rel='stylesheet' href='web-stories-wp/assets/css/vendors-edit-story.css'/>
	<link rel='stylesheet' href='web-stories-wp/assets/css/vendors-edit-story-rtl.css'/>
	<link rel='stylesheet' href='web-stories-wp/assets/css/edit-story-rtl.css'/>
	<link rel='stylesheet' href='web-stories-wp/assets/css/edit-story.css'/>
	<style>
		body.js.edit-story #web-stories-editor {
			height: 100vh;
		}
	</style>

	<script id='web-stories-tracking-js-after'>
      window.webStoriesTrackingSettings = {
        'trackingAllowed': false,
        'trackingId': 'UA-168571240-1',
        'trackingIdGA4': 'G-T88C9951CM',
        'appVersion': '1.7.0-alpha.0',
        'userProperties': {
          'siteLocale': 'en_US',
          'userLocale': 'en_US',
          'userRole': 'administrator',
          'enabledExperiments': 'enableQuickTips,customMetaBoxes,videoOptimization',
          'wpVersion': '5.6.3',
          'phpVersion': '8.0.3',
          'isMultisite': 0,
          'adNetwork': 'admanager',
          'analytics': false,
          'activePlugins': '',
        },
      };
	</script>
</head>
<body class="edit-story no-js">

	<script type="text/javascript">
	  document.body.className = document.body.className.replace( 'no-js', 'js' );
	</script>

	<div class="web-stories-wp">
		<h1 class="screen-reader-text hide-if-no-js">Web Stories</h1>
		<div id="web-stories-editor" class="web-stories-editor-app-container hide-if-no-js">
			<h1 class="loading-message">Please wait...</h1>
		</div>

		<div class="wrap hide-if-js web-stories-wp-no-js">
			<h1 class="wp-heading-inline">Web Stories</h1>
			<div class="notice notice-error notice-alt">
				<p>Web Stories Ad requires JavaScript. Please enable JavaScript in your browser settings.</p>
			</div>
		</div>
	</div>

	<script src='web-stories-ad/assets/wp-assets/wp-polyfill.min.js'></script>
	<script src='web-stories-ad/assets/wp-assets/load-scripts.js'></script> <!-- /wp-admin/load-scripts.php?load[chunk_0]=wp-i18n -->
	<script src='web-stories-ad/assets/wp-assets/url.min.js'></script>
	<script src='web-stories-ad/assets/wp-assets/api-fetch.min.js'></script>

	<?php
	$chunks_file =  __DIR__ . '/assets/js/edit-story.chunks.php';
	$chunks = is_readable( $chunks_file ) ? require $chunks_file : [];

	if ( ! empty( $chunks['js'] ) && is_array( $chunks['js'] ) ) {
		foreach ( $chunks['js'] as $file_name ) {
			printf( '<script src="web-stories-ad/assets/js/%s.js"></script>', $file_name );
		}
	}
	?>
	<script src='web-stories-ad/assets/js/edit-story.js'></script>

</body>
</html>
