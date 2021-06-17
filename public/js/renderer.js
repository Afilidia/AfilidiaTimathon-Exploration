// -*- coding: utf-8 -*-


class Renderer {
    constructor (settings) {

        // * Create each component instances
        this.FooterComponent = new FooterComponent();
        this.MenuComponent = new MenuComponent();

        this.Component = new this.Component();


        // * Pages where given element render is enabled
        this.renderPages = settings.renderPages;
    }

    // Getter -> get all matching components for CURRENT_PAGE
    static get getMatchingComponents() {

        if (this.renderPages) {
            let result = false;

            this.Component.allComponents.forEach(component => {
                if (this.renderPages[component].includes(CURRENT_PAGE)) result = true;
            });

            return result;
        }
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