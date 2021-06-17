// -*- coding: utf-8 -*-


class MenuComponent extends Component {
    constructor (settings) {
        this.settings = settings;

        this.html = settings.elements.html;
        this.filename = null;

        // Component HTML is not passed or is null
        if ((!this.html) || (this.html == '')) {
            Debugger.warn('Component HTML is not passed');
            this.filepath = settings.elements.file.filepath;
            this.filename = this.filepath.split('/')[(this.filepath.split('/')).length - 1];
            Debugger.log(`Using ${this.filepath} to get HTML Component code snippet`);
        }

        this.menuElement = {
            parent: settings.elements.parent,
            position: settings.elements.pos,
        };
    }

}