import HighlightRange from './HighlightRange   ';

export default class Storage {
  constructor(){

  }

  saveRangeData(range) {
    let highlights = this._getAllDataFromLS(),
        nodeId = range.getNodeId();

    if (!highlights[nodeId]) {
      highlights[nodeId] = [];
    }

    let targetRange = this.getRangeByName(range.name, nodeId, highlights[nodeId]);

    if (targetRange) {
      highlights[nodeId][highlights[nodeId].indexOf(targetRange)] = range;
    } else {
      highlights[nodeId].push(range);
    }

    localStorage.setItem('highlights', JSON.stringify(highlights));
  }

  getRangeByName(name, nodeId, rangesArray) {
    let ranges = rangesArray || this.getDataByNodeId(nodeId);
    for (let i = 0 ; i < ranges.length; i += 1) {
      if (ranges[i].name == name) {
        return ranges[i];
      }
    }
  }

  getDataByNodeId(nodeId) {
    let highlights = this._getAllDataFromLS();

    if (highlights && highlights[nodeId]) {
      return highlights[nodeId].map((hl) => new HighlightRange(null, hl));
    }

    return [];
  }

  _getAllDataFromLS(){
    let highlights = localStorage.getItem('highlights');

    return highlights ? JSON.parse(highlights) : {};
  }
}