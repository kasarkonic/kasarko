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

  createWebSocketOld(){
    console.log("s.createWebSocket");
    this.connect();
    this.connected = true;
  }
    /////////////////////////////////////////////////////////////
   createWebSocket(){
  const protocol = window.location.protocol.includes('https') ? 'wss': 'ws'

  console.log('protocol:  '+ protocol + '  ,  ' );

  fetch('/login', { method: 'POST', credentials: 'same-origin' })
  .then(this.handleResponse)
  .then( this.connect())   // connection
  .catch(function (err) {
    this.showMessage(err.message);
  });
  }

 handleResponse(response) {
  let resid = response.data.id;
  console.log('response.data.id '+ ' ' + resid);  
  let id = response.id;
  console.log('response.id '+ ' ' + id );
  return response.ok
  ? response.json().then((data) => JSON.stringify(data, null, 2))
  : Promise.reject(new Error('Unexpected response'));
 }





//////////////////////////////////////////////////////////////
    createWebSocketOld(){
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

   // this.ws = new WebSocket(url, {
   //   headers: {
   //       "user-agent": "Mozilla"
  //    }
   // });



    // Connection opened
    this.socket.addEventListener("open", event => {
      console.log("s.connected!   "+ url);
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

   send(message) {
    console.log("s.send(message) " );
    this.waitForConnection(function () {

      //////////////// test
      let text = '{ "employees" : [{ "id":null , "teamName":"111", "message":"1MMM" } ]}';
      const ojsonObjbj = JSON.parse(text);






      const timeSinc = new Date();
      const jsonTxt = { cmd:'trCmd', 
      id:null,
      teamName:'111',
      message:'1MMM',
      time:timeSinc.getTime()};
     // let jsonObj = JSON.stringify(jsonTxt);
      //////////////// test
     // this.socket.send(jsonTxt);
     // this.socket.send(jsonObj);
      this.socket.send('jsonObj');
      console.log("s.send(mess,");
      //this.socket.send(message);
        if (typeof callback !== 'undefined') {
          //callback();
        }
    }, 1000);

  }


//https://stackoverflow.com/questions/36846515/multiple-websocket-in-one-html-javascript
waitForConnection1(callback, interval) {

  // if (this.socket.readyState === 1) {
     if (this.connected) {

       callback();
   } else {
       var that = this;
     console.log(this.socket.readyState);
       // optional: implement backoff for interval here
       setTimeout(
           this.waitForConnection1(callback, interval)
       , 1000);
   }
 }



}
