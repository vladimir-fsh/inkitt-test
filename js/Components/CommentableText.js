import utils from './Utils';
import Highlight from './Highlight';
import Comment from './Comment';
import HighlightRange from './HighlightRange';
import Tooltip from './Tooltip';
import Storage from './Storage';
import Observer from './Observer';

export default class CommentableText {

  constructor(props){
    this.props = Object.assign({}, props);
    this.storage = new Storage();
    this.tooltip = new Tooltip();

    this._renderHtml()
        ._initHighlighter()
        ._initComment()
        ._assignEvents()
        ._highlightAll();
  }


  _assignEvents(){
    let $root = this.props.$root;

    $root.addEventListener('mouseup', this._onMouseUp.bind(this));
    $root.addEventListener('mousemove', this._onMouseMove.bind(this));
    $root.addEventListener('click', this._onRootNodeClick.bind(this));

    Observer.sub('highlight', this._onTooltipHighlightClicked.bind(this));
    Observer.sub('comment', this._onTooltipCommentClicked.bind(this));
    
    Observer.sub('commentSent', this._onCommentSent.bind(this));
    Observer.sub('commentClosed', this._onCommentClosed.bind(this));

    return this;
  }

  _initHighlighter(){
    this.props.highlighter = new Highlight(this.props.pageText);
    return this;
  }

  _initComment(){
    this.props.comment = new Comment(this.props.$root);
    return this;
  }

  _onMouseUp() {
    let selection = utils.getSelection();

    if (selection) {
      this._setLastSelection(selection);
      this.tooltip.show(selection);
    }
    return this;
  }

  _onMouseMove(e) {
    let span = e.target.closest('span');
    if (!span) {
      this._unActivateAll();
      return;
    }

    this._activate(span.getAttribute('data-highlight'));
    return this;
  }

  _onRootNodeClick(e) {
    if (e.target.hasAttribute('data-highlight')) {
      let span = e.target.closest('span');
      let nodeId = utils.findParent(span, 'P').id,
          ranges = span.getAttribute('data-highlight').split(' ').map((name)=>{
            return this.storage.getRangeByName(name, nodeId);
          });

      this.props.comment.show(ranges, utils.getPositionByNode(span));
    }

    if (e.target.hasAttribute('data-comments')) {
      this.props.comment.show(this.storage.getDataByNodeId(utils.findParent(e.target, 'P').id), utils.getPositionByNode(e.target));
    }

    return this;
  }

  _onTooltipHighlightClicked() {
    this._setNewHighlight(this._createNewHighlightRange(this._currentSelection));
    this.tooltip.hide();
    this._getLastSelection().removeAllRanges();
  }

  _createNewHighlightRange(selection) {
    return new HighlightRange(selection);
  }

  _setNewHighlight(highlightRange) {
    this.storage.saveRangeData(highlightRange);
    this._refreshNodeHighlights(highlightRange.getNodeId());

    return this;
  }

  _refreshNodeHighlights(nodeId) {
    return this._highlightRangesInNode(this.storage.getDataByNodeId(nodeId), nodeId);
  }

  _highlightRangesInNode(highlightRangeArray, nodeId) {
    this.props.$root.querySelector('#' + nodeId).innerHTML = this.props.highlighter.getHighlightedHTML(highlightRangeArray, nodeId);
    return this;
  }

  _onTooltipCommentClicked() {
    let highlightRange = this._createNewHighlightRange(this._getLastSelection());

    this.props.comment.show([highlightRange], utils.getRectForSelection(this._getLastSelection()));
    this._highlightFakeHighlightRange(highlightRange);
    this.tooltip.hide();
    this._currentSelection.removeAllRanges();
  }

  _highlightFakeHighlightRange(highlightRange) {
    let nodeId = highlightRange.getNodeId(),
      rangesArray = this.storage.getDataByNodeId(nodeId).concat([highlightRange]);

    this._highlightRangesInNode(rangesArray, nodeId);

    return this;
  }

  _onCommentClosed(highlightRange) {
    if (highlightRange) {
      this._refreshNodeHighlights(highlightRange.getNodeId());
    }
  }

  _onCommentSent(highlightRange) {
    this._setNewHighlight(highlightRange);
  }



  _highlightAll() {
    Array.prototype.slice.call(this.props.$root.querySelectorAll('p')).forEach((node)=>{
      let nodeId = node.id;
      if (this.storage.getDataByNodeId(nodeId).length) {
        node.innerHTML = this.props.highlighter.getHighlightedHTML(this.storage.getDataByNodeId(nodeId), nodeId);
      } else {
        node.innerHTML = this.props.pageText[nodeId];
      }
    })
  }


  _activate(n) {
    if (!this._canActivate(n)) {
      return false;
    }
    clearInterval(this._unActivateTimeout);
    this._activeHighlight = n;
    var arr = Array.prototype.slice.call(document.querySelectorAll('[data-highlight]'));

    arr.forEach((span)=>{
      if (n.indexOf(span.getAttribute('data-highlight')) !== -1) {
        span.className = 'active';
      } else {
        span.className = ''
      }
    })
  }
  
  _renderHtml() {
    let html = '',
        pageText = this.props.pageText;

    Object.keys(pageText).map((item)=>{
      html += `<p id="${item}">${pageText[item]}</p>`;
    });

    this.props.$root.insertAdjacentHTML("afterBegin", html);

    return this;
  }

  _setLastSelection(selection) {
    this._currentSelection = selection;
    return this;
  }

  _getLastSelection() {
    return this._currentSelection;
  }

  _unActivateAll() {
    if (!this._canUnActivate()) {
      return false;
    }
    this._unActivateTimeout = setTimeout(()=>{

      var arr = Array.prototype.slice.call(document.querySelectorAll('[data-highlight]'));

      arr.forEach((span)=>{
        span.className = '';
      })

    }, 100);
    this._activeHighlight = undefined;
  }

  _canActivate(highlightName) {
    return this._activeHighlight !== highlightName
  }

  _canUnActivate() {
    return this._activeHighlight;
  }

}