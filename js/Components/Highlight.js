import RangesFlatter from './RangesFlatter';

export default class Highlighter {
  constructor(pageData){
    this._pageData = pageData;
  }

  getHighlightedHTML(ranges, name) {
    if (!ranges.length) {
      return this._pageData[name];
    }
    this._sourceRanges = ranges;
    ranges = RangesFlatter.doItFlat(ranges);

    var arrayForWrap = this._getArrayForWrap(ranges, this._pageData[name]);

    return this._wrapAndConcat(arrayForWrap);
  }

  _wrapAndConcat(arr) {
    var res = '',
      commentCount = 0;

    this._sourceRanges.forEach((range)=>{
      if (range.comment) {
        commentCount += 1;
      }
    });

    arr.forEach((item)=>{
      if (item.type === 'simple') {
        res += item.text;
      } else {
        res += '<span data-highlight="'+item.name+'">' + item.text + '</span>';
      }
    });

    if (commentCount) {
      if (commentCount > 1) {
        res += '<div class="comment-link" data-comments="'+this._sourceRanges[0].nodeId+'"> You left a comments (' + commentCount +')</div>';
      } else {
        res += '<div class="comment-link" data-comments="'+this._sourceRanges[0].nodeId+'"> You left a comment</div>';
      }

    }

    return res;
  }

  _getArrayForWrap(ranges, str) {
    let resultArray = [],
      lastOffset = 0;

    ranges.forEach((range, i)=>{
      if (range.name) {
        let s = str.substr(lastOffset);
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
}
