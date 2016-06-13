import Observer from './Observer';
import template from 'lodash/template';
import utils from './Utils';

export default class Tooltip {
  constructor(){
    this.root = null;

    this._renderView()
        ._assignEvents();
  }

  _assignEvents() {
    this.root.addEventListener('mousedown', this._onRootClick.bind(this));
    document.body.addEventListener('mousedown', this._onBodyClick.bind(this));

    return this;
  }

  _onRootClick(e) {
    switch (e.target.getAttribute('data-tooltip-btn')) {
      case 'highlight':
        Observer.pub('highlight');
        break;

      case 'comment':
        Observer.pub('comment');
        break;
    }
  }

  _renderView() {
    this.root = document.createElement('div');

    this.root.className = 'tooltip';
    this.root.innerHTML = this._template();

    document.body.appendChild(this.root);
    return this;
  }

  _template (data) {
    return (
      template(`
          <span data-tooltip-btn="highlight" class="icon-tooltip icon-highlight"></span>
          <span data-tooltip-btn="comment" class="icon-tooltip icon-comment"></span>
      `)(data)
    )
  }

  show(selection) {
    let pos = utils.getRectForSelection(selection),
        clazz,
        top;

    if (pos.top - 40 < window.scrollY) {
      top = pos.top + pos.height + 10 + 'px';
      clazz = 'tooltip actived tooltip-arrow-up';

    } else {
      top = pos.top - 35 + 'px';
      clazz = 'tooltip actived tooltip-arrow-down';
    }

    this.root.style.top = top;
    this.root.style.left = pos.left + pos.width/2 - (this.root.offsetWidth / 2) + 'px';
    this.root.style.opacity = 1;
    this.root.className = clazz;
    this._showed = true;
  }

  hide() {
    this.root.style.opacity = 0;
    this.root.style.top = '-9999px';
    this.root.className = 'tooltip';
    this._showed = false;
  }

  _onBodyClick(e){
    if (this._showed && !utils.isChildOf(e.target, this.root)) {
      this.hide();
    }
  }
}
