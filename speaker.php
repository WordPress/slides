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
                <div>
                    <button id="prev">Previous</button>
                    <button id="next">Next</button>
                </div>
                <h4 class="label">Slide</h4>
                <div class="slide-count">
                    <span class="slide-current-number">&hellip;</span> of <span class="slide-total-number">&hellip;</span>
                </div>
                <h4 class="label">Time</h4>
                <div class="clock">
                    <span class="clock-value">0:00 AM</span>
                </div>
                <h4 class="label"><span class="reset-button">Click to Reset</span></h4>
                <div class="timer">
                    <span class="hours-value">00</span><span class="minutes-value">:00</span><span class="seconds-value">:00</span>
                </div>
                <div>
                    <button id="editor" data-href="<?php echo get_edit_post_link() ?>">Presentation editor (public)</button>
                    <div style="font-size: 14px;margin-top:5px;">This will exit speaker view. To enter speaker view again, use the browser back button, then click the "Speaker View" button in the admin bar.</div>
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
