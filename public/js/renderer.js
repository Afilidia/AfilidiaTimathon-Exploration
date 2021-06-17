// -*- coding: utf-8 -*-


class Renderer extends MenuComponent, FooterComponent {
    constructor (settings) {
        super();
    }
}


/**
 * * RendererSingleton class.
 *
 * @description Renderer class -> Singleton design pattern for Renderer class
 *
 * @since 0.0.1
 * @augments Parent
 *
 * @alias RendererSingleton
 * @link /public/js/renderer.js
 *
 */
 class RendererSingleton {
    static #__INSTANCE = null;

    constructor(settings) {return RendererSingleton.getInstance(settings);}

    static getInstance(settings) {
        if (RendererSingleton.#__INSTANCE) return RendererSingleton.#__INSTANCE;

        RendererSingleton.#__INSTANCE = new Renderer(settings);
        return RendererSingleton.#__INSTANCE;
    }
}