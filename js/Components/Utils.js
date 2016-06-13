module.exports = {
  getSelection(){
    let selection = window.getSelection();

    if (!selection.rangeCount) {
      return false;
    }

    let range = selection.getRangeAt(0),
        startContainer = this.findParent(range.startContainer, 'P'),
        lastContainer = this.findParent(range.endContainer, 'P');

    if (!selection.isCollapsed && startContainer === lastContainer) {
      return selection;
    }
    return false;
  },

  getRectForSelection(selection){
    let rect = selection.getRangeAt(0).getBoundingClientRect(),
      rects = selection.getRangeAt(0).getClientRects(),
      firstRect = rects[0],
      lastRect = rects[rects.length - 1];

    if (lastRect.bottom != rect.bottom) {
      rect = firstRect;
    }

    rect = {
      bottom: rect.bottom,
      height: rect.height,
      left: rect.left,
      right: rect.right,
      top: rect.top + window.scrollY,
      width: rect.width
    };

    return rect;
  },

  findParent(node, nodeName) {
    if (node.nodeName === nodeName) {
      return node
    } else if (node.parentNode && node.parentNode.nodeName === nodeName) {
      return node.parentNode;
    } else if (!node.parentNode) {
      return undefined;
    } else {
      return this.findParent(node.parentNode, nodeName)
    }
  },

  findInArray(arr, key, value) {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i][key] == value) {
        return arr[i]
      }
    }
  },

  isChildOf(node, parentNode) {
    if (node === parentNode) {
      return true
    } else if (node.parentNode && node.parentNode === parentNode) {
      return true;
    } else if (!node.parentNode) {
      return false;
    } else {
      return this.isChildOf(node.parentNode, parentNode);
    }

  },

  getPositionByNode (node) {
    var boundingRect = node.getBoundingClientRect();

    return {
      top: boundingRect.top + window.scrollY,
      height: boundingRect.height,
      left: boundingRect.left,
      width: boundingRect.width
    }
  }

};