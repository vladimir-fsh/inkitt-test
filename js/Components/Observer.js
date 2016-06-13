
class Observer {
  constructor (){
    this._callbackHash = {}
  }
  sub (eventName, callback) {
    if (!this._callbackHash[eventName]) {
      this._callbackHash[eventName] = []
    }

    this._callbackHash[eventName].push(callback);
  }

  pub (eventName, data) {
    if (!this._callbackHash[eventName]) {
      return false
    }

    this._callbackHash[eventName].forEach((cb)=>{
      cb(data);
    });

    return true;
  }
}

module.exports = new Observer();