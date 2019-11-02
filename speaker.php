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
            <div id="upcoming-slide-container"><div id="upcoming-slide"><span class="overlay-element label">Upcoming</span></div></div>
            <div class="speaker-controls-time">
                <h4 class="label">Slide</h4>
                <div class="slide-count">
                    <span class="slide-current-number">&hellip;</span> of <span class="slide-total-number">&hellip;</span>
                </div>
                <br>
                <h4 class="label">Time</h4>
                <div class="clock">
                    <span class="clock-value">0:00 AM</span>
                </div>
                <br>
                <h4 class="label"><span class="reset-button">Click to Reset</span></h4>
                <div class="timer">
                    <span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
                </div>
            </div>
        </div>
        <div class="speaker-controls-notes">
            <h4 class="label">Notes</h4>
            <div class="value"></div>
        </div>
        <?php wp_footer(); ?>
	</body>
</html>
