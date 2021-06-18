// -*- coding: utf-8 -*-


/**
 * *Creating renderer instance
 *
 * * Will be used to render static page elements
 */
const renderer = RendererSingleton.getInstance({
    components: ['FooterComponent', 'MenuComponent'],
    renderPages: {
        'FooterComponent': {
            pages: ['features'],
            settings: {
                html: "",
                css: [
                    'footer.css'
                ],

                pos: 'beforeend',
                elements: {
                    file: {
                        filepath: '/js/txt/footer.txt',
                        filename: 'footer.txt'
                    }
                }
            }
        },

        'MenuComponent': {
            pages: ['', 'index', 'features'],
            settings: {
                html: "",
                css: [
                    'index.css',
                    'menu.css'
                ],

                pos: 'afterbegin',
                elements: {
                    file: {
                        filepath: '/js/txt/menu.txt',
                        filename: 'menu.txt'
                    }
                }
            }
        }
    }
});

// * Render all components
renderer.render();
// console.log(renderer);