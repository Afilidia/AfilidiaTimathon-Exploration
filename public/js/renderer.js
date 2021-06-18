// -*- coding: utf-8 -*-


class Renderer {
    constructor (settings) {
        this.settings = settings;
        this.Component = new Component();

        this.Components = {
            parent: {
                object: this.Component,
                name: 'Component'
            }
        };

        // * Pages where given element render is enabled
        this.renderPages = settings.renderPages;
        this.renderable = this.getMatchingComponents;

        this.currentComponents = settings.components;
        this.currentComponents.forEach(component_to_render => {
            let settings = this.settings.renderPages[component_to_render].settings;
            this.Components[component_to_render] = this.componentAdder(component_to_render, settings);
        });

        // * Get each component instances
        if (Object.keys(this.Components).includes('FooterComponent')) this.FooterComponent = this.Components.FooterComponent;
        if (Object.keys(this.Components).includes('MenuComponent')) this.MenuComponent = this.Components.MenuComponent;
    }

    manageComponents(type, components) {
        switch (type) {
            case 'add': {
                components.forEach(component => {
                    // ! Check if component is valid and add it to the this.Components Object
                    if (isValidComponent(component)) this.Components[component] = this.getComponent(component);
                });

            } break;

            case 'remove': {
                components.forEach(component => {
                    if (Object.keys(this.Components).includes(component)) delete this.Components[component];
                });

            } break;
        }
    }

    /* Checks */
    isValidComponent(arg_Component) {
        let valid = false;

        this.Component.allComponents.forEach(component => {
            if (component.name == arg_Component) valid = true;
        });

        return valid;
    }

    render(args) {
        let arg_Components = null;

        // Get arguments
        if (args.hasOwnProperty('components')) arg_Components = args.components;

        if (arg_Components) {
            if (arg_Components.hasOwnProperty('add')) {
                this.manageComponents('add', arg_Components.add);

            } else {
                this.manageComponents('remove', arg_Components.remove);
            }
        }
    }

    componentAdder(component, settings) {
        switch (component) {
            case 'MenuComponent': {return new MenuComponent(settings)}
            case 'FooterComponent': {return new FooterComponent(settings)}
        }
    }


    /* GETTERS */

    // Get all matching components for CURRENT_PAGE
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