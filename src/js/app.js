import API from './API';

const URL = 'ws://localhost:8080/ws';

export default class App {
  constructor() {
    this.api = new API(URL);
  }

  init() {
    this.api.init();
  }
}
