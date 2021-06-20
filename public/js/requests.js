

class APIRequester {
    static ATTRIBUTION = '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

    constructor(settings) {
        this.settings = settings;

        this.baseURL = this.settings.baseURL;

        let pattern = 'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=rQ7gZ2MALoTqCaR6vhTJ';
    }

    getURL(settings) {
        return `${this.baseURL}` +  // Base URL
                `${settings.style}/` + // Map style

                // Vectors
                `${settings.vector.z}/` +
                `${settings.vector.x}/` +
                `${settings.vector.y}` +

                // URL tail
                `${settings.fileformat}?key=${settings.key}`;
    }
}