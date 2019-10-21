<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<?php wp_head(); ?>
	<style>
		#wpadminbar #wp-admin-bar-slides-fullscreen > .ab-item:before {
			content: '\f211';
			top: 3px;
		}

		@media print {
			.print-pdf #wpadminbar {
				display: none;
			}
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

		.reveal {
			color: <?php echo get_post_meta( get_the_ID(), 'presentation-color', true ) ?: '#000'; ?>;
			font-size: <?php echo get_post_meta( get_the_ID(), 'presentation-font-size', true ) ?: '42'; ?>px;
			font-family: <?php echo get_post_meta( get_the_ID(), 'presentation-font-family', true ) ?: 'Helvetica, sans-serif'; ?>;
		}

		.reveal h1,
		.reveal h2,
		.reveal h3,
		.reveal h4,
		.reveal h5,
		.reveal h6 {
			font-family: <?php echo get_post_meta( get_the_ID(), 'presentation-font-family-heading', true ) ?: 'Helvetica, sans-serif'; ?>;
		}

		/* Extra specificity to override reveal background. */
		.reveal .slide-background {
			background-color: <?php echo get_post_meta( get_the_ID(), 'presentation-background-color', true ) ?: '#fff'; ?>;
			background-image: <?php echo get_post_meta( get_the_ID(), 'presentation-background-gradient', true ) ?: 'none'; ?>;
		}

		/* If a background color is set, disable the global gradient. */
		.reveal .slide-background[style*="background-color"] {
			background-image: none;
		}

		.reveal .slide-background .slide-background-content {
			background-image: url("<?php echo get_post_meta( get_the_ID(), 'presentation-background-url', true ) ?: 'none'; ?>");
			background-position: <?php echo get_post_meta( get_the_ID(), 'presentation-background-position', true ) ?: '50% 50%'; ?>;
			opacity: <?php echo (int) get_post_meta( get_the_ID(), 'presentation-background-opacity', true ) / 100 ?: '1'; ?>;
		}

		section.wp-block-slide-slide {
			top: auto !important;
			display: flex !important;
			justify-content: center;
			flex-direction: column;
			padding-top: <?php echo get_post_meta( get_the_ID(), 'presentation-vertical-padding', true ) ?: '0.2em'; ?> !important;
			padding-bottom: <?php echo get_post_meta( get_the_ID(), 'presentation-vertical-padding', true ) ?: '0.2em'; ?> !important;
			padding-left: <?php echo get_post_meta( get_the_ID(), 'presentation-horizontal-padding', true ) ?: '0.2em'; ?> !important;
			padding-right: <?php echo get_post_meta( get_the_ID(), 'presentation-horizontal-padding', true ) ?: '0.2em'; ?> !important;
		}

		.reveal .slides {
			text-align: inherit;
			justify-content: center;
			display: flex;
			flex-direction: column;
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

		.wp-block-media-text__media,
		.wp-block-media-text__content {
			flex-basis: 50%;
		}

		.alignfull {
			width: 100vw;
			left: 50%;
			position: relative;
			transform: translate(-50%, 0);
			max-width: none;
			max-height: 100vh;
		}

		.reveal .slides > section,
		.reveal .slides > section > section {
			padding: <?php echo get_post_meta( get_the_ID(), 'presentation-vertical-padding', true ) ?: '0.2em'; ?> 0;
		}
	</style>
	<style>
		<?php echo get_post_meta( get_the_ID(), 'presentation-css', true ); ?>
	</style>
</head>
<body>
	<div class="reveal">
		<div class="slides">
			<?php the_content(); ?>
		</div>
	</div>
	<?php wp_footer(); ?>
	<script>
		Reveal.initialize( {
			transition: '<?php echo get_post_meta( get_the_ID(), 'presentation-transition', true ) ?: 'none'; ?>',
			transitionSpeed: '<?php echo get_post_meta( get_the_ID(), 'presentation-transition-speed', true ) ?: 'default'; ?>',
			controls: <?php echo get_post_meta( get_the_ID(), 'presentation-controls', true ) ?: 'false'; ?>,
			progress: <?php echo get_post_meta( get_the_ID(), 'presentation-progress', true ) ?: 'false'; ?>,
			hash: true,
			history: true,
			preloadIframes: true,
			hideAddressBar: true,
			height: 720,
			width: <?php echo get_post_meta( get_the_ID(), 'presentation-width', true ) ?: '960'; ?>,
			margin: 0.08,
			// minScale: 1,
			// maxScale: 1,
		} );
		document.querySelectorAll( '.alignfull' ).forEach( ( element ) => {
			element.style.width = 100 / Reveal.getScale() + 'vw';
			element.style.maxHeight = 84 / Reveal.getScale() + 'vh';
		} );
		document.querySelectorAll( '.wp-block-media-text' ).forEach( ( element ) => {
			const percentage = parseInt( element.style.gridTemplateColumns, 10 );

			if ( percentage === 50 ) {
				return;
			}

			element.querySelector( '.wp-block-media-text__media' )
				.style.flexBasis = `${ percentage }%`;
			element.querySelector( '.wp-block-media-text__content' )
				.style.flexBasis = `${ 100 - percentage }%`;
		} );
		Reveal.addEventListener( 'resize', function( event ) {
			document.querySelectorAll( '.alignfull' ).forEach( ( element ) => {
				element.style.width = 100 / event.scale + 'vw';
				element.style.maxHeight = 84 / event.scale + 'vh';
			} );
		} );
		window.addEventListener( 'DOMContentLoaded', function() {
			document.querySelector('#wp-admin-bar-slides-fullscreen a').addEventListener( 'click', function( event ) {
				document.querySelector('.reveal').requestFullscreen();
				event.preventDefault();
			} );
		} );
	</script>
</body>
</html>
