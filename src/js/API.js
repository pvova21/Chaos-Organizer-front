import PopUpError from './PopUpError';
import Messages from './Messages';
import Dnd from './Dnd';
import Geolocation from './Geolocation';
import Recorder from './Recorder';
import Emoji from './Emoji';

export default class API {
  constructor(URL) {
    this.messages = new Messages();
    this.popupError = new PopUpError();
    this.dnd = new Dnd();
    this.dnd.init();
    this.recorder = new Recorder();
    this.recorder.init();
    this.geolocation = new Geolocation();
    this.emoji = new Emoji();

    this.wss = null;
    this.URL = URL;
    this.messagesField = document.querySelector('.recieved_messages');
    this.connectBtn = document.querySelector('.connect_btn');
  }

  connectWSS() {
    this.wss = new WebSocket(this.URL);

    this.wss.addEventListener('open', () => {
      this.setConnectState(true);
      this.onLoad();
    });

    this.wss.addEventListener('close', () => {
      this.setConnectState(false);
    });

    this.wss.addEventListener('error', () => {
      this.setConnectState(false);
    });

    this.wss.addEventListener('message', (event) => {
      const response = JSON.parse(event.data);
      this.receivedMessageHandler(response);
    });
  }

  sendMessageData(obj) {
    const data = JSON.stringify(obj);
    this.wss.send(data);
  }

  fileLoader(file) {
    const { name, type } = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result;
      this.sendMessageData({
        event: 'upLoadFile',
        file: base64,
        type: 'file',
        info: {
          name,
          category: type,
        },
      });
    };
  }

  async receivedMessageHandler(data) {
    switch (data.event) {
      case 'newMessage':
      case 'command':
      case 'geolocation':
        await this.messagesField.append(
          this.messages.createElement(data),
        );
        this.messagesField.scrollTop = this.messagesField.scrollHeight;
        break;
      case 'getLastMessage':
        this.renderLastMessage(data);
        this.messagesField.scrollTop = this.messagesField.scrollHeight;
        break;
      case 'getHistory':
        this.renderHistory(data);
        break;
      case 'upLoadFile':
        await this.renderFileMessage(data);
        this.messagesField.scrollTop = this.messagesField.scrollHeight;
        break;
      default:
    }
  }

  onLoad(id = null) {
    this.sendMessageData({
      id,
      event: 'getLastMessage',
    });
  }

  onLoadHistory(id) {
    this.sendMessageData({
      id,
      event: 'getHistory',
    });
  }

  async renderFileMessage(data) {
    const element = await this.messages.createElement(data);
    if (element) {
      await this.messagesField.append(element);
    } else {
      const sendButton = document.querySelector('.file_upload-btn');
      this.popupError.show(sendButton, 'Не верный формат файла');
    }
  }

  renderLastMessage(data) {
    if (!data.status) return;
    data.message.forEach((msg) => {
      const element = this.messages.createElement(msg);
      this.messagesField.append(element);
    });
  }

  renderHistory(data) {
    if (!data.status) return;
    const currentTopScroll = this.messagesField.scrollHeight - this.messagesField.clientHeight;
    data.message.forEach((msg) => {
      const element = this.messages.createElement(msg);
      this.messagesField.firstElementChild.before(element);
      const newTopScroll = this.messagesField.scrollHeight - this.messagesField.clientHeight;
      this.messagesField.scrollTop = newTopScroll - currentTopScroll;
    });
  }

  async handleSubmitForm(event) {
    event.preventDefault();
    const inputEl = event.target.elements.send;
    const data = inputEl.value.trim();
    if (data === '') {
      this.popupError.show(inputEl, 'Пустое поле');
      return;
    }

    const requestData = {
      message: data,
      type: 'text',
    };

    if (data.startsWith('/get weather')) {
      try {
        const location = await this.geolocation.getCurrentGeolocation();
        const { latitude, longitude } = location.coords;
        requestData.event = 'command';
        requestData.location = { latitude, longitude };
        this.sendMessageData(requestData);
      } catch (err) {
        const geoButton = document.querySelector('.send_geo-btn');
        this.popupError.show(geoButton, err.message);
      }
    }

    if (data.startsWith('/get') && !data.startsWith('/get weather')) {
      requestData.event = 'command';
      this.sendMessageData(requestData);
    }

    this.sendMessageData({
      event: 'newMessage',
      message: data,
      type: 'text',
    });
    inputEl.value = '';
  }

  setConnectState(status) {
    const statusState = document.querySelector('#status-state');
    if (status) {
      statusState.className = 'status_state-online';
      this.connectBtn.setAttribute('disabled', true);
      this.connectBtn.textContent = 'Connected';
    } else {
      statusState.className = 'status_state-offline';
      this.connectBtn.removeAttribute('disabled');
      this.connectBtn.textContent = 'Connect';
    }
  }

  registerEvents() {
    const inputForm = document.querySelector('#send-form');
    inputForm.addEventListener('submit', this.handleSubmitForm.bind(this));

    this.connectBtn.addEventListener('click', this.connectWSS.bind(this));

    this.dnd.addLoadFileHandler(this.fileLoader.bind(this));

    this.geolocation.addClickEventHandler(this.sendMessageData.bind(this));

    this.recorder.addStopEventHandler(this.fileLoader.bind(this));

    this.messagesField.addEventListener('scroll', () => {
      const topCoords = this.messagesField.scrollTop;
      if (topCoords === 0) {
        const { id } = this.messagesField.firstElementChild.dataset;
        this.onLoadHistory(id);
      }
    });

    const inputField = inputForm.send;
    inputField.addEventListener('keyup', (event) => {
      if (event.keyCode === 39 && inputField.value === '') {
        inputField.value = '/get ';
      }
    });

    const smileIcon = document.querySelector('.emoji');
    smileIcon.addEventListener('click', (ev) => {
      if (document.querySelector('.emoji_box') && (ev.target === smileIcon)) {
        smileIcon.firstElementChild.remove();
        return;
      }
      this.emoji.renderEmojiBox();
      const emojiBox = document.querySelector('.emoji_box');
      emojiBox.addEventListener('click', (event) => {
        inputField.value += event.target.textContent;
      }, { once: true });
    });
  }

  init() {
    this.connectWSS();
    this.registerEvents();
  }
}
