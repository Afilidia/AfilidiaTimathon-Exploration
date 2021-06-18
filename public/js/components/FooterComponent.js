// -*- coding: utf-8 -*-


class FooterComponent extends Component {
    constructor (settings) {
        super();

        this.settings = settings;

        this.html = settings.elements.html;
        this.filename = settings.elements.file.filename;

        this.HTMLempty = false;

        // Component HTML is not passed or is null
        if ((!this.html) || (this.html == '')) {

            Debugger.warn('Component HTML is not passed');
            this.filepath = settings.elements.file.filepath;
            if (this.filename == null) this.filename = this.filepath.split('/')[(this.filepath.split('/')).length - 1];
            Debugger.log(`Using ${this.filepath} to get HTML Component code snippet`);

            this.HTMLempty = true;
        }

        this.footerElement = {
            parent: settings.parent,
            position: settings.pos,
        };
    }

    // * Render element method
    async render() {

        // Debugger.log(`File content: ${this.html}`);
        const getHTML = await new Promise(async (resolve, reject) => {
            try {
                var HTML = await this.getHTML(this.filepath);
                resolve(HTML);

            } catch (error) {
                console.log(error);
                reject(error);
            }
        });

        this.html = getHTML;

        try {
            // * Check if HTML element is already inserted into body tag
            let HTMLAlready = this.checkIfHTMLInserted();
            if (HTMLAlready == false) document.body.insertAdjacentHTML(this.footerElement.position, this.html);

            // * Check if CSS is already in document
            let CSSAlready = this.checkIfCSSInserted();
            if (CSSAlready == false) console.log();

            Debugger.log('Render done - FooterComponent');

            return true;

        } catch(error) {
            Debugger.error('FooterComponent, render() - ' + error);
        }
    }
}