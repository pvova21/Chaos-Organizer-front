export default class Emoji {
  constructor() {
    this.emojiBtn = document.querySelector('.emoji');
    this.emojis = [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😋', '😊',
      '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙',
      '😈', '😎', '😐', '😖',
    ];
  }

  renderEmojiBox() {
    if (document.querySelector('.emoji_box')) return;
    const box = document.createElement('ul');
    box.className = 'emoji_box';
    this.emojiBtn.append(box);
    for (const item of this.emojis) {
      const newEmojiElement = document.createElement('li');
      newEmojiElement.className = 'emoji_item';
      newEmojiElement.textContent = item;
      box.append(newEmojiElement);
    }
  }
}
