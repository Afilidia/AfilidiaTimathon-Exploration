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

$(document).ready(async function() {

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

        case 'faq' || 'faq.html': {
            // Answer slide down animation
            let pluses = document.querySelectorAll('.pluses');

            if (pluses) pluses.forEach(plus => {
                plus.addEventListener('click', () => {
                    let plus2 = plus.querySelector('.plus-2');

                    // Get answer from 'question' class
                    let answer = plus.parentElement.parentElement.querySelector('.answer');
                    let wrapper = plus.querySelector('.question-wrapper');

                    if (plus2) plus2.classList.toggle('rotate');
                    if (answer) answer.classList.toggle('show');
                    if (wrapper) wrapper.classList.toggle('change-bg');
                });
            });

        } break;

        case 'nearby' || 'nearby.html': {
            // Connection of all customizable elements on map

            let radius_Settings = document.querySelector('.settings-value.radius');

            // Handlers
            let location_Button = document.querySelector('.button.location');
            let style_Settings = document.querySelector('.settings-value.style');

            let submit_btn = document.querySelector('.submit-btn');

            // Radius input range change event
            $(".range-input.radius").on("input change", function(e) {
                if (radius_Settings) {
                    radius_Settings.textContent = e.target.value + ' km';
                    defaults.radius = parseInt(e.target.value);
                    // console.log(defaults.radius);
                }
            });

            // Get geolozalization
            if (location_Button) location_Button.addEventListener('click', () => {
                let localization = getLocation();

            });

            $(".select.style").on("change", function(e) {
                // Switch layers
                switchLayer(e.target.value);

                // Change description
                if (style_Settings) style_Settings.textContent = getStyleDescription(e.target.value);
            });

            var getStyleDescription = (style) => {
                let descriptions = {
                    'streets': 'Street map',
                    'hybrid': 'Satelite map'
                };

                return descriptions[style];
            };

            if (submit_btn) submit_btn.addEventListener('click', () => {
                generatePlanes();
            });

        } break;
    }


});


/**
 * * Disable white spaces when dragging on mobile
 */
// document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive:false });