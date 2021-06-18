const RENDERER = RendererSingleton.getInstance({
    components: ['FooterComponent', 'MenuComponent'],
    renderPages: {
        'FooterComponent': {
            pages: ['features'],
            settings: {
                html: "",
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

console.log(RENDERER);