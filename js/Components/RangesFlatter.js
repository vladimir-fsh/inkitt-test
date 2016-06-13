
let removeDuplicates = (arr) => {
  let resHash = {};

  return arr.filter((a)=>{
    let res = !resHash.hasOwnProperty(a);
    resHash[a] = 1;
    return res;
  });
};


let doItFlat = (ranges) => {
  ranges = ranges.sort((a,b)=>{
    return (b.startOffset < a.startOffset) ? 1 : (b.startOffset > a.startOffset) ? -1 : 0;
  });

  let path = {},
    flattered = [],
    start = ranges[0].startOffset,
    end = ranges.sort((a,b)=>{
      return (b.endOffset > a.endOffset) ? 1 : (b.endOffset < a.endOffset) ? -1 : 0;
    })[0].endOffset;

  while (start < end) {

    let startObject = getStartObject();
    let s = startObject.startOffset;
    let names = startObject.names;

    let endObject = getEndObject();
    let e = endObject.endOffset;

    start = e;
    flattered.push({
      name: removeDuplicates(names).join(' '),
      startOffset: s,
      endOffset: e
    });
  }

  function getStartObject() {
    let names = [],
      res = start,
      deleted = [];

    for (let p in path) {
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

    deleted.forEach((d)=>{
      delete path[d];
    });

    for (let r = 0; r < ranges.length; r += 1) {
      if (ranges[r].startOffset <= res && ranges[r].startOffset >=start) {
        names.push(ranges[r].name);
      }
    }

    start = res;
    return {
      names: names,
      startOffset: res
    }
  }

  function getEndObject() {
    let res = end;

    for (let p in path) {

      if (path[p].endOffset > start) {
        if (path[p].endOffset<res){
          res = path[p].endOffset;
        }
      }
    }

    for (let r = 0; r < ranges.length; r += 1) {
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

    for (let r = 0; r < ranges.length; r += 1) {
      if (res < ranges[r].endOffset && res > ranges[r].startOffset) {
        path[ranges[r].name] = ranges[r];
      }
    }

    start = res;
    return {
      endOffset: res
    }
  }

  return flattered;
};



module.exports = {
  doItFlat: doItFlat
};