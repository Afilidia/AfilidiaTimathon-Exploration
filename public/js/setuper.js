const RENDERER = RendererSingleton.getInstance({
    renderPages: {
        'FooterComponent': ['features'],
        'MenuComponent': ['', 'index', 'features']
    }
});

console.log(RENDERER);