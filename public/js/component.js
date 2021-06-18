// -*- coding: utf-8 -*-


class Component {
    constructor () {
        this.allComponents = [
            {name: 'FooterComponent'},
            {name: 'MenuComponent'}
        ];
    }

    async readFromFile(filepath) {
        let content = await new Promise(function(resolve, reject) {
            fetch(filepath)
            .then(res => res.text())
            .then(res => resolve(res));
        }).catch((err) => {console.log(err)});

        return content;
    }

    async getHTML(filepath) {
        return await this.readFromFile(filepath);
    }

    checkIfHTMLInserted() {
        return false;
    }

    checkIfCSSInserted() {
        return false;
    }
}