let express = require('express');
let fs = require('fs');
let config = require('./config.json');

/**
 * ***Host manager***
 * 
 * @param {object} router
 * *Default used router*
 * ```js
 * let express = require('express');
 * let router = express.Router();
 * ```
 *  \
 * **Class variable:** \
 * router - used router \
 *  \
 * !WARNING! **You must push generated code to Express app** !WARNING!
 */
class Host {
    constructor(router) {
        this.router = router || express.Router();
    };

    /**
     * **Auto pager from path**
     *
     * @param {String} path
     * @param {String} files
     * @param {Function} checker
     * @param {String} redirect
     * @param {Boolean} log
     * @memberof Host
     */
    pager = (path, files, checker, redirect, log) => {
        fs.readdir(files, (err, fileList) => {
            if (err)
                throw err;
            fileList.forEach(file => {
                router.get(`${path}/${file}`, (req, res, next) => {
                    if (!checker(req, res, next))
                        return res.redirect(redirect);
                    res.render(file, {});
                });
            });
        });
    };
    
    page = (path, template, checker, redirect, log) => {
        router.get(path, (req, res, next) => {
            if (!checker(req, res, next))
                return res.redirect(redirect);
            res.render(template, {});
        });
    };
    customPage = (path, template, checker, redirect, renderer, log) => {
        router.get(path, (req, res, next) => {
            if (!checker(req, res, next)) return res.redirect(redirect);
            renderer(req, res, next);
        });
    };
}
module.exports = Host;