

class APIRequester {
    constructor(settings) {
        this.settings = settings;

        this.URL = 'https://api.mapbox.com/{endpoint}?access_token={your_access_token}';

        this.accessToken = this.settings.accessToken;
        this.baseURL = this.settings.baseURL;
    }

    getURL() {
        return this.baseURL + `styles/mapbox/afilidiagroup/satelites/tiles/12/12/1?access_token=${this.accessToken}`;
    }
}