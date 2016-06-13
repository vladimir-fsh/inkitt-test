import utils from './Utils';

export default class HighlightRange {
  constructor(selection, params){
    let range, node, nodeId, dependsRange = {};
    params = params || {};

    if (selection) {
      range = selection.getRangeAt(0);
      node = utils.findParent(range.startContainer, 'P');
      nodeId = node.id;
      dependsRange = this._getRangeDepends(node, range);
    }

    this.name = params.name || new Date().getTime();
    this.startOffset = dependsRange.startOffset === undefined ? params.startOffset : dependsRange.startOffset;
    this.endOffset =  dependsRange.endOffset === undefined ? params.endOffset : dependsRange.endOffset;
    this.comment = params && params.comment;
    this.nodeId = nodeId || params.nodeId;
  }

  getComment() {
    return this.comment;
  }

  changeComment(newComment) {
    return this.comment = newComment;
  }

  getOffsets() {
    return {
      startOffset: this.startOffset,
      endOffset: this.endOffset
    }
  }

  getName() {
    return this.name;
  }

  getNodeId() {
    return this.nodeId;
  }

  _getRangeDepends(parentNode, range) {
    let parentChildArray = Array.prototype.slice.call(parentNode.childNodes),
      startOffset = 0,
      endOffset = 0,
      startOffsetDelta = 0,
      endOffSetDelta = 0;

    parentChildArray.forEach((node)=>{
      if (utils.isChildOf(range.startContainer, node)) {
        startOffset = range.startOffset + startOffsetDelta;
      } else {
        startOffsetDelta += node.textContent.length
      }

      if (utils.isChildOf(range.endContainer, node)) {
        endOffset = range.endOffset + endOffSetDelta;
      } else {
        endOffSetDelta += node.textContent.length;
      }

    });
    return {
      startOffset: startOffset,
      endOffset: endOffset
    }
  }
}
