<?php

/**
 * Plugin Name: Slide
 * Plugin URI:  https://wordpress.org/plugins/slide/
 * Description: Allows you to create presentations with the block editor.
 * Version:     0.0.4
 * Author:      Ella van Durpe
 * Author URI:  https://ellavandurpe.com
 * Text Domain: slide
 * License:     GPL-2.0+
 */

add_action( 'admin_notices', function() {
	$has_gutenberg = is_plugin_active( 'gutenberg/gutenberg.php' );

	if ( ! $has_gutenberg ) {
		?>
		<div class="notice notice-error is-dismissible">
			<p><?php echo wp_sprintf(
				__( '"Slide" needs %s to be active.', 'slide' ),
				'<a href="' . esc_url( admin_url( 'plugin-install.php?tab=plugin-information&plugin=gutenberg' ) ) . '">Gutenberg</a>'
			); ?></p>
		</div>
		<?php
		return;
	}

	$data = get_plugin_data( WP_PLUGIN_DIR . '/gutenberg/gutenberg.php' );

	if ( version_compare( $data[ 'Version' ], '6.7' ) === -1 ) {
		?>
		<div class="notice notice-error is-dismissible">
			<p><?php _e( '"Slide" needs "Gutenberg" version 6.7. Please update.', 'slide' ); ?></p>
		</div>
		<?php
	}
} );

add_action( 'enqueue_block_editor_assets', function() {
	if ( ! is_admin() || get_post_type() !== 'presentation' ) {
		return;
	}

	wp_enqueue_script(
		'slide',
		plugins_url( 'index.js', __FILE__ ),
		array(
			'wp-element',
			'wp-i18n',
			'wp-blocks',
			'wp-rich-text',
			'wp-plugins',
			'wp-edit-post',
			'wp-data',
			'wp-components',
			'wp-block-editor',
		),
		filemtime( dirname( __FILE__ ) . '/index.js' ),
		true
	);

	wp_enqueue_style(
		'slide-common',
		plugins_url( 'common.css', __FILE__ ),
		array(),
		filemtime( dirname( __FILE__ ) . '/common.css' )
	);

	wp_enqueue_style(
		'slide',
		plugins_url( 'index.css', __FILE__ ),
		array(),
		filemtime( dirname( __FILE__ ) . '/index.css' )
	);
} );

add_action( 'init', function() {
    require 'register.php';
} );

register_activation_hook( __FILE__, function() {
	require 'register.php';
	flush_rewrite_rules();
} );

add_filter( 'template_include', function( $path ) {
	if ( ! is_singular( 'presentation' ) ) {
		return $path;
	}

	the_post();

	return dirname( __FILE__ ) . '/template.php';
} );

// Dequeue the theme style. It is not needed for the presentations, as they are
// individually crafted.
add_action( 'wp_enqueue_scripts', function() {
	if ( ! is_singular( 'presentation' ) ) {
		return;
	}

	wp_enqueue_script(
		'slide-reveal',
		plugins_url( 'reveal/reveal.min.js', __FILE__ ),
		array(),
		'3.8.0',
		true
	);

	wp_enqueue_style(
		'slide-reveal',
		plugins_url( 'reveal/reveal.min.css', __FILE__ ),
		array(),
		'3.8.0'
	);

	wp_enqueue_style(
		'slide-common',
		plugins_url( 'common.css', __FILE__ ),
		array(),
		filemtime( dirname( __FILE__ ) . '/common.css' )
	);

	global $wp_styles;

	foreach ( $wp_styles->queue as $handle ) {
		$info = $wp_styles->registered[ $handle ];

		if ( $info->src === get_stylesheet_uri() ) {
			wp_dequeue_style( $handle );
		}
	}
}, 99999 );

add_action( 'load-post.php', function() {
	if ( get_current_screen()->post_type !== 'presentation' ) {
		return;
	}

	remove_editor_styles();
}, 99999 );

add_action( 'load-post-new.php', function() {
	if ( get_current_screen()->post_type !== 'presentation' ) {
		return;
	}

	remove_editor_styles();
}, 99999 );

add_action( 'admin_bar_menu', function ( $wp_admin_bar ) {
	if ( ! is_singular( 'presentation' ) ) {
		return;
	}

	$wp_admin_bar->add_node( array(
		'id'    => 'slides-fullscreen',
		'title' => 'Fullscreen',
		'href'  => '#',
	) );
}, 99999 );

add_filter( 'default_content', function( $post_content, $post ) {
	if ( $post->post_type !== 'presentation' ) {
		return;
	}

	return "<!-- wp:slide/slide -->\n<section class=\"wp-block-slide-slide\"></section>\n<!-- /wp:slide/slide -->";
}, 10, 2 );
