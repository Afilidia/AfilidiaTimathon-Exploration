// -*- coding: utf-8 -*-


class Component {
    constructor () {
        this.allComponents = [
            {name: 'FooterComponent'},
            {name: 'MenuComponent'}
        ];
    }

    readFromFile(filename) {
        let content = '';

        Promise.all([
            fetch(filename).then(result => result.text()),
        ]).then(response => {
            content = response[0];
        });

        console.log(content);
        return content;
    }
}