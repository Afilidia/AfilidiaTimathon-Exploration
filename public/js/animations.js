// -*- coding: utf-8 -*-

function toggleMenu(x) {
    x.classList.toggle('change');

    let menu = document.querySelector('.menu');
    if (menu) menu.classList.toggle('show');
}