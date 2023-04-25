/* eslint-disable class-methods-use-this */
import PopUpError from './PopUpError';

export default class Recorder {
  constructor() {
    this.stopEventHandler = [];
  }

  init() {
    this.registerEvents();
    this.actionBtns = document.querySelector('.media_btn-wrapper');
    this.recordBtns = document.querySelector('.record_btn-wrapper');
    this.stopBtn = document.querySelector('.stop_record-btn');
    this.popupError = new PopUpError();
  }

  registerEvents() {
    const recordAudio = document.querySelector('#record-audio-btn');
    recordAudio.addEventListener('click', this.audioRecord.bind(this));

    const recordVideo = document.querySelector('#record-video-btn');
    recordVideo.addEventListener('click', this.videoRecord.bind(this));
  }

  addStopEventHandler(callback) {
    this.stopEventHandler.push(callback);
  }

  async audioRecord() {
    try {
      let timerId = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const recorder = new MediaRecorder(stream);
      const chunk = [];

      recorder.addEventListener('start', () => {
        this.toggleButtons();
        timerId = this.timer();
      });

      recorder.addEventListener('dataavailable', (event) => {
        chunk.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        this.toggleButtons();
        clearInterval(timerId);
        const blob = new Blob(chunk, { type: 'audio/ogg; codecs=opus' });
        this.stopEventHandler.forEach((o) => {
          o.call(null, blob);
        });
      });

      const stopRecord = () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        this.stopBtn.removeEventListener('click', stopRecord);
      };

      this.stopBtn.addEventListener('click', stopRecord);
      recorder.start();
    } catch (err) {
      const recordAudioBtn = document.querySelector('.send_audio-btn');
      this.popupError.show(recordAudioBtn, err.message);
    }
  }

  async videoRecord() {
    try {
      let timerId = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      const recorder = new MediaRecorder(stream);
      const chunk = [];

      recorder.addEventListener('start', () => {
        this.toggleButtons();
        timerId = this.timer();
      });

      recorder.addEventListener('dataavailable', (event) => {
        chunk.push(event.data);
      });

      recorder.addEventListener('stop', () => {
        this.toggleButtons();
        clearInterval(timerId);
        const blob = new Blob(chunk, { type: 'video/ogg; codecs=theora' });
        this.stopEventHandler.forEach((o) => {
          o.call(null, blob);
        });
      });

      const stopRecord = () => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        this.stopBtn.removeEventListener('click', stopRecord);
      };

      this.stopBtn.addEventListener('click', stopRecord);
      recorder.start();
    } catch (err) {
      const recordVideoBtn = document.querySelector('.send_video-btn');
      this.popupError.show(recordVideoBtn, err.message);
    }
  }

  toggleButtons() {
    this.actionBtns.classList.toggle('hidden');
    this.recordBtns.classList.toggle('hidden');
  }

  timer() {
    const el = document.querySelector('.timer');
    el.textContent = '00:00';
    let minutes = 0;
    let seconds = 0;
    const intervalId = setInterval(() => {
      seconds += 1;
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }
      const min = (minutes < 10) ? `0${minutes}` : `${minutes}`;
      const sec = (seconds < 10) ? `0${seconds}` : `${seconds}`;
      el.textContent = `${min}:${sec}`;
    }, 1000);

    return intervalId;
  }
}
