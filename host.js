let express = require('express');
let fs = require('fs');

let Tools = require('./tools.js');
let tools = new Tools();

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
 * router - used router
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
     * @param {Function} checker checker(req, res, next)
     * @param {String} redirect
     * @param {Number|Boolean} log
     * @memberof Host
     */
    pager = (path, files, checker, redirect, log) => {
        log = log ? parseInt(log) ? log : 2 : 2;
        fs.readdir(`./views/${files}`, (err, fileList) => {
            if (err) throw err;
            fileList.forEach(file => {
                if(file.slice(file.length-4, file.length-1)) {
                    file = file.slice(0, file.length-4);
                    if(log) tools.log(log, `Created endpoint $(fg-green)$(gb-bold)${(file=="index")?`${path}`:`${path}/${file}`}`, "white", "black");
                    this.router.get((file=="index")?`${path}`:`${path}/${file}`, (req, res, next) => {
                        let id = tools.randomString(10);
                        if(log) tools.log(log, `[${id}] Connection to ${path}/${file} from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`, "green", "black");
                        if (!checker(req, res, next)){
                            if(log) tools.log(log, `[${id}] Redirecting to ${redirect}`, "green", "black");
                            return res.redirect(redirect);
                        }
                        res.render(files+"/"+file, {});
                    });
                }
            });
        });
    };
    
    /**
     * **Host page**
     *
     * @param {String} path
     * @param {String} template
     * @param {Function} checker checker(req, res, next)
     * @param {String} redirect
     * @param {Number|Boolean} log
     * @memberof Host
     */
    page = (path, template, checker, redirect, log) => {
        log = log ? parseInt(log) ? log : 2 : 2;
        if(log) tools.log(log, `Created endpoint $(fg-green)$(gb-bold)${path}`, "white", "black");
        this.router.get(path, (req, res, next) => {
            if(log) tools.log(log, `[${id}] Connection to ${path} from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`, "green", "black");
            if (!checker(req, res, next)){
                if(log) tools.log(log, `[${id}] Redirecting to ${redirect}`, "green", "black");
                return res.redirect(redirect);
            }
            res.render(template, {});
        });
    };
    /**
     * **Host page with custom renderer**
     *
     * @param {String} path
     * @param {String} template
     * @param {Function} checker checker(req, res, next)
     * @param {String} redirect
     * @param {Function} renderer renderer(req, res, next)
     * @param {Number|Boolean} log
     * @memberof Host
     */
    customPage = (path, template, checker, redirect, renderer, log) => {
        log = log ? parseInt(log) ? log : 2 : 2;
        if(log) tools.log(log, `Created endpoint $(fg-green)$(gb-bold)${path}`, "white", "black");
        this.router.get(path, (req, res, next) => {
            if(log) tools.log(log, `[${id}] Connection to ${path} from ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`, "green", "black");
            if (!checker(req, res, next)){
                if(log) tools.log(log, `[${id}] Redirecting to ${redirect}`, "green", "black");
                return res.redirect(redirect);
            }
            renderer(req, res, next);
        });
    };
}

module.exports = Host;