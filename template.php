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

		@media print {
			.print-pdf #wpadminbar {
				display: none;
			}
		}

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
			font-family: <?php echo get_post_meta( get_the_ID(), 'presentation-font-family-heading', true ) ?: 'inherit'; ?>;
			font-weight: <?php echo get_post_meta( get_the_ID(), 'presentation-font-weight-heading', true ) ?: 'inherit'; ?>;
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

		.presentation-contain .slides {
			overflow: hidden;
			padding: 28.125px 50px;
			box-sizing: border-box;
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

		.presentation-contain .alignfull {
			margin: 0 calc( -50px - <?php echo get_post_meta( get_the_ID(), 'presentation-horizontal-padding', true ) ?: '0.2em'; ?> );
			max-width: none;
		}

		.reveal .slides > section,
		.reveal .slides > section > section {
			padding: <?php echo get_post_meta( get_the_ID(), 'presentation-vertical-padding', true ) ?: '0.2em'; ?> 0;
		}

		.reveal[data-background-transition="none"] .slide-background {
			transition: none;
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
	<script>var notesFilePath = '<?php echo plugins_url( 'speaker.html', __FILE__ ); ?>';</script>
	<?php wp_footer(); ?>
	<script>
		const contain = <?php echo get_post_meta( get_the_ID(), 'presentation-contain', true ) ?: 'false'; ?>;

		Reveal.initialize( {
			transition: '<?php echo get_post_meta( get_the_ID(), 'presentation-transition', true ) ?: 'none'; ?>',
			backgroundTransition: '<?php echo get_post_meta( get_the_ID(), 'presentation-background-transition', true ) ?: 'none'; ?>',
			transitionSpeed: '<?php echo get_post_meta( get_the_ID(), 'presentation-transition-speed', true ) ?: 'default'; ?>',
			controls: <?php echo get_post_meta( get_the_ID(), 'presentation-controls', true ) ?: 'false'; ?>,
			progress: <?php echo get_post_meta( get_the_ID(), 'presentation-progress', true ) ?: 'false'; ?>,
			hash: true,
			history: true,
			preloadIframes: true,
			hideAddressBar: true,
			height: 720,
			width: <?php echo get_post_meta( get_the_ID(), 'presentation-width', true ) ?: '960'; ?>,
			margin: contain ? 0 : 0.08,
			keyboard: {
				38: 'prev',
				40: 'next',
			},
			// We center in CSS.
			center: false,
			// minScale: 1,
			// maxScale: 1,
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

		if ( contain ) {
			const slidesElement = document.querySelector( '.slides' );
			const backgroundsElement = document.querySelector( '.backgrounds' );

			slidesElement.appendChild( backgroundsElement );
			document.documentElement.classList.add( 'presentation-contain' );
		} else {
			document.querySelectorAll( '.alignfull' ).forEach( ( element ) => {
				element.style.width = 100 / Reveal.getScale() + 'vw';
				element.style.maxHeight = 84 / Reveal.getScale() + 'vh';
			} );
			Reveal.addEventListener( 'ready', function( event ) {
				document.querySelectorAll( '.alignfull' ).forEach( ( element ) => {
					element.style.width = 100 / Reveal.getScale() + 'vw';
					element.style.maxHeight = 84 / Reveal.getScale() + 'vh';
				} );
			} );
			Reveal.addEventListener( 'resize', function( event ) {
				document.querySelectorAll( '.alignfull' ).forEach( ( element ) => {
					element.style.width = 100 / event.scale + 'vw';
					element.style.maxHeight = 100 / event.scale + 'vh';
				} );
			} );
		}

		const autoplay = document.querySelectorAll('[autoplay]');

		autoplay.forEach( ( el ) => el.setAttribute( 'data-autoplay', 'true' ) );

		// Admin bar buttons.
		( () => {
			const bar = document.querySelector('ul#wp-admin-bar-root-default');

			if ( ! bar ) {
				return;
			}

			const fullscreenLi = document.createElement( 'li' );
			const speakerLi = document.createElement( 'li' );
			const fullscreenButton = document.createElement( 'button' );
			const speakerButton = document.createElement( 'button' );
			const fullscreenText = document.createTextNode( 'Fullscreen' );
			const speakerText = document.createTextNode( 'Speaker View' );

			fullscreenButton.appendChild( fullscreenText );
			fullscreenLi.appendChild( fullscreenButton );
			fullscreenLi.classList.add( 'slide-button' );
			bar.appendChild( fullscreenLi );

			speakerButton.appendChild( speakerText );
			speakerLi.appendChild( speakerButton );
			speakerLi.classList.add( 'slide-button' );
			bar.appendChild( speakerLi );

			fullscreenButton.addEventListener( 'click', ( event ) => {
				const target = document.querySelector('.reveal');

				if ( target.requestFullscreen ) {
					target.requestFullscreen();
				} else if ( target.webkitRequestFullscreen ) {
					target.webkitRequestFullscreen();
				}

				event.preventDefault();
			} );
			speakerButton.addEventListener( 'click', ( event ) => {
				Reveal.getPlugin( 'notes' ).open( notesFilePath );
				event.preventDefault();
			} );
		} )();
	</script>
</body>
</html>
