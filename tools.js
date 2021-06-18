let data = {
    config: require('./config.json'),
    colors: require('./colors.js')
}
/**
 * @module Tools
 * @name Tools
 * @description Script toolkit
 * @method log Log message to console
 */
class Tools {
    constructor() {
        /**
         * Console logger
         * @param {Number} level Level of log (lower = more important)
         * @param {String} message Message to show
         * @param {String} foreground Foreground color from colors.js
         * @param {String} background Background color from colors.js
         * @returns response data
         */
    };
    log = (level, message, foreground, background) => {
        let reject = (reason) => {
            response.rejected = reason;
            return response;
        };
        let response = {
            level,
            message,
            foreground,
            background,
            date: new Date().toUTCString()
        };
        if (data.config.debug < level)
            return reject("Lower debug level (config.json)");
        else if (level < 0)
            return reject("Level can't be lower than 0 (log)");
        else if (data.config.debug < 0)
            return reject("Level can't be lower than 1 (config.json)");
        let colors = {
            fg: data.colors.fg[foreground] || data.colors.fg.green,
            bg: data.colors.bg[background] || data.colors.bg.black
        };
        for (let colorID of Object.keys(data.colors)) {
            let color = data.colors[colorID];
            if(typeof color == "string") message = message.replace(`$(gb-${colorID})`, color);
        }
        for (let colorID of Object.keys(data.colors.fg)) {
            let color = data.colors.fg[colorID];
            message = message.replace(`$(fg-${colorID})`, color);
        }
        for (let colorID of Object.keys(data.colors.bg)) {
            let color = data.colors.bg[colorID];
            message = message.replace(`$(bg-${colorID})`, color);
        }
        console.log(`${data.colors.reset}${response.date} | ${data.colors.bright}${data.config.name} ${data.colors.reset}> ${colors.fg}${colors.bg}${message}`);
        return response;
    };
    randomString = (length) => {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength));
        return result;
    }
}
module.exports = Tools;