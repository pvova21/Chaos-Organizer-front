import PopUpError from './PopUpError';

export default class Geolocation {
  constructor() {
    this.getGeoButton = document.querySelector('.send_geo-btn');
    this.clickEventHandler = [];
    this.registerEvents();
  }

  registerEvents() {
    this.getGeoButton.addEventListener('click', this.clickHandler.bind(this));
    this.popupError = new PopUpError();
  }

  addClickEventHandler(callback) {
    this.clickEventHandler.push(callback);
  }

  getCurrentGeolocation() {
    if (!navigator.geolocation) return;
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  async clickHandler() {
    try {
      const { coords } = await this.getCurrentGeolocation();
      const { latitude, longitude } = coords;
      const data = {
        event: 'geolocation',
        type: 'geolocation',
        message: { latitude, longitude },
      };
      this.clickEventHandler.forEach((o) => {
        o.call(null, data);
      });
    } catch (err) {
      this.popupError.show(this.getGeoButton, 'Не удалось получить координаты');
    }
  }
}
