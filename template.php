<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<script>
		if ( /[?&]receiver/i.test( window.location.search ) ) {
			document.documentElement.classList.add( 'receiver' );
		}
	</script>
	<?php wp_head(); ?>
	<style>
		ul#wp-admin-bar-root-default li.slide-button {
			margin: 0 5px;
		}

		ul#wp-admin-bar-root-default li.slide-button > button {
			border-radius: 3px;
			line-height: 24px;
			border: none;
			padding: 0 5px;
			background: #fff;
			font-weight: bold;
		}

		#wpadminbar {
			opacity: 0.5;
			transition: opacity 0.5s ease;
		}

		#wpadminbar:hover {
			opacity: 1;
		}

		.print-pdf #wpadminbar,
		.receiver #wpadminbar {
			display: none;
		}

		figure.alignleft {
			float: left;
			margin-right: 1em;
		}

		figure.alignright {
			float: right;
			margin-left: 1em;
		}

		.wp-block-embed.alignleft {
			width: auto;
			max-width: none;
		}

		/* Remove margin for admin bar. */
		html {
			margin-top: 0 !important;
		}

		.presentation-contain html,
		.presentation-contain body {
			background: #000;
		}

		.reveal .slides {
			text-align: inherit;
			justify-content: center;
			display: flex;
			flex-direction: column;
		}

		.print-pdf .slides {
			display: block;
		}

		.print-pdf .pdf-page {
			justify-content: center;
			display: flex;
			flex-direction: column;
		}

		.pdf-page,
		.presentation-contain .slides {
			overflow: hidden;
			padding: 28.125px 50px;
			box-sizing: border-box;
		}

		.reveal .slides .pdf-page > section {
			position: static !important;
			z-index: 1;
			width: 100% !important;
		}

		.presentation-contain .slides > section {
			left: 50px;
			right: 50px;
			width: auto;
		}

		.receiver .reveal .slides *,
		.receiver .reveal .backgrounds * {
			pointer-events: none;
		}

		.reveal .controls,
		.reveal .progress {
			color: currentColor;
		}

		.wp-block-slide-slide img,
		.wp-block-slide-slide video,
		.wp-block-slide-slide iframe {
			max-width: 100%;
			max-height: 100%;
		}

		.wp-block-media-text {
			/* Maybe table? */
			display: flex;
		}

		.wp-block-media-text.has-media-on-the-right {
			flex-direction: row-reverse;
		}

		.wp-block-media-text__media,
		.wp-block-media-text__content {
			flex-basis: 50%;
		}

		html:not( .presentation-contain ) .alignfull {
			width: 100vw;
			left: 50%;
			position: relative;
			transform: translate(-50%, 0);
			max-width: none;
			max-height: 100vh;
		}

		.reveal[data-background-transition="none"] .slide-background {
			transition: none;
		}

		/* Dynamic */

		.reveal {
			color: <?php echo sanitize_hex_color( get_post_meta( get_the_ID(), 'presentation-color', true ) ) ?: '#000'; ?>;
			font-size: <?php echo (int) get_post_meta( get_the_ID(), 'presentation-font-size', true ) ?: 42; ?>px;
			font-family: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-font-family', true ) ) ?: 'Helvetica, sans-serif'; ?>;
		}

		.reveal h1,
		.reveal h2,
		.reveal h3,
		.reveal h4,
		.reveal h5,
		.reveal h6 {
			font-family: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-font-family-heading', true ) ) ?: 'inherit'; ?>;
			font-weight: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-font-weight-heading', true ) ) ?: 'inherit'; ?>;
		}

		/* Extra specificity to override reveal background. */
		.reveal .slide-background {
			background-color: <?php echo sanitize_hex_color( get_post_meta( get_the_ID(), 'presentation-background-color', true ) ) ?: '#fff'; ?>;
			background-image: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-background-gradient', true ) ) ?: 'none'; ?>;
		}

		/* If a background color is set, disable the global gradient. */
		.reveal .slide-background[style*="background-color"] {
			background-image: none;
		}

		.reveal .slide-background .slide-background-content {
			background-image: url("<?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-background-url', true ) ) ?: 'none'; ?>");
			background-position: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-background-position', true ) ) ?: '50% 50%'; ?>;
			opacity: <?php echo (int) get_post_meta( get_the_ID(), 'presentation-background-opacity', true ) / 100 ?: 1; ?>;
		}

		.reveal .slides section.wp-block-slide-slide {
			top: auto !important;
			padding-top: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-vertical-padding', true ) ) ?: '0.2em'; ?> !important;
			padding-bottom: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-vertical-padding', true ) ) ?: '0.2em'; ?> !important;
			padding-left: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-horizontal-padding', true ) ) ?: '0.2em'; ?> !important;
			padding-right: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-horizontal-padding', true ) ) ?: '0.2em'; ?> !important;
		}

		.presentation-contain .alignfull {
			margin: 0 calc( -50px - <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-horizontal-padding', true ) ) ?: '0.2em'; ?> );
			max-width: none;
		}

		.reveal .slides > section,
		.reveal .slides > section > section {
			padding: <?php echo esc_html( get_post_meta( get_the_ID(), 'presentation-vertical-padding', true ) ) ?: '0.2em'; ?> 0;
		}
	</style>
	<style>
		<?php
			// Allow quotes.
			echo str_replace( '<', '', get_post_meta( get_the_ID(), 'presentation-css', true ) );
		?>
	</style>
</head>
<body>
	<div class="reveal">
		<div class="slides">
			<?php the_content(); ?>
		</div>
	</div>
	<?php wp_footer(); ?>
</body>
</html>
