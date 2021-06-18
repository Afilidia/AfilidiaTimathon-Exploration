// -*- coding: utf-8 -*-

class MenuComponent extends Component {
    constructor (settings) {
        super();

        this.settings = settings;

        this.html = settings.elements.html;
        this.filename = settings.elements.file.filename;

        // Component HTML is not passed or is null
        if ((!this.html) || (this.html == '')) {

            Debugger.warn('Component HTML is not passed');
            this.filepath = settings.elements.file.filepath;
            if (this.filename == null) this.filename = this.filepath.split('/')[(this.filepath.split('/')).length - 1];
            Debugger.log(`Using ${this.filepath} to get HTML Component code snippet`);

            this.prepareHTML();
        }

        this.menuElement = {
            parent: settings.elements.parent,
            position: settings.elements.pos,
        };
    }

    async prepareHTML() {
        this.html = await this.readFromFile(this.filepath);
        // Debugger.log(`File content: ${this.html}`);
    }

    // * Render element method
    render() {}

}