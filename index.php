<?php

/**
 * Plugin Name: Slide
 * Plugin URI:  https://wordpress.org/plugins/slide/
 * Description: Allows you to create presentations with the block editor.
 * Version:     0.0.1
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

	if ( version_compare( $data[ 'Version' ], '6.6' ) === -1 ) {
		?>
		<div class="notice notice-error is-dismissible">
			<p><?php _e( '"Slide" needs "Gutenberg" version 6.6. Please update.', 'slide' ); ?></p>
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
			'wp-editor',
			'wp-blocks',
			'wp-rich-text',
			'wp-plugins',
			'wp-edit-post',
			'wp-data',
			'wp-components',
		),
		filemtime( dirname( __FILE__ ) . '/index.js' ),
		true
	);

	wp_enqueue_style(
		'slide',
		plugins_url( 'index.css', __FILE__ ),
		array(),
		filemtime( dirname( __FILE__ ) . '/index.css' )
	);

	wp_enqueue_style(
		'slide-common',
		plugins_url( 'common.css', __FILE__ ),
		array(),
		filemtime( dirname( __FILE__ ) . '/common.css' )
	);
} );

add_action( 'init', function() {
    register_post_type( 'presentation', array(
        'labels'             => array(
			'name'                  => _x( 'Presentations', 'Post type general name', 'slide' ),
			'singular_name'         => _x( 'Presentation', 'Post type singular name', 'slide' ),
			'menu_name'             => _x( 'Presentations', 'Admin Menu text', 'slide' ),
			'name_admin_bar'        => _x( 'Presentation', 'Add New on Toolbar', 'slide' ),
			'add_new'               => __( 'Add New', 'slide' ),
			'add_new_item'          => __( 'Add New Presentation', 'slide' ),
			'new_item'              => __( 'New Presentation', 'slide' ),
			'edit_item'             => __( 'Edit Presentation', 'slide' ),
			'view_item'             => __( 'View Presentation', 'slide' ),
			'all_items'             => __( 'All Presentations', 'slide' ),
			'search_items'          => __( 'Search Presentations', 'slide' ),
			'parent_item_colon'     => __( 'Parent Presentations:', 'slide' ),
			'not_found'             => __( 'No presentations found.', 'slide' ),
			'not_found_in_trash'    => __( 'No presentations found in Trash.', 'slide' ),
			'featured_image'        => _x( 'Presentation Cover Image', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'slide' ),
			'set_featured_image'    => _x( 'Set cover image', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'slide' ),
			'remove_featured_image' => _x( 'Remove cover image', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'slide' ),
			'use_featured_image'    => _x( 'Use as cover image', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'slide' ),
			'archives'              => _x( 'Presentation archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'slide' ),
			'insert_into_item'      => _x( 'Insert into presentation', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'slide' ),
			'uploaded_to_this_item' => _x( 'Uploaded to this presentation', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'slide' ),
			'filter_items_list'     => _x( 'Filter presentations list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'slide' ),
			'items_list_navigation' => _x( 'Presentations list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'slide' ),
			'items_list'            => _x( 'Presentations list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'slide' ),
	    ),
		'public' => true,
		'publicly_queryable' => true,
		'show_ui' => true,
		'show_in_menu' => true,
		'query_var' => true,
		'rewrite' => array( 'slug' => 'presentation' ),
		'capability_type' => 'post',
		'has_archive' => true,
		'hierarchical' => false,
		'menu_position' => null,
		'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'custom-fields' ),
		'show_in_rest' => true,
	) );

	foreach ( array(
		'css',
		'color',
		'background-color',
		'font-size',
		'font-family',
	) as $key ) {
		register_post_meta( 'presentation', "presentation-$key", array(
			'show_in_rest' => true,
			'single' => true,
			'type' => 'string',
		) );
	}
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
