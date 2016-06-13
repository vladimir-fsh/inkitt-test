/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _CommentableText = __webpack_require__(1);
	
	var _CommentableText2 = _interopRequireDefault(_CommentableText);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	new _CommentableText2.default({
	  pageText: initialText,
	  $root: document.getElementById('main')
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(2);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	var _Highlight = __webpack_require__(3);
	
	var _Highlight2 = _interopRequireDefault(_Highlight);
	
	var _Comment = __webpack_require__(5);
	
	var _Comment2 = _interopRequireDefault(_Comment);
	
	var _HighlightRange = __webpack_require__(60);
	
	var _HighlightRange2 = _interopRequireDefault(_HighlightRange);
	
	var _Tooltip = __webpack_require__(61);
	
	var _Tooltip2 = _interopRequireDefault(_Tooltip);
	
	var _Storage = __webpack_require__(62);
	
	var _Storage2 = _interopRequireDefault(_Storage);
	
	var _Observer = __webpack_require__(59);
	
	var _Observer2 = _interopRequireDefault(_Observer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var CommentableText = function () {
	  function CommentableText(props) {
	    _classCallCheck(this, CommentableText);
	
	    this.props = Object.assign({}, props);
	    this.storage = new _Storage2.default();
	    this.tooltip = new _Tooltip2.default();
	
	    this._renderHtml()._initHighlighter()._initComment()._assignEvents()._highlightAll();
	  }
	
	  _createClass(CommentableText, [{
	    key: '_assignEvents',
	    value: function _assignEvents() {
	      var $root = this.props.$root;
	
	      $root.addEventListener('mouseup', this._onMouseUp.bind(this));
	      $root.addEventListener('mousemove', this._onMouseMove.bind(this));
	      $root.addEventListener('click', this._onRootNodeClick.bind(this));
	
	      _Observer2.default.sub('highlight', this._onTooltipHighlightClicked.bind(this));
	      _Observer2.default.sub('comment', this._onTooltipCommentClicked.bind(this));
	
	      _Observer2.default.sub('commentSent', this._onCommentSent.bind(this));
	      _Observer2.default.sub('commentClosed', this._onCommentClosed.bind(this));
	
	      return this;
	    }
	  }, {
	    key: '_initHighlighter',
	    value: function _initHighlighter() {
	      this.props.highlighter = new _Highlight2.default(this.props.pageText);
	      return this;
	    }
	  }, {
	    key: '_initComment',
	    value: function _initComment() {
	      this.props.comment = new _Comment2.default(this.props.$root);
	      return this;
	    }
	  }, {
	    key: '_onMouseUp',
	    value: function _onMouseUp() {
	      var selection = _Utils2.default.getSelection();
	
	      if (selection) {
	        this._setLastSelection(selection);
	        this.tooltip.show(selection);
	      }
	      return this;
	    }
	  }, {
	    key: '_onMouseMove',
	    value: function _onMouseMove(e) {
	      var span = e.target.closest('span');
	      if (!span) {
	        this._unActivateAll();
	        return;
	      }
	
	      this._activate(span.getAttribute('data-highlight'));
	      return this;
	    }
	  }, {
	    key: '_onRootNodeClick',
	    value: function _onRootNodeClick(e) {
	      var _this = this;
	
	      if (e.target.hasAttribute('data-highlight')) {
	        (function () {
	          var span = e.target.closest('span');
	          var nodeId = _Utils2.default.findParent(span, 'P').id,
	              ranges = span.getAttribute('data-highlight').split(' ').map(function (name) {
	            return _this.storage.getRangeByName(name, nodeId);
	          });
	
	          _this.props.comment.show(ranges, _Utils2.default.getPositionByNode(span));
	        })();
	      }
	
	      if (e.target.hasAttribute('data-comments')) {
	        this.props.comment.show(this.storage.getDataByNodeId(_Utils2.default.findParent(e.target, 'P').id), _Utils2.default.getPositionByNode(e.target));
	      }
	
	      return this;
	    }
	  }, {
	    key: '_onTooltipHighlightClicked',
	    value: function _onTooltipHighlightClicked() {
	      this._setNewHighlight(this._createNewHighlightRange(this._currentSelection));
	      this.tooltip.hide();
	      this._getLastSelection().removeAllRanges();
	    }
	  }, {
	    key: '_createNewHighlightRange',
	    value: function _createNewHighlightRange(selection) {
	      return new _HighlightRange2.default(selection);
	    }
	  }, {
	    key: '_setNewHighlight',
	    value: function _setNewHighlight(highlightRange) {
	      this.storage.saveRangeData(highlightRange);
	      this._refreshNodeHighlights(highlightRange.getNodeId());
	
	      return this;
	    }
	  }, {
	    key: '_refreshNodeHighlights',
	    value: function _refreshNodeHighlights(nodeId) {
	      return this._highlightRangesInNode(this.storage.getDataByNodeId(nodeId), nodeId);
	    }
	  }, {
	    key: '_highlightRangesInNode',
	    value: function _highlightRangesInNode(highlightRangeArray, nodeId) {
	      this.props.$root.querySelector('#' + nodeId).innerHTML = this.props.highlighter.getHighlightedHTML(highlightRangeArray, nodeId);
	      return this;
	    }
	  }, {
	    key: '_onTooltipCommentClicked',
	    value: function _onTooltipCommentClicked() {
	      var highlightRange = this._createNewHighlightRange(this._getLastSelection());
	
	      this.props.comment.show([highlightRange], _Utils2.default.getRectForSelection(this._getLastSelection()));
	      this._highlightFakeHighlightRange(highlightRange);
	      this.tooltip.hide();
	      this._currentSelection.removeAllRanges();
	    }
	  }, {
	    key: '_highlightFakeHighlightRange',
	    value: function _highlightFakeHighlightRange(highlightRange) {
	      var nodeId = highlightRange.getNodeId(),
	          rangesArray = this.storage.getDataByNodeId(nodeId).concat([highlightRange]);
	
	      this._highlightRangesInNode(rangesArray, nodeId);
	
	      return this;
	    }
	  }, {
	    key: '_onCommentClosed',
	    value: function _onCommentClosed(highlightRange) {
	      if (highlightRange) {
	        this._refreshNodeHighlights(highlightRange.getNodeId());
	      }
	    }
	  }, {
	    key: '_onCommentSent',
	    value: function _onCommentSent(highlightRange) {
	      this._setNewHighlight(highlightRange);
	    }
	  }, {
	    key: '_highlightAll',
	    value: function _highlightAll() {
	      var _this2 = this;
	
	      Array.prototype.slice.call(this.props.$root.querySelectorAll('p')).forEach(function (node) {
	        var nodeId = node.id;
	        if (_this2.storage.getDataByNodeId(nodeId).length) {
	          node.innerHTML = _this2.props.highlighter.getHighlightedHTML(_this2.storage.getDataByNodeId(nodeId), nodeId);
	        } else {
	          node.innerHTML = _this2.props.pageText[nodeId];
	        }
	      });
	    }
	  }, {
	    key: '_activate',
	    value: function _activate(n) {
	      if (!this._canActivate(n)) {
	        return false;
	      }
	      clearInterval(this._unActivateTimeout);
	      this._activeHighlight = n;
	      var arr = Array.prototype.slice.call(document.querySelectorAll('[data-highlight]'));
	
	      arr.forEach(function (span) {
	        if (n.indexOf(span.getAttribute('data-highlight')) !== -1) {
	          span.className = 'active';
	        } else {
	          span.className = '';
	        }
	      });
	    }
	  }, {
	    key: '_renderHtml',
	    value: function _renderHtml() {
	      var html = '',
	          pageText = this.props.pageText;
	
	      Object.keys(pageText).map(function (item) {
	        html += '<p id="' + item + '">' + pageText[item] + '</p>';
	      });
	
	      this.props.$root.insertAdjacentHTML("afterBegin", html);
	
	      return this;
	    }
	  }, {
	    key: '_setLastSelection',
	    value: function _setLastSelection(selection) {
	      this._currentSelection = selection;
	      return this;
	    }
	  }, {
	    key: '_getLastSelection',
	    value: function _getLastSelection() {
	      return this._currentSelection;
	    }
	  }, {
	    key: '_unActivateAll',
	    value: function _unActivateAll() {
	      if (!this._canUnActivate()) {
	        return false;
	      }
	      this._unActivateTimeout = setTimeout(function () {
	
	        var arr = Array.prototype.slice.call(document.querySelectorAll('[data-highlight]'));
	
	        arr.forEach(function (span) {
	          span.className = '';
	        });
	      }, 100);
	      this._activeHighlight = undefined;
	    }
	  }, {
	    key: '_canActivate',
	    value: function _canActivate(highlightName) {
	      return this._activeHighlight !== highlightName;
	    }
	  }, {
	    key: '_canUnActivate',
	    value: function _canUnActivate() {
	      return this._activeHighlight;
	    }
	  }]);
	
	  return CommentableText;
	}();
	
	exports.default = CommentableText;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  getSelection: function getSelection() {
	    var selection = window.getSelection();
	
	    if (!selection.rangeCount) {
	      return false;
	    }
	
	    var range = selection.getRangeAt(0),
	        startContainer = this.findParent(range.startContainer, 'P'),
	        lastContainer = this.findParent(range.endContainer, 'P');
	
	    if (!selection.isCollapsed && startContainer === lastContainer) {
	      return selection;
	    }
	    return false;
	  },
	  getRectForSelection: function getRectForSelection(selection) {
	    var rect = selection.getRangeAt(0).getBoundingClientRect(),
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
	  findParent: function findParent(node, nodeName) {
	    if (node.nodeName === nodeName) {
	      return node;
	    } else if (node.parentNode && node.parentNode.nodeName === nodeName) {
	      return node.parentNode;
	    } else if (!node.parentNode) {
	      return undefined;
	    } else {
	      return this.findParent(node.parentNode, nodeName);
	    }
	  },
	  findInArray: function findInArray(arr, key, value) {
	    for (var i = 0; i < arr.length; i += 1) {
	      if (arr[i][key] == value) {
	        return arr[i];
	      }
	    }
	  },
	  isChildOf: function isChildOf(node, parentNode) {
	    if (node === parentNode) {
	      return true;
	    } else if (node.parentNode && node.parentNode === parentNode) {
	      return true;
	    } else if (!node.parentNode) {
	      return false;
	    } else {
	      return this.isChildOf(node.parentNode, parentNode);
	    }
	  },
	  getPositionByNode: function getPositionByNode(node) {
	    var boundingRect = node.getBoundingClientRect();
	
	    return {
	      top: boundingRect.top + window.scrollY,
	      height: boundingRect.height,
	      left: boundingRect.left,
	      width: boundingRect.width
	    };
	  }
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _RangesFlatter = __webpack_require__(4);
	
	var _RangesFlatter2 = _interopRequireDefault(_RangesFlatter);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Highlighter = function () {
	  function Highlighter(pageData) {
	    _classCallCheck(this, Highlighter);
	
	    this._pageData = pageData;
	  }
	
	  _createClass(Highlighter, [{
	    key: 'getHighlightedHTML',
	    value: function getHighlightedHTML(ranges, name) {
	      if (!ranges.length) {
	        return this._pageData[name];
	      }
	      this._sourceRanges = ranges;
	      ranges = _RangesFlatter2.default.doItFlat(ranges);
	
	      var arrayForWrap = this._getArrayForWrap(ranges, this._pageData[name]);
	
	      return this._wrapAndConcat(arrayForWrap);
	    }
	  }, {
	    key: '_wrapAndConcat',
	    value: function _wrapAndConcat(arr) {
	      var res = '',
	          commentCount = 0;
	
	      this._sourceRanges.forEach(function (range) {
	        if (range.comment) {
	          commentCount += 1;
	        }
	      });
	
	      arr.forEach(function (item) {
	        if (item.type === 'simple') {
	          res += item.text;
	        } else {
	          res += '<span data-highlight="' + item.name + '">' + item.text + '</span>';
	        }
	      });
	
	      if (commentCount) {
	        if (commentCount > 1) {
	          res += '<div class="comment-link" data-comments="' + this._sourceRanges[0].nodeId + '"> You left a comments (' + commentCount + ')</div>';
	        } else {
	          res += '<div class="comment-link" data-comments="' + this._sourceRanges[0].nodeId + '"> You left a comment</div>';
	        }
	      }
	
	      return res;
	    }
	  }, {
	    key: '_getArrayForWrap',
	    value: function _getArrayForWrap(ranges, str) {
	      var resultArray = [],
	          lastOffset = 0;
	
	      ranges.forEach(function (range, i) {
	        if (range.name) {
	          var s = str.substr(lastOffset);
	          resultArray.push({
	            type: 'simple',
	            text: s.substr(0, range.startOffset - lastOffset)
	          });
	
	          resultArray.push({
	            type: 'wrap',
	            name: range.name,
	            text: s.substring(range.startOffset - lastOffset, range.endOffset - lastOffset)
	          });
	
	          lastOffset = range.endOffset;
	        }
	      });
	
	      resultArray.push({
	        type: 'simple',
	        text: str.substr(lastOffset)
	      });
	
	      return resultArray;
	    }
	  }]);
	
	  return Highlighter;
	}();
	
	exports.default = Highlighter;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	var removeDuplicates = function removeDuplicates(arr) {
	  var resHash = {};
	
	  return arr.filter(function (a) {
	    var res = !resHash.hasOwnProperty(a);
	    resHash[a] = 1;
	    return res;
	  });
	};
	
	var doItFlat = function doItFlat(ranges) {
	  ranges = ranges.sort(function (a, b) {
	    return b.startOffset < a.startOffset ? 1 : b.startOffset > a.startOffset ? -1 : 0;
	  });
	
	  var path = {},
	      flattered = [],
	      start = ranges[0].startOffset,
	      end = ranges.sort(function (a, b) {
	    return b.endOffset > a.endOffset ? 1 : b.endOffset < a.endOffset ? -1 : 0;
	  })[0].endOffset;
	
	  while (start < end) {
	
	    var startObject = getStartObject();
	    var s = startObject.startOffset;
	    var names = startObject.names;
	
	    var endObject = getEndObject();
	    var e = endObject.endOffset;
	
	    start = e;
	    flattered.push({
	      name: removeDuplicates(names).join(' '),
	      startOffset: s,
	      endOffset: e
	    });
	  }
	
	  function getStartObject() {
	    var names = [],
	        res = start,
	        deleted = [];
	
	    for (var p in path) {
	      if (path[p].endOffset === start) {
	        deleted.push(p);
	      }
	
	      if (path[p].endOffset > start) {
	        names.push(p);
	
	        if (path[p].endOffset < res) {
	          res = path[p].endOffset;
	        }
	      }
	    }
	
	    deleted.forEach(function (d) {
	      delete path[d];
	    });
	
	    for (var r = 0; r < ranges.length; r += 1) {
	      if (ranges[r].startOffset <= res && ranges[r].startOffset >= start) {
	        names.push(ranges[r].name);
	      }
	    }
	
	    start = res;
	    return {
	      names: names,
	      startOffset: res
	    };
	  }
	
	  function getEndObject() {
	    var res = end;
	
	    for (var p in path) {
	
	      if (path[p].endOffset > start) {
	        if (path[p].endOffset < res) {
	          res = path[p].endOffset;
	        }
	      }
	    }
	
	    for (var r = 0; r < ranges.length; r += 1) {
	      if (start < ranges[r].startOffset) {
	        if (ranges[r].startOffset < res) {
	          res = ranges[r].startOffset;
	        }
	      }
	      if (start < ranges[r].endOffset) {
	        if (ranges[r].endOffset < res) {
	          res = ranges[r].endOffset;
	        }
	      }
	    }
	
	    for (var _r = 0; _r < ranges.length; _r += 1) {
	      if (res < ranges[_r].endOffset && res > ranges[_r].startOffset) {
	        path[ranges[_r].name] = ranges[_r];
	      }
	    }
	
	    start = res;
	    return {
	      endOffset: res
	    };
	  }
	
	  return flattered;
	};
	
	module.exports = {
	  doItFlat: doItFlat
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _template = __webpack_require__(6);
	
	var _template2 = _interopRequireDefault(_template);
	
	var _Utils = __webpack_require__(2);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	var _Observer = __webpack_require__(59);
	
	var _Observer2 = _interopRequireDefault(_Observer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tooltip = function () {
	  function Tooltip(contentNode) {
	    _classCallCheck(this, Tooltip);
	
	    this.contentNode = contentNode;
	
	    this._renderView()._assignEvents();
	  }
	
	  _createClass(Tooltip, [{
	    key: '_assignEvents',
	    value: function _assignEvents() {
	      this.root.addEventListener('keydown', this._onKeyDown.bind(this));
	      this.root.addEventListener('keyup', this._onKeyPress.bind(this));
	      this.root.addEventListener('mouseup', this._onRootClick.bind(this));
	
	      document.body.addEventListener('mousedown', this._onBodyClick.bind(this));
	
	      return this;
	    }
	  }, {
	    key: '_onRootClick',
	    value: function _onRootClick(e) {
	      switch (true) {
	        case e.target.hasAttribute('data-send-comment-btn'):
	          this._sendCurrentComment();
	          break;
	
	        case e.target.hasAttribute('data-cancel-comment-btn'):
	          this.hide();
	          break;
	      }
	    }
	  }, {
	    key: '_onKeyDown',
	    value: function _onKeyDown(e) {
	      if (e.keyCode === 13 && !e.shiftKey) {
	        e.preventDefault();
	      }
	    }
	  }, {
	    key: '_onKeyPress',
	    value: function _onKeyPress(e) {
	      if (e.keyCode === 13 && !e.shiftKey) {
	        this._sendCurrentComment();
	      }
	      if (e.keyCode === 27) {
	        this.hide();
	      }
	    }
	  }, {
	    key: '_renderView',
	    value: function _renderView() {
	      this.root = document.createElement('div');
	      this.root.className = 'comment-block';
	      document.body.appendChild(this.root);
	      return this;
	    }
	  }, {
	    key: '_editableCommentTpl',
	    value: function _editableCommentTpl(data) {
	      return (0, _template2.default)('\n        <div class="comment-user" class="comment-user"><%= userName %></div>\n        <textarea class="comment-textarea" data-user-textarea placeholder="Write a node..."></textarea>\n        <div class="comment-btns">\n          <span data-send-comment-btn class="comment-btn submit-btn">Send</span>\n          <span data-cancel-comment-btn class="comment-btn">Cancel</span>          \n        </div>\n      ')(data);
	    }
	  }, {
	    key: '_readCommentTpl',
	    value: function _readCommentTpl(data) {
	      return (0, _template2.default)('\n          <div class="comment-user" class="comment-user"><%= userName %></div>\n          <div class="comment-list">\n            <% comments.map((item)=> { %>\n              <div class="comment-text"><%= item.comment %></div>\n            <% })  %>\n          </div>\n      ')(data);
	    }
	  }, {
	    key: '_saveHighlightRange',
	    value: function _saveHighlightRange(highlightRange) {
	      this._highlightRange = highlightRange;
	      return this;
	    }
	  }, {
	    key: '_getUserData',
	    value: function _getUserData() {
	      return {
	        userName: 'Just me'
	      };
	    }
	  }, {
	    key: 'show',
	    value: function show(ranges, nodePosition) {
	      var _this = this;
	
	      var userData = this._getUserData(),
	          position = this._getCommentPos(nodePosition),
	          template = this._editableCommentTpl(userData),
	          comments = ranges.filter(function (r) {
	        return r.getComment();
	      }),
	          rc = this.root.style;
	
	      if (comments.length) {
	        template = this._readCommentTpl(Object.assign(userData, { comments: comments }));
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
	
	      setTimeout(function () {
	        if (!comments.length) {
	          _this.root.querySelector('[data-user-textarea]').focus();
	        }
	        _this._showed = true;
	        _Observer2.default.pub('commentOpened');
	      }, 10);
	    }
	  }, {
	    key: '_getCommentPos',
	    value: function _getCommentPos(nodePos) {
	      var right = 'auto',
	          left = 'auto',
	          top = 'auto',
	          bottom = 'auto',
	          commentWidth = this.root.offsetWidth,
	          commentHeight = Math.max(this.root.offsetHeight, 200),
	          contentPos = this.contentNode.getBoundingClientRect().right,
	          bodyWidth = document.body.offsetWidth,
	          bodyHeight = document.body.offsetHeight,
	          canPositionedRight = bodyWidth - contentPos.right > commentWidth,
	          canPositionedBottom = bodyHeight - nodePos.top > commentHeight;
	
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
	
	      return { left: left, right: right, top: top, bottom: bottom };
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.root.style.opacity = 0;
	      this.root.style.top = '-9999px';
	      this.root.style.bottom = 'auto';
	      this.root.className = 'comment-block';
	      this._showed = false;
	      _Observer2.default.pub('commentClosed', this._highlightRange);
	    }
	  }, {
	    key: '_onBodyClick',
	    value: function _onBodyClick(e) {
	      if (this._showed && !_Utils2.default.isChildOf(e.target, this.root)) {
	        this.hide();
	      }
	    }
	  }, {
	    key: '_setCurrentPos',
	    value: function _setCurrentPos(pos) {
	      this.currentPos = pos;
	    }
	  }, {
	    key: '_getCurrentPos',
	    value: function _getCurrentPos() {
	      return this.currentPos;
	    }
	  }, {
	    key: '_sendCurrentComment',
	    value: function _sendCurrentComment() {
	      if (this._highlightRange) {
	        var textareaVal = this.root.querySelector('[data-user-textarea]').value;
	
	        if (!textareaVal.trim()) {
	          return false;
	        }
	
	        this._highlightRange.changeComment(textareaVal);
	        _Observer2.default.pub('commentSent', this._highlightRange);
	        this.show([this._highlightRange], this._getCurrentPos());
	      } else {
	        this.hide();
	      }
	    }
	  }]);
	
	  return Tooltip;
	}();
	
	exports.default = Tooltip;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var assignInDefaults = __webpack_require__(7),
	    assignInWith = __webpack_require__(9),
	    attempt = __webpack_require__(41),
	    baseValues = __webpack_require__(43),
	    escapeStringChar = __webpack_require__(45),
	    isError = __webpack_require__(42),
	    isIterateeCall = __webpack_require__(13),
	    keys = __webpack_require__(46),
	    reInterpolate = __webpack_require__(50),
	    templateSettings = __webpack_require__(51),
	    toString = __webpack_require__(54);
	
	/** Used to match empty string literals in compiled template source. */
	var reEmptyStringLeading = /\b__p \+= '';/g,
	    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
	    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
	
	/**
	 * Used to match
	 * [ES template delimiters](http://ecma-international.org/ecma-262/6.0/#sec-template-literal-lexical-components).
	 */
	var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
	
	/** Used to ensure capturing order of template delimiters. */
	var reNoMatch = /($^)/;
	
	/** Used to match unescaped characters in compiled string literals. */
	var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
	
	/**
	 * Creates a compiled template function that can interpolate data properties
	 * in "interpolate" delimiters, HTML-escape interpolated data properties in
	 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
	 * properties may be accessed as free variables in the template. If a setting
	 * object is given, it takes precedence over `_.templateSettings` values.
	 *
	 * **Note:** In the development build `_.template` utilizes
	 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
	 * for easier debugging.
	 *
	 * For more information on precompiling templates see
	 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
	 *
	 * For more information on Chrome extension sandboxes see
	 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The template string.
	 * @param {Object} [options={}] The options object.
	 * @param {RegExp} [options.escape=_.templateSettings.escape]
	 *  The HTML "escape" delimiter.
	 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
	 *  The "evaluate" delimiter.
	 * @param {Object} [options.imports=_.templateSettings.imports]
	 *  An object to import into the template as free variables.
	 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
	 *  The "interpolate" delimiter.
	 * @param {string} [options.sourceURL='templateSources[n]']
	 *  The sourceURL of the compiled template.
	 * @param {string} [options.variable='obj']
	 *  The data object variable name.
	 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
	 * @returns {Function} Returns the compiled template function.
	 * @example
	 *
	 * // Use the "interpolate" delimiter to create a compiled template.
	 * var compiled = _.template('hello <%= user %>!');
	 * compiled({ 'user': 'fred' });
	 * // => 'hello fred!'
	 *
	 * // Use the HTML "escape" delimiter to escape data property values.
	 * var compiled = _.template('<b><%- value %></b>');
	 * compiled({ 'value': '<script>' });
	 * // => '<b>&lt;script&gt;</b>'
	 *
	 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
	 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
	 * compiled({ 'users': ['fred', 'barney'] });
	 * // => '<li>fred</li><li>barney</li>'
	 *
	 * // Use the internal `print` function in "evaluate" delimiters.
	 * var compiled = _.template('<% print("hello " + user); %>!');
	 * compiled({ 'user': 'barney' });
	 * // => 'hello barney!'
	 *
	 * // Use the ES delimiter as an alternative to the default "interpolate" delimiter.
	 * var compiled = _.template('hello ${ user }!');
	 * compiled({ 'user': 'pebbles' });
	 * // => 'hello pebbles!'
	 *
	 * // Use backslashes to treat delimiters as plain text.
	 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
	 * compiled({ 'value': 'ignored' });
	 * // => '<%- value %>'
	 *
	 * // Use the `imports` option to import `jQuery` as `jq`.
	 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
	 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
	 * compiled({ 'users': ['fred', 'barney'] });
	 * // => '<li>fred</li><li>barney</li>'
	 *
	 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
	 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
	 * compiled(data);
	 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
	 *
	 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
	 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
	 * compiled.source;
	 * // => function(data) {
	 * //   var __t, __p = '';
	 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
	 * //   return __p;
	 * // }
	 *
	 * // Use custom template delimiters.
	 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
	 * var compiled = _.template('hello {{ user }}!');
	 * compiled({ 'user': 'mustache' });
	 * // => 'hello mustache!'
	 *
	 * // Use the `source` property to inline compiled templates for meaningful
	 * // line numbers in error messages and stack traces.
	 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
	 *   var JST = {\
	 *     "main": ' + _.template(mainText).source + '\
	 *   };\
	 * ');
	 */
	function template(string, options, guard) {
	  // Based on John Resig's `tmpl` implementation
	  // (http://ejohn.org/blog/javascript-micro-templating/)
	  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
	  var settings = templateSettings.imports._.templateSettings || templateSettings;
	
	  if (guard && isIterateeCall(string, options, guard)) {
	    options = undefined;
	  }
	  string = toString(string);
	  options = assignInWith({}, options, settings, assignInDefaults);
	
	  var imports = assignInWith({}, options.imports, settings.imports, assignInDefaults),
	      importsKeys = keys(imports),
	      importsValues = baseValues(imports, importsKeys);
	
	  var isEscaping,
	      isEvaluating,
	      index = 0,
	      interpolate = options.interpolate || reNoMatch,
	      source = "__p += '";
	
	  // Compile the regexp to match each delimiter.
	  var reDelimiters = RegExp(
	    (options.escape || reNoMatch).source + '|' +
	    interpolate.source + '|' +
	    (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
	    (options.evaluate || reNoMatch).source + '|$'
	  , 'g');
	
	  // Use a sourceURL for easier debugging.
	  var sourceURL = 'sourceURL' in options ? '//# sourceURL=' + options.sourceURL + '\n' : '';
	
	  string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
	    interpolateValue || (interpolateValue = esTemplateValue);
	
	    // Escape characters that can't be included in string literals.
	    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar);
	
	    // Replace delimiters with snippets.
	    if (escapeValue) {
	      isEscaping = true;
	      source += "' +\n__e(" + escapeValue + ") +\n'";
	    }
	    if (evaluateValue) {
	      isEvaluating = true;
	      source += "';\n" + evaluateValue + ";\n__p += '";
	    }
	    if (interpolateValue) {
	      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
	    }
	    index = offset + match.length;
	
	    // The JS engine embedded in Adobe products needs `match` returned in
	    // order to produce the correct `offset` value.
	    return match;
	  });
	
	  source += "';\n";
	
	  // If `variable` is not specified wrap a with-statement around the generated
	  // code to add the data object to the top of the scope chain.
	  var variable = options.variable;
	  if (!variable) {
	    source = 'with (obj) {\n' + source + '\n}\n';
	  }
	  // Cleanup code by stripping empty strings.
	  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
	    .replace(reEmptyStringMiddle, '$1')
	    .replace(reEmptyStringTrailing, '$1;');
	
	  // Frame code as the function body.
	  source = 'function(' + (variable || 'obj') + ') {\n' +
	    (variable
	      ? ''
	      : 'obj || (obj = {});\n'
	    ) +
	    "var __t, __p = ''" +
	    (isEscaping
	       ? ', __e = _.escape'
	       : ''
	    ) +
	    (isEvaluating
	      ? ', __j = Array.prototype.join;\n' +
	        "function print() { __p += __j.call(arguments, '') }\n"
	      : ';\n'
	    ) +
	    source +
	    'return __p\n}';
	
	  var result = attempt(function() {
	    return Function(importsKeys, sourceURL + 'return ' + source)
	      .apply(undefined, importsValues);
	  });
	
	  // Provide the compiled function's source by its `toString` method or
	  // the `source` property as a convenience for inlining compiled templates.
	  result.source = source;
	  if (isError(result)) {
	    throw result;
	  }
	  return result;
	}
	
	module.exports = template;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(8);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used by `_.defaults` to customize its `_.assignIn` use.
	 *
	 * @private
	 * @param {*} objValue The destination value.
	 * @param {*} srcValue The source value.
	 * @param {string} key The key of the property to assign.
	 * @param {Object} object The parent object of `objValue`.
	 * @returns {*} Returns the value to assign.
	 */
	function assignInDefaults(objValue, srcValue, key, object) {
	  if (objValue === undefined ||
	      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
	    return srcValue;
	  }
	  return objValue;
	}
	
	module.exports = assignInDefaults;


/***/ },
/* 8 */
/***/ function(module, exports) {

	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	module.exports = eq;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var copyObject = __webpack_require__(10),
	    createAssigner = __webpack_require__(12),
	    keysIn = __webpack_require__(28);
	
	/**
	 * This method is like `_.assignIn` except that it accepts `customizer`
	 * which is invoked to produce the assigned values. If `customizer` returns
	 * `undefined`, assignment is handled by the method instead. The `customizer`
	 * is invoked with five arguments: (objValue, srcValue, key, object, source).
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @alias extendWith
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} sources The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @returns {Object} Returns `object`.
	 * @see _.assignWith
	 * @example
	 *
	 * function customizer(objValue, srcValue) {
	 *   return _.isUndefined(objValue) ? srcValue : objValue;
	 * }
	 *
	 * var defaults = _.partialRight(_.assignInWith, customizer);
	 *
	 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
	 * // => { 'a': 1, 'b': 2 }
	 */
	var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
	  copyObject(source, keysIn(source), object, customizer);
	});
	
	module.exports = assignInWith;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var assignValue = __webpack_require__(11);
	
	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	
	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : source[key];
	
	    assignValue(object, key, newValue);
	  }
	  return object;
	}
	
	module.exports = copyObject;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(8);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    object[key] = value;
	  }
	}
	
	module.exports = assignValue;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var isIterateeCall = __webpack_require__(13),
	    rest = __webpack_require__(21);
	
	/**
	 * Creates a function like `_.assign`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return rest(function(object, sources) {
	    var index = -1,
	        length = sources.length,
	        customizer = length > 1 ? sources[length - 1] : undefined,
	        guard = length > 2 ? sources[2] : undefined;
	
	    customizer = (assigner.length > 3 && typeof customizer == 'function')
	      ? (length--, customizer)
	      : undefined;
	
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    object = Object(object);
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, index, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var eq = __webpack_require__(8),
	    isArrayLike = __webpack_require__(14),
	    isIndex = __webpack_require__(20),
	    isObject = __webpack_require__(18);
	
	/**
	 * Checks if the given arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
	 *  else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	        ? (isArrayLike(object) && isIndex(index, object.length))
	        : (type == 'string' && index in object)
	      ) {
	    return eq(object[index], value);
	  }
	  return false;
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(15),
	    isFunction = __webpack_require__(17),
	    isLength = __webpack_require__(19);
	
	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value)) && !isFunction(value);
	}
	
	module.exports = isArrayLike;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(16);
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a
	 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
	 * Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	module.exports = getLength;


/***/ },
/* 16 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new accessor function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	module.exports = baseProperty;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 18 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 19 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length,
	 *  else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 20 */
/***/ function(module, exports) {

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return !!length &&
	    (typeof value == 'number' || reIsUint.test(value)) &&
	    (value > -1 && value % 1 == 0 && value < length);
	}
	
	module.exports = isIndex;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(22),
	    toInteger = __webpack_require__(23);
	
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as
	 * an array.
	 *
	 * **Note:** This method is based on the
	 * [rest parameter](https://mdn.io/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.rest(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function rest(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : toInteger(start), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        array = Array(length);
	
	    while (++index < length) {
	      array[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, array);
	      case 1: return func.call(this, args[0], array);
	      case 2: return func.call(this, args[0], args[1], array);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = array;
	    return apply(func, this, otherArgs);
	  };
	}
	
	module.exports = rest;


/***/ },
/* 22 */
/***/ function(module, exports) {

	/**
	 * A faster alternative to `Function#apply`, this function invokes `func`
	 * with the `this` binding of `thisArg` and the arguments of `args`.
	 *
	 * @private
	 * @param {Function} func The function to invoke.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {Array} args The arguments to invoke `func` with.
	 * @returns {*} Returns the result of `func`.
	 */
	function apply(func, thisArg, args) {
	  var length = args.length;
	  switch (length) {
	    case 0: return func.call(thisArg);
	    case 1: return func.call(thisArg, args[0]);
	    case 2: return func.call(thisArg, args[0], args[1]);
	    case 3: return func.call(thisArg, args[0], args[1], args[2]);
	  }
	  return func.apply(thisArg, args);
	}
	
	module.exports = apply;


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var toFinite = __webpack_require__(24);
	
	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;
	
	  return result === result ? (remainder ? result - remainder : result) : 0;
	}
	
	module.exports = toInteger;


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var toNumber = __webpack_require__(25);
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0,
	    MAX_INTEGER = 1.7976931348623157e+308;
	
	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}
	
	module.exports = toFinite;


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(17),
	    isObject = __webpack_require__(18),
	    isSymbol = __webpack_require__(26);
	
	/** Used as references for various `Number` constants. */
	var NAN = 0 / 0;
	
	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;
	
	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
	
	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;
	
	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;
	
	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;
	
	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = isFunction(value.valueOf) ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}
	
	module.exports = toNumber;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(27);
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}
	
	module.exports = isSymbol;


/***/ },
/* 27 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var baseKeysIn = __webpack_require__(29),
	    indexKeys = __webpack_require__(34),
	    isIndex = __webpack_require__(20),
	    isPrototype = __webpack_require__(40);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  var index = -1,
	      isProto = isPrototype(object),
	      props = baseKeysIn(object),
	      propsLength = props.length,
	      indexes = indexKeys(object),
	      skipIndexes = !!indexes,
	      result = indexes || [],
	      length = result.length;
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var Reflect = __webpack_require__(30),
	    iteratorToArray = __webpack_require__(33);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Built-in value references. */
	var enumerate = Reflect ? Reflect.enumerate : undefined,
	    propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * The base implementation of `_.keysIn` which doesn't skip the constructor
	 * property of prototypes or treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  object = object == null ? object : Object(object);
	
	  var result = [];
	  for (var key in object) {
	    result.push(key);
	  }
	  return result;
	}
	
	// Fallback for IE < 9 with es6-shim.
	if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
	  baseKeysIn = function(object) {
	    return iteratorToArray(enumerate(object));
	  };
	}
	
	module.exports = baseKeysIn;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(31);
	
	/** Built-in value references. */
	var Reflect = root.Reflect;
	
	module.exports = Reflect;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var checkGlobal = __webpack_require__(32);
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(typeof global == 'object' && global);
	
	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(typeof self == 'object' && self);
	
	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(typeof this == 'object' && this);
	
	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();
	
	module.exports = root;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 32 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}
	
	module.exports = checkGlobal;


/***/ },
/* 33 */
/***/ function(module, exports) {

	/**
	 * Converts `iterator` to an array.
	 *
	 * @private
	 * @param {Object} iterator The iterator to convert.
	 * @returns {Array} Returns the converted array.
	 */
	function iteratorToArray(iterator) {
	  var data,
	      result = [];
	
	  while (!(data = iterator.next()).done) {
	    result.push(data.value);
	  }
	  return result;
	}
	
	module.exports = iteratorToArray;


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var baseTimes = __webpack_require__(35),
	    isArguments = __webpack_require__(36),
	    isArray = __webpack_require__(38),
	    isLength = __webpack_require__(19),
	    isString = __webpack_require__(39);
	
	/**
	 * Creates an array of index keys for `object` values of arrays,
	 * `arguments` objects, and strings, otherwise `null` is returned.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array|null} Returns index keys, else `null`.
	 */
	function indexKeys(object) {
	  var length = object ? object.length : undefined;
	  if (isLength(length) &&
	      (isArray(object) || isString(object) || isArguments(object))) {
	    return baseTimes(length, String);
	  }
	  return null;
	}
	
	module.exports = indexKeys;


/***/ },
/* 35 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.times` without support for iteratee shorthands
	 * or max array length checks.
	 *
	 * @private
	 * @param {number} n The number of times to invoke `iteratee`.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the array of results.
	 */
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);
	
	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}
	
	module.exports = baseTimes;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLikeObject = __webpack_require__(37);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}
	
	module.exports = isArguments;


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(14),
	    isObjectLike = __webpack_require__(27);
	
	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}
	
	module.exports = isArrayLikeObject;


/***/ },
/* 38 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	module.exports = isArray;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(38),
	    isObjectLike = __webpack_require__(27);
	
	/** `Object#toString` result references. */
	var stringTag = '[object String]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `String` primitive or object.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isString('abc');
	 * // => true
	 *
	 * _.isString(1);
	 * // => false
	 */
	function isString(value) {
	  return typeof value == 'string' ||
	    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
	}
	
	module.exports = isString;


/***/ },
/* 40 */
/***/ function(module, exports) {

	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;
	
	  return value === proto;
	}
	
	module.exports = isPrototype;


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var apply = __webpack_require__(22),
	    isError = __webpack_require__(42),
	    rest = __webpack_require__(21);
	
	/**
	 * Attempts to invoke `func`, returning either the result or the caught error
	 * object. Any additional arguments are provided to `func` when it's invoked.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Util
	 * @param {Function} func The function to attempt.
	 * @param {...*} [args] The arguments to invoke `func` with.
	 * @returns {*} Returns the `func` result or error object.
	 * @example
	 *
	 * // Avoid throwing errors for invalid selectors.
	 * var elements = _.attempt(function(selector) {
	 *   return document.querySelectorAll(selector);
	 * }, '>_>');
	 *
	 * if (_.isError(elements)) {
	 *   elements = [];
	 * }
	 */
	var attempt = rest(function(func, args) {
	  try {
	    return apply(func, undefined, args);
	  } catch (e) {
	    return isError(e) ? e : new Error(e);
	  }
	});
	
	module.exports = attempt;


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var isObjectLike = __webpack_require__(27);
	
	/** `Object#toString` result references. */
	var errorTag = '[object Error]';
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
	 * `SyntaxError`, `TypeError`, or `URIError` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an error object,
	 *  else `false`.
	 * @example
	 *
	 * _.isError(new Error);
	 * // => true
	 *
	 * _.isError(Error);
	 * // => false
	 */
	function isError(value) {
	  if (!isObjectLike(value)) {
	    return false;
	  }
	  return (objectToString.call(value) == errorTag) ||
	    (typeof value.message == 'string' && typeof value.name == 'string');
	}
	
	module.exports = isError;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var arrayMap = __webpack_require__(44);
	
	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  return arrayMap(props, function(key) {
	    return object[key];
	  });
	}
	
	module.exports = baseValues;


/***/ },
/* 44 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.map` for arrays without support for iteratee
	 * shorthands.
	 *
	 * @private
	 * @param {Array} [array] The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns the new mapped array.
	 */
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array ? array.length : 0,
	      result = Array(length);
	
	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}
	
	module.exports = arrayMap;


/***/ },
/* 45 */
/***/ function(module, exports) {

	/** Used to escape characters for inclusion in compiled string literals. */
	var stringEscapes = {
	  '\\': '\\',
	  "'": "'",
	  '\n': 'n',
	  '\r': 'r',
	  '\u2028': 'u2028',
	  '\u2029': 'u2029'
	};
	
	/**
	 * Used by `_.template` to escape characters for inclusion in compiled string literals.
	 *
	 * @private
	 * @param {string} chr The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeStringChar(chr) {
	  return '\\' + stringEscapes[chr];
	}
	
	module.exports = escapeStringChar;


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	var baseHas = __webpack_require__(47),
	    baseKeys = __webpack_require__(49),
	    indexKeys = __webpack_require__(34),
	    isArrayLike = __webpack_require__(14),
	    isIndex = __webpack_require__(20),
	    isPrototype = __webpack_require__(40);
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  var isProto = isPrototype(object);
	  if (!(isProto || isArrayLike(object))) {
	    return baseKeys(object);
	  }
	  var indexes = indexKeys(object),
	      skipIndexes = !!indexes,
	      result = indexes || [],
	      length = result.length;
	
	  for (var key in object) {
	    if (baseHas(object, key) &&
	        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
	        !(isProto && key == 'constructor')) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keys;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var getPrototype = __webpack_require__(48);
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * The base implementation of `_.has` without support for deep paths.
	 *
	 * @private
	 * @param {Object} [object] The object to query.
	 * @param {Array|string} key The key to check.
	 * @returns {boolean} Returns `true` if `key` exists, else `false`.
	 */
	function baseHas(object, key) {
	  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
	  // that are composed entirely of index properties, return `false` for
	  // `hasOwnProperty` checks of them.
	  return object != null &&
	    (hasOwnProperty.call(object, key) ||
	      (typeof object == 'object' && key in object && getPrototype(object) === null));
	}
	
	module.exports = baseHas;


/***/ },
/* 48 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetPrototype = Object.getPrototypeOf;
	
	/**
	 * Gets the `[[Prototype]]` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {null|Object} Returns the `[[Prototype]]`.
	 */
	function getPrototype(value) {
	  return nativeGetPrototype(Object(value));
	}
	
	module.exports = getPrototype;


/***/ },
/* 49 */
/***/ function(module, exports) {

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = Object.keys;
	
	/**
	 * The base implementation of `_.keys` which doesn't skip the constructor
	 * property of prototypes or treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  return nativeKeys(Object(object));
	}
	
	module.exports = baseKeys;


/***/ },
/* 50 */
/***/ function(module, exports) {

	/** Used to match template delimiters. */
	var reInterpolate = /<%=([\s\S]+?)%>/g;
	
	module.exports = reInterpolate;


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var escape = __webpack_require__(52),
	    reEscape = __webpack_require__(57),
	    reEvaluate = __webpack_require__(58),
	    reInterpolate = __webpack_require__(50);
	
	/**
	 * By default, the template delimiters used by lodash are like those in
	 * embedded Ruby (ERB). Change the following template settings to use
	 * alternative delimiters.
	 *
	 * @static
	 * @memberOf _
	 * @type {Object}
	 */
	var templateSettings = {
	
	  /**
	   * Used to detect `data` property values to be HTML-escaped.
	   *
	   * @memberOf _.templateSettings
	   * @type {RegExp}
	   */
	  'escape': reEscape,
	
	  /**
	   * Used to detect code to be evaluated.
	   *
	   * @memberOf _.templateSettings
	   * @type {RegExp}
	   */
	  'evaluate': reEvaluate,
	
	  /**
	   * Used to detect `data` property values to inject.
	   *
	   * @memberOf _.templateSettings
	   * @type {RegExp}
	   */
	  'interpolate': reInterpolate,
	
	  /**
	   * Used to reference the data object in the template text.
	   *
	   * @memberOf _.templateSettings
	   * @type {string}
	   */
	  'variable': '',
	
	  /**
	   * Used to import variables into the compiled template.
	   *
	   * @memberOf _.templateSettings
	   * @type {Object}
	   */
	  'imports': {
	
	    /**
	     * A reference to the `lodash` function.
	     *
	     * @memberOf _.templateSettings.imports
	     * @type {Function}
	     */
	    '_': { 'escape': escape }
	  }
	};
	
	module.exports = templateSettings;


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var escapeHtmlChar = __webpack_require__(53),
	    toString = __webpack_require__(54);
	
	/** Used to match HTML entities and HTML characters. */
	var reUnescapedHtml = /[&<>"'`]/g,
	    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
	
	/**
	 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
	 * their corresponding HTML entities.
	 *
	 * **Note:** No other characters are escaped. To escape additional
	 * characters use a third-party library like [_he_](https://mths.be/he).
	 *
	 * Though the ">" character is escaped for symmetry, characters like
	 * ">" and "/" don't need escaping in HTML and have no special meaning
	 * unless they're part of a tag or unquoted attribute value. See
	 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	 * (under "semi-related fun fact") for more details.
	 *
	 * Backticks are escaped because in IE < 9, they can break out of
	 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
	 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
	 * [#133](https://html5sec.org/#133) of the
	 * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
	 *
	 * When working with HTML you should always
	 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
	 * XSS vectors.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escape('fred, barney, & pebbles');
	 * // => 'fred, barney, &amp; pebbles'
	 */
	function escape(string) {
	  string = toString(string);
	  return (string && reHasUnescapedHtml.test(string))
	    ? string.replace(reUnescapedHtml, escapeHtmlChar)
	    : string;
	}
	
	module.exports = escape;


/***/ },
/* 53 */
/***/ function(module, exports) {

	/** Used to map characters to HTML entities. */
	var htmlEscapes = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;',
	  '`': '&#96;'
	};
	
	/**
	 * Used by `_.escape` to convert characters to HTML entities.
	 *
	 * @private
	 * @param {string} chr The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeHtmlChar(chr) {
	  return htmlEscapes[chr];
	}
	
	module.exports = escapeHtmlChar;


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(55);
	
	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}
	
	module.exports = toString;


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var Symbol = __webpack_require__(56),
	    isSymbol = __webpack_require__(26);
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;
	
	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	module.exports = baseToString;


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var root = __webpack_require__(31);
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	module.exports = Symbol;


/***/ },
/* 57 */
/***/ function(module, exports) {

	/** Used to match template delimiters. */
	var reEscape = /<%-([\s\S]+?)%>/g;
	
	module.exports = reEscape;


/***/ },
/* 58 */
/***/ function(module, exports) {

	/** Used to match template delimiters. */
	var reEvaluate = /<%([\s\S]+?)%>/g;
	
	module.exports = reEvaluate;


/***/ },
/* 59 */
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Observer = function () {
	  function Observer() {
	    _classCallCheck(this, Observer);
	
	    this._callbackHash = {};
	  }
	
	  _createClass(Observer, [{
	    key: "sub",
	    value: function sub(eventName, callback) {
	      if (!this._callbackHash[eventName]) {
	        this._callbackHash[eventName] = [];
	      }
	
	      this._callbackHash[eventName].push(callback);
	    }
	  }, {
	    key: "pub",
	    value: function pub(eventName, data) {
	      if (!this._callbackHash[eventName]) {
	        return false;
	      }
	
	      this._callbackHash[eventName].forEach(function (cb) {
	        cb(data);
	      });
	
	      return true;
	    }
	  }]);
	
	  return Observer;
	}();
	
	module.exports = new Observer();

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Utils = __webpack_require__(2);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var HighlightRange = function () {
	  function HighlightRange(selection, params) {
	    _classCallCheck(this, HighlightRange);
	
	    var range = void 0,
	        node = void 0,
	        nodeId = void 0,
	        dependsRange = {};
	    params = params || {};
	
	    if (selection) {
	      range = selection.getRangeAt(0);
	      node = _Utils2.default.findParent(range.startContainer, 'P');
	      nodeId = node.id;
	      dependsRange = this._getRangeDepends(node, range);
	    }
	
	    this.name = params.name || new Date().getTime();
	    this.startOffset = dependsRange.startOffset === undefined ? params.startOffset : dependsRange.startOffset;
	    this.endOffset = dependsRange.endOffset === undefined ? params.endOffset : dependsRange.endOffset;
	    this.comment = params && params.comment;
	    this.nodeId = nodeId || params.nodeId;
	  }
	
	  _createClass(HighlightRange, [{
	    key: 'getComment',
	    value: function getComment() {
	      return this.comment;
	    }
	  }, {
	    key: 'changeComment',
	    value: function changeComment(newComment) {
	      return this.comment = newComment;
	    }
	  }, {
	    key: 'getOffsets',
	    value: function getOffsets() {
	      return {
	        startOffset: this.startOffset,
	        endOffset: this.endOffset
	      };
	    }
	  }, {
	    key: 'getName',
	    value: function getName() {
	      return this.name;
	    }
	  }, {
	    key: 'getNodeId',
	    value: function getNodeId() {
	      return this.nodeId;
	    }
	  }, {
	    key: '_getRangeDepends',
	    value: function _getRangeDepends(parentNode, range) {
	      var parentChildArray = Array.prototype.slice.call(parentNode.childNodes),
	          startOffset = 0,
	          endOffset = 0,
	          startOffsetDelta = 0,
	          endOffSetDelta = 0;
	
	      parentChildArray.forEach(function (node) {
	        if (_Utils2.default.isChildOf(range.startContainer, node)) {
	          startOffset = range.startOffset + startOffsetDelta;
	        } else {
	          startOffsetDelta += node.textContent.length;
	        }
	
	        if (_Utils2.default.isChildOf(range.endContainer, node)) {
	          endOffset = range.endOffset + endOffSetDelta;
	        } else {
	          endOffSetDelta += node.textContent.length;
	        }
	      });
	      return {
	        startOffset: startOffset,
	        endOffset: endOffset
	      };
	    }
	  }]);
	
	  return HighlightRange;
	}();
	
	exports.default = HighlightRange;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Observer = __webpack_require__(59);
	
	var _Observer2 = _interopRequireDefault(_Observer);
	
	var _template2 = __webpack_require__(6);
	
	var _template3 = _interopRequireDefault(_template2);
	
	var _Utils = __webpack_require__(2);
	
	var _Utils2 = _interopRequireDefault(_Utils);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Tooltip = function () {
	  function Tooltip() {
	    _classCallCheck(this, Tooltip);
	
	    this.root = null;
	
	    this._renderView()._assignEvents();
	  }
	
	  _createClass(Tooltip, [{
	    key: '_assignEvents',
	    value: function _assignEvents() {
	      this.root.addEventListener('mousedown', this._onRootClick.bind(this));
	      document.body.addEventListener('mousedown', this._onBodyClick.bind(this));
	
	      return this;
	    }
	  }, {
	    key: '_onRootClick',
	    value: function _onRootClick(e) {
	      switch (e.target.getAttribute('data-tooltip-btn')) {
	        case 'highlight':
	          _Observer2.default.pub('highlight');
	          break;
	
	        case 'comment':
	          _Observer2.default.pub('comment');
	          break;
	      }
	    }
	  }, {
	    key: '_renderView',
	    value: function _renderView() {
	      this.root = document.createElement('div');
	
	      this.root.className = 'tooltip';
	      this.root.innerHTML = this._template();
	
	      document.body.appendChild(this.root);
	      return this;
	    }
	  }, {
	    key: '_template',
	    value: function _template(data) {
	      return (0, _template3.default)('\n          <span data-tooltip-btn="highlight" class="icon-tooltip icon-highlight"></span>\n          <span data-tooltip-btn="comment" class="icon-tooltip icon-comment"></span>\n      ')(data);
	    }
	  }, {
	    key: 'show',
	    value: function show(selection) {
	      var pos = _Utils2.default.getRectForSelection(selection),
	          clazz = void 0,
	          top = void 0;
	
	      if (pos.top - 40 < window.scrollY) {
	        top = pos.top + pos.height + 10 + 'px';
	        clazz = 'tooltip actived tooltip-arrow-up';
	      } else {
	        top = pos.top - 35 + 'px';
	        clazz = 'tooltip actived tooltip-arrow-down';
	      }
	
	      this.root.style.top = top;
	      this.root.style.left = pos.left + pos.width / 2 - this.root.offsetWidth / 2 + 'px';
	      this.root.style.opacity = 1;
	      this.root.className = clazz;
	      this._showed = true;
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.root.style.opacity = 0;
	      this.root.style.top = '-9999px';
	      this.root.className = 'tooltip';
	      this._showed = false;
	    }
	  }, {
	    key: '_onBodyClick',
	    value: function _onBodyClick(e) {
	      if (this._showed && !_Utils2.default.isChildOf(e.target, this.root)) {
	        this.hide();
	      }
	    }
	  }]);
	
	  return Tooltip;
	}();
	
	exports.default = Tooltip;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _HighlightRange = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./HighlightRange   \""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	
	var _HighlightRange2 = _interopRequireDefault(_HighlightRange);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Storage = function () {
	  function Storage() {
	    _classCallCheck(this, Storage);
	  }
	
	  _createClass(Storage, [{
	    key: 'saveRangeData',
	    value: function saveRangeData(range) {
	      var highlights = this._getAllDataFromLS(),
	          nodeId = range.getNodeId();
	
	      if (!highlights[nodeId]) {
	        highlights[nodeId] = [];
	      }
	
	      var targetRange = this.getRangeByName(range.name, nodeId, highlights[nodeId]);
	
	      if (targetRange) {
	        highlights[nodeId][highlights[nodeId].indexOf(targetRange)] = range;
	      } else {
	        highlights[nodeId].push(range);
	      }
	
	      localStorage.setItem('highlights', JSON.stringify(highlights));
	    }
	  }, {
	    key: 'getRangeByName',
	    value: function getRangeByName(name, nodeId, rangesArray) {
	      var ranges = rangesArray || this.getDataByNodeId(nodeId);
	      for (var i = 0; i < ranges.length; i += 1) {
	        if (ranges[i].name == name) {
	          return ranges[i];
	        }
	      }
	    }
	  }, {
	    key: 'getDataByNodeId',
	    value: function getDataByNodeId(nodeId) {
	      var highlights = this._getAllDataFromLS();
	
	      if (highlights && highlights[nodeId]) {
	        return highlights[nodeId].map(function (hl) {
	          return new _HighlightRange2.default(null, hl);
	        });
	      }
	
	      return [];
	    }
	  }, {
	    key: '_getAllDataFromLS',
	    value: function _getAllDataFromLS() {
	      var highlights = localStorage.getItem('highlights');
	
	      return highlights ? JSON.parse(highlights) : {};
	    }
	  }]);
	
	  return Storage;
	}();
	
	exports.default = Storage;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map