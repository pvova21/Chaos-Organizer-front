import { createPopper } from '@popperjs/core';

export default class PopUpError {
  constructor() {
    this.popupMsg = document.querySelector('.error-wrapper');
  }

  show(element, text) {
    const popperInstance = createPopper(element, this.popupMsg, {
      placement: 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 6],
          },
        },
      ],
    });
    this.popupMsg.querySelector('.error-message').textContent = text;
    this.popupMsg.setAttribute('data-show', '');
    popperInstance.update();
    setTimeout(() => {
      this.popupMsg.removeAttribute('data-show');
    }, 2500);
  }
}
