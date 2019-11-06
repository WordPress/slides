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
            /* Remove margin for admin bar. */
            html {
                margin-top: 0 !important;
            }
        </style>
    </head>
	<body>
        <div id="slide-container">
            <div id="current-slide-container"><div id="current-slide"></div></div>
            <div id="upcoming-slide-container"><div id="upcoming-slide"><span class="overlay-element label"><?php esc_html_e( 'Upcoming', 'slide' ); ?></span></div></div>
            <div class="speaker-controls-time">
                <div>
                    <button id="prev"><?php esc_html_e( 'Previous', 'slide' ); ?></button>
                    <button id="next"><?php esc_html_e( 'Next', 'slide' ); ?></button>
                </div>
                <h4 class="label"><?php esc_html_e( 'Slide', 'slide' ); ?></h4>
                <div class="slide-count">
                    <span class="slide-current-number">&hellip;</span> of <span class="slide-total-number">&hellip;</span>
                </div>
                <h4 class="label"><?php esc_html_e( 'Time', 'slide' ); ?></h4>
                <div class="clock">
                    <span class="clock-value">0:00 AM</span>
                </div>
                <h4 class="label"><span class="reset-button"><?php esc_html_e( 'Click to Reset', 'slide' ); ?></span></h4>
                <div class="timer">
                    <span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
                </div>
            </div>
        </div>
        <div class="speaker-controls-notes">
            <h4 class="label"><?php esc_html_e( 'Notes', 'slide' ); ?></h4>
            <div class="value"></div>
        </div>
        <?php wp_footer(); ?>
	</body>
</html>
