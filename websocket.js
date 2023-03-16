/* A Friendly WebSocket */

// WebSockets are awesome, but they have a nasty habit of disconnecting
// and not waking back up. This class is a wrapper around WebSocket that
// handles automatic reconnection.

class FriendlyWebSocket {
  // optional customization of the websocket path
  constructor({ path = "/", url } = {}) {
    this.path = path;
    this.url = url;
   // this.connect();
    this.connected = false;
    this._listeners = {
      message: new Set(),
      open: new Set(),
      close: new Set(),
    };
  }


    createWebSocket(){
      console.log("s.createWebSocket");
      this.connect();
      this.connected = true;
  }


    connect() {
    let protocol = 'ws://';
    if (location.protocol === 'https:') {
      protocol = 'wss://';
    }
    console.log("protocol = " + protocol);
    
    let url = this.url || (protocol + location.host + this.path);
    
    this.socket = new WebSocket(url);

    // Connection opened
    this.socket.addEventListener("open", event => {
      console.log("s.connected!");
      this.connected = true;
      this._emit('open', event.data);
      // this isn't necessary, but it's polite to say hi!
      //this.socket.send("Hello Server!");
    });

    this.socket.addEventListener("close", event => {
      console.log("s.disconnected");
      this.connected = false;
      // the server went away, try re-connecting in 2 seconds.
      this._emit('close', event.data);
      //setTimeout(() => this.connect(), 2000);
    });
    this.socket.addEventListener("message", event => {
      console.log("s.websocket receive message");
      this.connected = false;
      // the server went away, try re-connecting in 2 seconds.
      this._emit('message', event.data);
      //setTimeout(() => this.connect(), 2000);
    });

    this.socket.onerror = function(evt) {onError(evt);};

    this.onError=function (evt){
      console.log('Error: ' + evt.data);
    }

    /*
    // Listen for messages
    this.socket.addEventListener("message", event => {
      // tell the listeners about it
      this._emit('message', event.data);
    });
    this.socket.addEventListener("open", event => {
      // tell the listeners about it
      this._emit('open', event.data);
    });
    this.socket.addEventListener("close", event => {
      // tell the listeners about it
      this._emit('close', event.data);
    });
    */
  }
  _emit(type, data) {
    console.log("s._listeners[type] = ", type);
    this._listeners[type].forEach(handler => {
      // don't let one listener spoil the batch
      try {
        handler(data);
      } catch (e) {
        console.warn("s.error in message handler", e);
      }
    });
  }
  
  on(type, handler) {
    //console.log("handler on type", type);
    if (type in this._listeners) {
      this._listeners[type].add(handler);
    }
  }

  off(type, handler) {
    console.log("s.handler off", type);
    if (type === "message") {
      this.messageHandlers.delete(handler);
    }
  }

 // send(message) {
 //   console.log("s.handler message connected = " + this.connected);
 //   if (this.connected) {
 //     this.socket.send(message);
 //   }
 // }
   // onopen = () => conn.send("Message");

   send(message, callback) {
    console.log("s.send(message) " );
    this.waitForConnection(function () {

      //////////////// test

      const timeSinc = new Date();
      const jsonTxt = { cmd:trCmd, 
      id:null,
      teamName:'111',
      message:'1MMM',
      time:timeSinc.getTime()};
      jsonObj = JSON.stringify(jsonTxt);
      //////////////// test
      this.socket.send(jsonTxt);
      this.socket.send(jsonObj);
      console.log("s.send(mess,");
      //this.socket.send(message);
        if (typeof callback !== 'undefined') {
          callback();
        }
    }, 100);

   }

  }

    this.waitForConnection = function (callback, interval) {
    if (this.socket.readyState === 1) {
        callback();
    } else {
        var that = this;
        // optional: implement backoff for interval here
        setTimeout(function () {
            that.waitForConnection(callback, interval);
        }, interval);
    }
  };



//}
