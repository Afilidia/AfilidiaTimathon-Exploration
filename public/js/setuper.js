// -*- coding: utf-8 -*-


/**
 * *Creating renderer instance
 *
 * * Will be used to render static page elements
 */
const component_renderer = RendererSingleton.getInstance({
    components: getComponents(CURRENT_PAGE),
    renderPages: {
        'FooterComponent': {
            // Pages where FooterComponent is being used
            pages: getComponentPages('FooterComponent'),

            settings: {
                html: "",
                css: [
                    'footer.css'
                ],

                // Element render position
                // (for DOM insertAdjustHTML function)
                pos: 'beforeend',

                // File things elements
                elements: {
                    file: {
                        filepath: '/js/txt/footer.txt',
                        filename: 'footer.txt'
                    }
                }
            }
        },

        'MenuComponent': {
            pages: getComponentPages('MenuComponent'),
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
component_renderer.render();
// console.log(renderer);