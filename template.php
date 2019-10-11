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

        .dashicons, .dashicons-before:before {
            font-family: dashicons !important;
            font-style: normal !important;
            padding: 10px 30px 10px 0 !important;
            color: #eb0569;
        }

        .wp-block-image, figure {
            margin: 0;
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

        html {
            margin-top: 0 !important;
        }

        .reveal {
			background: <?php echo get_post_meta( get_the_ID(), 'presentation-background-color', true ) ?: '#fff'; ?>;
			color: <?php echo get_post_meta( get_the_ID(), 'presentation-color', true ) ?: '#000'; ?>;
            font-size: <?php echo get_post_meta( get_the_ID(), 'presentation-font-size', true ) ?: '42'; ?>px;
            font-family: <?php echo get_post_meta( get_the_ID(), 'presentation-font-family', true ) ?: 'Helvetica, sans-serif'; ?>;
        }

        .reveal .slides {
            text-align: inherit;
        }

        .wp-block-slide-slide img,
        .wp-block-slide-slide video,
        .wp-block-slide-slide iframe {
            max-width: 100%;
            max-height: 100%;
        }

        .wp-block-slide-slide section figure img {
            margin: 0;
            display: block;
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
			transition: 'none',
			controls: false,
			progress: false,
			hash: true,
			history: true,
			preloadIframes: true,
			hideAddressBar: true,
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
