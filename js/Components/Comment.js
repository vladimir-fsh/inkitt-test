import template from 'lodash/template';
import utils from './Utils';
import Observer from './Observer';

export default class Tooltip {
  constructor(contentNode){
    this.contentNode = contentNode;

    this._renderView()
      ._assignEvents();
  }
  
  _assignEvents() {
    this.root.addEventListener('keydown', this._onKeyDown.bind(this));
    this.root.addEventListener('keyup', this._onKeyPress.bind(this));
    this.root.addEventListener('mouseup', this._onRootClick.bind(this));

    document.body.addEventListener('mousedown', this._onBodyClick.bind(this));

    return this;
  }

  _onRootClick(e) {
    switch (true) {
      case e.target.hasAttribute('data-send-comment-btn'):
        this._sendCurrentComment();
        break;

      case e.target.hasAttribute('data-cancel-comment-btn'):
        this.hide();
        break;
    }
  }

  _onKeyDown(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault()
    }
  }

  _onKeyPress(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      this._sendCurrentComment();
    }
    if (e.keyCode === 27) {
      this.hide();
    }
  }


  _renderView() {
    this.root = document.createElement('div');
    this.root.className = 'comment-block';
    document.body.appendChild(this.root);
    return this;
  }

  _editableCommentTpl (data) {
    return (
      template(`
        <div class="comment-user" class="comment-user"><%= userName %></div>
        <textarea class="comment-textarea" data-user-textarea placeholder="Write a node..."></textarea>
        <div class="comment-btns">
          <span data-send-comment-btn class="comment-btn submit-btn">Send</span>
          <span data-cancel-comment-btn class="comment-btn">Cancel</span>          
        </div>
      `)(data)
    )
  }

  _readCommentTpl (data) {
    return (
      template(`
          <div class="comment-user" class="comment-user"><%= userName %></div>
          <div class="comment-list">
            <% comments.map((item)=> { %>
              <div class="comment-text"><%= item.comment %></div>
            <% })  %>
          </div>
      `)(data)
    )
  }

  _saveHighlightRange(highlightRange) {
    this._highlightRange = highlightRange;
    return this;
  }

  _getUserData() {
    return {
      userName: 'Just me'
    }
  }

  show(ranges, nodePosition) {
    let userData = this._getUserData(),
        position = this._getCommentPos(nodePosition),
        template = this._editableCommentTpl(userData),
        comments = ranges.filter((r)=>r.getComment()),
        rc = this.root.style;

    if (comments.length) {
      template = this._readCommentTpl(Object.assign(userData, {comments}));
    } else {
      this._saveHighlightRange(ranges[0]);
    }

    this.root.innerHTML = template;
    rc.top = position.top;
    rc.left = position.left;
    rc.right = position.right;
    rc.bottom = position.bottom;
    rc.opacity = 1;
    this.root.className = 'comment-block actived';

    setTimeout(()=>{
      if (!comments.length) {
        this.root.querySelector('[data-user-textarea]').focus();
      }
      this._showed = true;
      Observer.pub('commentOpened');
    }, 10);
  }

  _getCommentPos(nodePos){
    let right = 'auto',
        left = 'auto',
        top = 'auto',
        bottom = 'auto',
        commentWidth = this.root.offsetWidth,
        commentHeight = Math.max(this.root.offsetHeight, 200),
        contentPos = this.contentNode.getBoundingClientRect().right,
        bodyWidth = document.body.offsetWidth,
        bodyHeight = document.body.offsetHeight,
        canPositionedRight = (bodyWidth - contentPos.right) > commentWidth,
        canPositionedBottom = (bodyHeight - nodePos.top) > commentHeight;

    this._setCurrentPos(nodePos);

    if (canPositionedRight) {
      left = contentPos.right + 'px';
    } else {
      right = '0px';
    }

    if (canPositionedBottom) {
      top = nodePos.top + 'px';
    } else {
      bottom = '0px';
    }

    return {left, right, top, bottom};
  }

  hide() {
    this.root.style.opacity = 0;
    this.root.style.top = '-9999px';
    this.root.style.bottom = 'auto';
    this.root.className = 'comment-block';
    this._showed = false;
    Observer.pub('commentClosed', this._highlightRange);
  }

  _onBodyClick(e){
    if (this._showed && !utils.isChildOf(e.target, this.root)) {
      this.hide();
    }
  }

  _setCurrentPos(pos) {
    this.currentPos = pos;
  }

  _getCurrentPos() {
    return this.currentPos;
  }

  _sendCurrentComment() {
    if (this._highlightRange) {
      let textareaVal = this.root.querySelector('[data-user-textarea]').value;

      if (!textareaVal.trim()) {
        return false;
      }

      this._highlightRange.changeComment(textareaVal);
      Observer.pub('commentSent', this._highlightRange);
      this.show([this._highlightRange], this._getCurrentPos());
    } else {
      this.hide();
    }
  }
}
