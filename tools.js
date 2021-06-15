let data = {
    config: require('./config.json'),
    colors: require('./colors.json')
}

function Tools() {
    this.log = (level, message, foreground, background) => {
        let reject = (reason) => {
            response.rejected = reason;
            return response;
        }
        let response = {
            level,
            message,
            date: Date.now()
        }
        if(data.config.debug < level) return reject("Lower debug level (config.json)");
        else if(level < 0) return reject("Level can't be lower than 0 (log)");
        else if(data.config.debug < 0) return reject("Level can't be lower than 1 (config.json)");
        let colors = {
            fg: data.colors[foreground]||data.colors.fg.green,
            bg: data.colors[background]||data.colors.bg.black
        };
        console.log(`${response.date} | ${data.config.name} > ${colors.fg}${colors.bg}${message}`);
    }
}
module.exports = Tools;