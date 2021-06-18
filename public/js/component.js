// -*- coding: utf-8 -*-


class Component {
    constructor () {
        this.allComponents = [
            {name: 'FooterComponent'},
            {name: 'MenuComponent'}
        ];
    }

    readFromFile(filepath) {
        let content = '';

        Promise.all([
            fetch(filepath).then(result => result.text()),
        ]).then(response => {
            content = response[0];
        });

        console.log(content);
        return content;
    }
}