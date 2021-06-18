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
        this.renderPages = this.getRenderPages(settings.renderPages);
        this.renderable = this.getMatchingComponents;

        this.currentComponents = settings.components;
        this.currentComponents.forEach(component_to_render => {
            let settings = this.settings.renderPages[component_to_render].settings;

            // * Add component to the components array
            this.Components[component_to_render] = {name: '', object: null};
            this.Components[component_to_render].name = component_to_render;
            this.Components[component_to_render].object = this.componentAdder(component_to_render, settings);
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
                    if (isValidComponent(component.name)) this.Components[component] = this.componentAdder(component.settings);
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
        let arg_Gateway = null;

        let enabled = {};
        this.currentComponents.forEach(component => {
            enabled[component] = true;
        });

        // * Get arguments if args are defined
        if (args !== undefined) {
            if (args.hasOwnProperty('components')) arg_Components = args.components;
            if (args.hasOwnProperty('gateway')) arg_Gateway = args.gateway;

            // * Adding/removing components before rendering
            if (arg_Components) {
                if (arg_Components.hasOwnProperty('add')) {
                    // ! args have to contain args.components.add .name && .settings
                    this.manageComponents('add', arg_Components.add);

                } else {
                    this.manageComponents('remove', arg_Components.remove);
                }
            }

            // * Disabling given component once
            if (arg_Gateway) {
                Object.keys(arg_Gateway).forEach(component => {
                    if (arg_Gateway[component] == false) enabled[component] = false;
                });
            }
        }

        this.currentComponents.forEach(component => {

            // * Render all enabled components
            if ((component.name != 'parent') && (enabled[component]) && (this.renderPages[component].includes(CURRENT_PAGE))) {

                // * Render each component that fulfills given conditions
                let rendered = this.Components[component].object.render();
                if (rendered) Debugger.info(`Rendered ${component} element`);
            }
        });
    }

    componentAdder(component, settings) {
        try {
            switch (component) {
                case 'MenuComponent': {return new MenuComponent(settings)}
                case 'FooterComponent': {return new FooterComponent(settings)}
            }
        } catch (ReferenceError) {}

    }

    getRenderPages(pagesSettings) {
        let component_Pages = {};

        let components = Object.keys(pagesSettings);
        components.forEach(component => {
            component_Pages[component] = pagesSettings[component].pages;
        });

        return component_Pages;
    }


    /* GETTERS */

    // Get all matching components for CURRENT_PAGE
    get getMatchingComponents() {
        let result = false;

        if (this.renderPages) {

            this.Component.allComponents.forEach(component => {
                if (this.renderPages[component.name].includes(CURRENT_PAGE)) result = true;
            });
        }

        return result;
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