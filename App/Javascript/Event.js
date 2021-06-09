function Event(sender) {
    this._sender = sender;
    this._listeners = [];
}

Event.prototype = {
    detach: function (listener) {
        let indexToRemove;
        for (let i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i] === listener) {
                indexToRemove = i;
                break;
            }
        }
        this._listeners.splice(indexToRemove, 1);
    },
    attach: function (listener) {
        this._listeners.push(listener);
    },
    notify: function (args) {
        for (let i = 0; i < this._listeners.length; i++) {
            this._listeners[i](this._sender, args);
        }
    }
};

exports.Event = Event;