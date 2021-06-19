// -*- coding: utf-8 -*-

/**
 * * Global functions
 */

// Menu open function
function toggleMenu(x) {
    x.classList.toggle('change');

    let menu = document.querySelector('.menu');
    let introSpan = document.querySelector('.intro-span');
    let arrow = document.querySelector('.arrow-down');

    let featureButton = document.querySelector('.a-btn');
    let landingMenuHideElements = document.querySelectorAll('.menu-hide');

    let earth_settings = document.querySelector('.settings');
    let earth_container = document.getElementById('earth');

    let container = document.querySelector('.container');

    if (menu) menu.classList.toggle('show');
    if (introSpan) introSpan.classList.toggle('hide');
    if (arrow) arrow.classList.toggle('hide');

    // if (earth_settings) earth_settings.classList.toggle('hide');
    // if (earth_container) earth_container.classList.toggle('hide');

    // if (featureButton) featureButton.classList.toggle('hide');
    if (container) container.classList.toggle('hide');


    if (landingMenuHideElements) {
        landingMenuHideElements.forEach(element => {
            element.classList.toggle('hide');
        });
    }

    // Disable body scroll
    $('body').toggleClass('stop-scrolling');
}


/**
 * * Manages functions connection for
 * * a current website.
 */

$(document).ready(function() {

    switch (CURRENT_PAGE) {
        case 'features' || 'features.html': {

            // Slider
            $('#autoWidth').lightSlider({
                autoWidth: true,
                loop: true,
                onSliderLoad: function() {
                    $('#autoWidth').removeClass('cS-hidden');
                }
            });

            // Scroll to the bottom of the page
            $('.arrow-down').click(function() {
                $("html, body").animate({ scrollTop: document.body.scrollHeight }, 300);
            });
        } break;
    }


});


/**
 * * Disable white spaces when dragging on mobile
 */
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive:false });