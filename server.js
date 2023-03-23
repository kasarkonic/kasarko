//A maximum length of 52 characters  !!!!!!!!!!!!!!!

'use strict';
const express = require('express');
const session = require("express-session");
const http = require('http');
const uuid = require('uuid');

const WebSocketServer = require('ws');
//const ws = require('ws');
const app = express();


//var dArray = new Array('cmd','id','team_name','quest_kas','quest_kad','quest_ar_ko','quest_kur','quest_ko_dara','quest_kapec',message,time);
var dArray = new Array('1','1','','','','','','','','','');
var dataArray = new Array(dArray);// vienmēr vismaz 1 jābūt
const map = new Map(); 

//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});

app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(sessionParser);
app.use(express.json());

// Create an HTTP server.
//
const server = http.createServer(app);
//
// Start the server.  use PORT ??? 80 / 443 ???? fails with status 502
//

var port = process.env.PORT || 8383;
var hostname = "0.0.0.0";
server.listen(port, hostname);
console.log(`Server running at ${hostname}:${port}`);
//
// Create a WebSocket server completely detached from the HTTP server.
const wss = new WebSocketServer.Server({ server });
//const wss = new WebSocket.Server({ 
//    path: "/wss",
//    server: server,
//  });

// we're using an ES2015 Set to keep track of every client that's connected
let sockets = new Set();

//var dataArray = new Array[dArray];
//var dArray = new Array('cmd','id','team_name','quest_kas','quest_kad','quest_ar_ko','quest_kur','quest_ko_dara','quest_kapec',message,time);

console.log('////--------------------------------------');
//setTimeout(timerFunction, 1000);
// setInterval(timerFunction, 1000);





//
// Serve static files from the 'public' folder.
//

app.post('/login', function (req, res) {
  
  console.log("post Request " + req.url + "    __dirname:  " + __dirname);
  console.log(__dirname + '/images' + req.url);
  console.log("post Request " + " , "+ req.hostname + " , "+ req.ip + " , "+ req.path );
  const id = uuid.v4();
  console.log('Updating HTTP session for user ${'+ id + '}');
  //req.session.userId = id;
  res.send({ result: 'OK', message: 'Session updated' });
});

app.get('', function(req, res) {
  console.log("GET Request " + req.url + " "+ req.hostname + " "+ req.ip + " "+ req.path + " "+ req.query);
 });

app.get('/', function(req, res) {

  console.log("get / Request " + req.url);
  //console.log("get Request " + req.url + " "+ req.hostname + " "+ req.ip + " "+ req.path + " "+ req.query);
 // res.sendFile(__dirname + '/index.html');
});

/*
app.get('/gameapp.js', function(req, res) {
 // console.log("get Request " + req.url + " "+ req.hostname + " "+ req.ip + " "+ req.path + " "+ req.query);
  res.sendFile(__dirname + '/gameapp.js');
});
*/



app.delete('/logout', function (req, response) {
  const userId = req.headers['sec-websocket-key']; 
  const ws = map.get(req.session.userId);

  console.log('Destroying session');
  req.session.destroy(function () {
    if (ws) ws.close();
    response.send({ result: 'OK', message: 'Session destroyed' });
  });
});
    
    server.on('upgrade', function (req, socket, head,message) {
      console.log('Parsing session from request...', req.url);
      console.log( message);

      try {
        // this example expects every message to be in JSON format.
        data = JSON.parse(message);
      } catch (e) {
        console.warn("invalid message from server", data);
      }
      console.log( data);

      //console.log(head);
     // console.log(req.session.userId);
      //console.log(socket);
     //  const strObj = JSON.parse(message);
     // console.log(strObj.cmd);
     // console.log(strObj.teamName);
     //  strObj = JSON.parse(req.socket.data);
     // console.log(strObj.cmd);
     // console.log(strObj.teamName);

     // socket.on('error', onSocketError);
      /*
      sessionParser(req, {}, () => {
        if (!req.session.userId) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          console.log('socket.destroy()');
          return;
        }
       // socket.removeListener('error', onSocketError);

        wss.handleUpgrade(req, socket, head, function (ws) {
          console.log('wss.emot connection!');
          wss.emit('connection', ws, req);
        });
      });
      */
    });



  wss.on('connection', function connection(ws,req) {
    const userId = req.headers['sec-websocket-key']; 
    console.log(' WSS.connection ', userId );
    sockets.add(ws);

  /*
  const userId = setInterval(function () {
    ws.send(JSON.stringify(process.memoryUsage()), function () {
      //
      // Ignore errors.
      //
    });
  }, 1000);
  */
 
  map.set(userId, ws);
  console.log(' add sockets.size', sockets.size,map.size);


  ws.on('message', function incoming(message) {
    const userId = req.headers['sec-websocket-key']; 
    console.log("-------------------- New message --------------------");
    console.log(`Received message -->${message}<--`);
    console.log(message);
    const strObj = JSON.parse(message);
    let messageLength = Object.keys(strObj).length;
    let contime  = new Date();
    //console.log('strObj.len  ' + messageLength);
    if(messageLength != 11){    // error
      console.log('!!! ERROR !!!    strObj.len  ' + messageLength);
      return;
    }
    strObj.id = userId;
    strObj.time  = contime/1000;  //s

    console.log('message cmd  ' + strObj.cmd);
    console.log('message teamName ' + strObj.teamName);


    if(strObj.cmd == 'ANSWER'){
      strObj.message = 'ANSWER';
    }


   

    const userNr =  findClients(userId)
    if(userNr == -1 ){  // new user
      dataArray.push(strObjToArray(strObj));
    }
    else{
      dataArray[userNr] = (strObjToArray(strObj));
    }
 
    console.log(dataArray);

      //console.log('dataArray dataArray dataArray dataArraydataArray dataArray dataArray ' + dataArray.length ); 

      // enum Cmd {TEAMNAME,ANSWER,LOG,,,, MES,RESULT}
    switch(strObj.cmd) {
      case 'TEAMNAME':
        console.log("TEAMNAME --------------------");

        let ncount = countArrElements(2,strObj.teamName);   // test count of teammates
        console.log('ncount:  ' + ncount);
        if(ncount == 1){
          map.get(userId).send(createJson('MES', 'You are alone in this team.'));
        }
        if(ncount > 1){
          map.get(userId).send(createJson('MES', 'You are joined  in ' + strObj.teamName + ' team.'));
         // map.get(userId).send('MES,You are joined  in ' + strObj.teamName + ' team.');
         // messageForAll(strObj.teamName,'MES','There are ' + ncount + '. members in ' + strObj.teamName + ' team.');
          messageForAll(strObj.teamName,'MEMB', ncount);
          console.log('messageForAll MEMB: ' + ncount );
        }

        break;
      case 'ANSWER':
        console.log("ANSWER --------------------");
        console.log(dataArray);

        let retArray = new Array();
        retArray =   recAnswersCnt(strObj.teamName);
        let answers = retArray[0];
        let teammateCnt = retArray[1];
     
        console.log(answers +' from ' +  (teammateCnt - answers) + ' + from '+ teammateCnt )

        messageForAll(strObj.teamName,'FINISH', answers);
        console.log('messageForAll FINISHES: ');

        if(answers == teammateCnt){  // receive from all players
          messageForAll(strObj.teamName,'MES','All player finish');
          console.log('messageForAll MES: ' + 'All player ');
        //send array !!!
        sendDataArrayToClient(strObj.teamName);

        }
        else{
          messageForAll(strObj.teamName,'MES','There are ' + (teammateCnt - answers) + ' player not finish yet');
          console.log('messageForAll MES: ' + 'There are ');
        }
         //retArray[0] = answers;
        // retArray[1] = teammateCnt;

        break;
        case 'LOG':
          console.log("LOG --------------------");
          //console.log(strObj.message);
          break;

        case 'NEW':
            console.log("NEW --------------------");
            console.log(dataArray);
        break;


        case 'DEVELOP':
          messageForAll(strObj.teamName,'MEMB', ncount);
          console.log('messageForAll MEMB: ' + message);
          const resulttxt = {
            cmd:'DEVELOP',
            id:'userId',
            dataArray_length:dataArray.length,
            map_length:map.length,
            /*
            quest_kad:kad,
            quest_ar_ko:ar_ko,
            quest_kur:kur,
            quest_ko_dara:ko_dara,
            quest_kapec:kapec,
            message:mes,
            */
            quest_kad:'kad',
            quest_ar_ko:'ar_ko',
            quest_kur:'kur',
            quest_ko_dara:'ko_dara',
            quest_kapec:'kapec',
            message:'mes',

            time:''};
          let jsonObj = JSON.stringify(resulttxt);
          map.get(userId).send(jsonObj);
        break
      default:
        console.log("default --------------------");
    }

    //const timeSinc = new Date();
    //dArray[7] = timeSinc.getTime();
  
    //console.log('dataArray lenght = ' + dataArray.length  + '   OK OK OK OK OK OK OK OK OK OK OK');
     //ws.send('MES,You have ' + ncount + ' teammates.');
  });


  
  ws.on('close', function (ws, request) {
    const userId = req.headers['sec-websocket-key']; 
    console.log('ws.on(close  ' + userId  );
    //console.log(setIter);
    //console.log(' del sockets.size', sockets.size,map.size);
    sockets.delete(ws); // nedarbojas ??????
    map.delete(userId);

    console.log(' del map.size',map.size);
    //console.log('userId: ' + userId + ' ' +  dataArray.length );      
  
    
    //var dataArraytemp = new Array('1','1','','','','','','','','','');
    var dataArraytemp = [];
    dataArraytemp[0] = dataArray[0];
    var tmpstr;
    let teamname ;
    let message
    for (let i = 1; i < dataArray.length; i++ ){
       tmpstr = dataArray[i][1];
       console.log(' tmpstr ' + tmpstr );
      if(tmpstr.localeCompare (userId) != 0){ // different
        dataArraytemp.push(dataArray[i]);    
      }
     else{
        teamname = dataArray[i][2];
        message = dataArray[i][9];
      }
   }
    dataArray = dataArraytemp;
    messageForAll(teamname,'CLOSE' , message)
    //messageForAll(teamname,'CLOSE' )
    console.log('messageForAll CLOSE: ' + message);
   update();
  });
 // tell everyone a client joined
 update();
});

function update() {
  // send an updated client count to every open socket.
  //sockets.forEach(ws => ws.send(JSON.stringify({
  //  type: 'count',
  //  count: sockets.size
 // })));
}
 
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
//app.get('/', function(request, response) {
//  response.sendFile(__dirname + '/views/index.html');
//});


function findClients(id) {
  let ret = -1;
  console.log('findClients: ' + id);
  for (let i=0 ; i < dataArray.length; i=i+1){
    //  console.log(i + ' ' + dataArray[i][1] + ' ' + id);   // id
    if (dataArray[i][1] == id){
      ret =  i;
    }
  }
 // if(ret >0){ret--;} ??????????????????????
  console.log('return ' + ret);
  return ret;
}

function countArrElements(position,data) {
  console.log('countArrElements from poz:' + position + ' data ' + data );
  //console.log(dataArray);
  let k = 0;
  for (let i=0 ; i < dataArray.length; i++){
      console.log(i + ' no ' + dataArray.length + ' ' + dataArray[i][0]  +' ' + dataArray[i][1] + ' ' + dataArray[i][2]  +' ' + dataArray[i][3] + ' ' + dataArray[i][3]);
    if (dataArray[i][position] == data){
      k++;
    }
  }
  console.log('return ' + k );
  return k;
}

function allTeaamAnswer(team){

  let allTeaam = new Array();
  for (let i=0 ; i < dataArray.length; i=i+1){
    //console.log(i + ' ' + dataArray[i][2] + ' ' + dataArray[i][3] + ' ' + team);
    if (!dataArray[i][2].localeCompare(team)){
      allTeaam.push(dataArray[i]);   // ws <= id
      //console.log(i + ' push '+ dataArray[i][3] +' ' + team )
    }
  }
  console.log('find  ' + allTeaam.length + ' teammates');
  return   allTeaam;
}


function allSocketsByTeamname(teamname){
    let wsFindArray = new Array();
    for (let i=0 ; i < dataArray.length; i++){
      //console.log(i + ' no ' + dataArray.length + ' ' + dataArray[2]  + ' ' + teamname);
      if (!dataArray[i][2].localeCompare(teamname)){
        wsFindArray.push( map.get(dataArray[i][1]));   // ws <= id
      //  console.log(teamname +' '+ wsFindArray )
     }
  }
  return   wsFindArray;
   
}

function messageForAll(teamname,type = 'MES' , mes = null){
  console.log('messageForAll ' + teamname + ' ' + mes);
  let teamidArray = allSocketsByTeamname(teamname);   // get array of ws
  //teamidArray.forEach(element => element.send('MES,' + mes))
  teamidArray.forEach(element => element.send(createJson(type, mes)));
}

function createJson(trCmd, mes = null){
//var dArray = new Array('cmd','id','team_name','quest_kas','quest_kad','quest_ar_ko','quest_kur','quest_ko_dara','quest_kapec',message,time);
  const timeSinc = new Date();

  let resulttxt = {
  cmd:trCmd,
  id:'',
  team_name:'',
  quest_kas:'',
  quest_kad:'',
  quest_ar_ko:'',
  quest_kur:'',
  quest_ko_dara:'',
  quest_kapec:'',
  message:mes,
  time:''};

  let jsonObj = JSON.stringify(resulttxt);
  console.log(' createJson( ' + trCmd + ', '+ mes + ') '+ jsonObj )
  return jsonObj;
}

function strObjToArray(strObj){
  let clientArray = new Array();
  let contime  = new Date();
  clientArray[0] = strObj.cmd;
  clientArray[1] = strObj.id;
  clientArray[2] = strObj.teamName;
  clientArray[3] = strObj.quest_kas;
  clientArray[4] = strObj.quest_kad;
  clientArray[5] = strObj.quest_ar_ko;
  clientArray[6] = strObj.quest_kur;
  clientArray[7] = strObj.quest_ko_dara;
  clientArray[8] = strObj.quest_kapec;
  clientArray[9] = strObj.message;
  clientArray[10] = strObj.time;
  return clientArray;
}

function recAnswersCnt(teamname){
  let teammateCnt = 0;
  let answers = 0 ;

  let retArray = new Array();
  for (let i=0 ; i < dataArray.length; i=i+1){
    console.log(i + ' ' + dataArray.length + ' ' + dataArray[i][2]  + ' ' + dataArray[i][3] + '  ' + teamname);
    if (!dataArray[i][2].localeCompare(teamname)){
      teammateCnt++;
      if(dataArray[i][3]){
        answers++;
      }
    }
  }
    retArray[0] = answers;
    retArray[1] = teammateCnt;
    console.log(answers +' from '+ teammateCnt )
    return   retArray;

}



function sendDataArrayToClient(teamname){
  //var dArray = new Array('cmd','id','team_name','quest_kas','quest_kad','quest_ar_ko','quest_kur','quest_ko_dara','quest_kapec',message,time);
  console.log('sendDataArrayToClient ' + '  ' + teamname);
  let allAnswArray = new Array();
  console.log(teamname + ' len=' + dataArray.length);
  for (let i=0 ; i < dataArray.length; i=i+1){
    console.log(i + ' ' + dataArray[i][2]  + ' ' + dataArray[i][3] + ' ' + dataArray[i][4]  + ' ' + dataArray[i][5] + ' ' + dataArray[i][6]  + ' ' + dataArray[i][7]);
    if (!dataArray[i][2].localeCompare(teamname)){
      allAnswArray.push(dataArray[i]);
   }
}

for (let i=0 ; i < allAnswArray.length; i=i+1){
  console.log(i + ' ' + allAnswArray[i][2]  + ' ' + allAnswArray[i][3] + ' ' + allAnswArray[i][4]  + ' ' + allAnswArray[i][5] + ' ' + allAnswArray[i][6]  + ' ' + allAnswArray[i][7]);
}



  let teammateCnt = allAnswArray.length;
  let j = 0;
  let userId = allAnswArray[j][1];
  //console.log('allAnswArray A:  '+ allAnswArray );
  //console.log('allAnswArray: ' +  teammateCnt +' '+ userId + ' '+ allAnswArray[j][2] + ' '+ allAnswArray[j][3] + ' '+ allAnswArray[j][4]  + ' '+ allAnswArray[j][5]);

  for(let i = 0; i < teammateCnt ; i=i+1) {
      let mesint = teammateCnt - i -1
      let mes = mesint.toString();

      let name = allAnswArray[i][2];
      let kas = allAnswArray[i][3];
      let kad = allAnswArray[i][4];
      let ar_ko = allAnswArray[i][5];
      let kur = allAnswArray[i][6];
      let ko_dara =allAnswArray[i][7];
      let kapec =allAnswArray[i][8];

      const resulttxt = {
      cmd:'RESULT',
      id:'',
      team_name:name,
      quest_kas:kas,
      quest_kad:kad,
      quest_ar_ko:ar_ko,
      quest_kur:kur,
      quest_ko_dara:ko_dara,
      quest_kapec:kapec,
      message:mes,
      time:''};
      let jsonObj = JSON.stringify(resulttxt);

      //map.get(userId).send(jsonObj);


      let teamidArray = allSocketsByTeamname(teamname);   // get array of ws
        teamidArray.forEach(element => element.send(jsonObj));

      //console.log('send result for all: ' + jsonObj);
  }
}

  function timerFunction(){
      if((dataArray.length -1 != map.size)){
        console.log("!!!!!!!!!! ERROR  !!!!!!!!!");
        console.log('dataArray lenght = ' + dataArray.length +'  map = ' + map.size);
        console.log( dataArray );
      }
      let time  = new Date();  //s
      time/=1000;
      //var dArray = new Array('cmd','id','team_name','quest_kas','quest_kad','quest_ar_ko','quest_kur','quest_ko_dara','quest_kapec',message,time);

      for (let i=1 ; i < dataArray.length; i++){
      //  console.log(i + 'dif => '  + (time - dataArray[i][10]));
        if ((time -  dataArray[i][10]) > (20 * 60 )){   // s   20 m in
         console.log("!!!!!!!!!! DELete NODE !!!!!!!!!!!!!!" +  dataArray[i][1]);
         map.delete(dataArray[i][1]);
         dataArray.splice(i , 1);
       }
    }

  }

