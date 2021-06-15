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
function Tools() {
    /**
     * Console logger
     * @param {Number} level Level of log (lower = more important)
     * @param {String} message Message to show
     * @param {String} foreground Foreground color from colors.js
     * @param {String} background Background color from colors.js
     * @returns response data
     */
    this.log = (level, message, foreground, background) => {
        let reject = (reason) => {
            response.rejected = reason;
            return response;
        }
        let response = {
            level,
            message,
            foreground,
            background,
            date: new Date().toUTCString()
        }
        if(data.config.debug < level) return reject("Lower debug level (config.json)");
        else if(level < 0) return reject("Level can't be lower than 0 (log)");
        else if(data.config.debug < 0) return reject("Level can't be lower than 1 (config.json)");
        let colors = {
            fg: data.colors[foreground]||data.colors.fg.green,
            bg: data.colors[background]||data.colors.bg.black
        };
        console.log(`${response.date} | ${data.colors.bright}${data.config.name} ${data.colors.reset}> ${colors.fg}${colors.bg}${message}`);
        return response;
    }
}
module.exports = Tools;