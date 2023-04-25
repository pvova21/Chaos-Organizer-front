export default class Dnd {
  constructor() {
    this.loadFileHandler = [];
  }

  init() {
    this.registerEvents();
  }

  registerEvents() {
    const loadButton = document.querySelector('.file_upload-btn');
    const inputFile = document.querySelector('#file_upload-field');
    const dragZone = document.querySelector('.recieved_messages');
    dragZone.addEventListener('dragover', this.constructor.dragOverHandler);
    dragZone.addEventListener('drop', this.dropHandler.bind(this));

    loadButton.addEventListener('click', () => {
      inputFile.dispatchEvent(new MouseEvent('click'));
    });
    inputFile.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      this.onLoad(file);
      inputFile.value = '';
    });
  }

  addLoadFileHandler(callback) {
    this.loadFileHandler.push(callback);
  }

  onLoad(file) {
    this.loadFileHandler.forEach((o) => {
      o.call(null, file);
    });
  }

  static dragOverHandler(event) {
    event.preventDefault();
  }

  dropHandler(event) {
    event.preventDefault();
    const file = Array.from(event.dataTransfer.files)[0];
    if (!file) return;
    this.onLoad(file);
  }
}
