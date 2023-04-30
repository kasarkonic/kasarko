//A maximum length of 52 characters  !!!!!!!!!!!!!!!


var playerNo; // global
var teamNo; // global

//kad jauns spēlētājs, noskanē dataArray   , izmet tukšos, vecos
//kad jauna komanda, noskanē teamArray   , izmet tukšos, vecos



'use strict';

const { constants } = require('crypto');
const { listenerCount } = require('events');
const express = require('express');
const session = require("express-session");
const http = require('http');
//const uuid = require('uuid');
const app = express();


//const timeSinc = new Date();
let sTimer = parseInt(new Date().getTime() / 1000);

setInterval(sTime, 1000);
function sTime() {
  const timeSinc = new Date();
  sTimer = parseInt(timeSinc.getTime() / 1000);
  // console.log(sTimer);
}

let dataTestInterval = setInterval(dataTest, 3000);    // 7*60*1000  7 min

//var dArray = new Array('team_name','player','quest_kas','quest_kad','quest_ar_ko',
//'quest_kur','quest_ko_dara','quest_kapec',message,status,time);       
/*const d_team_name = 0;
const d_kas = 2;
const d_kad = 3;
const d_ar_ko = 4;
const d_kur = 5;
const d_ko_dara = 6;
const d_kapec = 7;
const d_message = 8;
const d_status = 9; // status   empty-> 'E'||'F' <- fill
const d_time = 10;
*/
let dMap = new Map([
  ['d_team_name', ''],
  ['d_kas', ''],
  ['d_kad', ''],
  ['d_ar_ko', ''],
  ['d_kur', ''],
  ['d_ko_dara', ''],
  ['d_kapec', ''],
  ['d_message', ''],
  ['d_status', ''],
  ['d_time', '0']
]);
var dataMap = new Map([[0, dMap]]);// vienmēr vismaz 1 jābūt ???


//var tArray = new Array('team_name','player_cnt','feel_answers_count',time);

let tMap = new Map([
  ["t_player_cnt", 0],
  ["t_answ_cnt", 0],
  ["t_record", 0],
  ["t_time", sTimer]
]);
var teamMap = new Map([["0", tMap]]);// vienmēr vismaz 1 jābūt ???

//////////////////////////////////////////////////////////////////////////// test area
console.log('test area start');

console.log('test area end');
/////////////////////////////////////////////////////////////////////////////// test area



//
// We need the same instance of the session parser in express and
// WebSocket server.
//

//const sessionParser = session({
//  saveUninitialized: false,
//  secret: '$eCuRiTy',
//  resave: false
//});

app.use(express.static("public"));
app.use(express.static(__dirname));
//app.use(sessionParser);
app.use(express.json());

app.all("*", function (req, res, next) {  // runs on ALL requests
  req.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  console.log('app.all("*") ', req.fullUrl);
  //console.log('req.originalUrl ', req.originalUrl);
  next();
});


const server = http.createServer(app);
var port = process.env.PORT || 5500;    // glich 8383
var hostname = "127.0.0.1";
server.listen(port, hostname);
console.log(`Server running at ${hostname}:${port}`);
console.log('////--------------------------------------\n');

/*
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(index);
  //console.log("get / Request " + req.url);
  console.log("get/Request " + " , "+ req.hostname + " , "+ req.ip + " , "+ req.path );
  
}).listen(5500);
*/

app.post('/?', function (req, res) {
  let playercnt = 0;
  let playerNo = 0;
  let Fplayercnt = 0;
  //let record = 0;
  //console.log('receive POST: '+'Nr:' + pln + ' tem  ' + tem + '  stat ' + stat);
  const jsonTxt = req.body;

 // console.log(jsonTxt);
  let pln = parseInt(jsonTxt.player);   // record
  let tem = jsonTxt.team_name;  // team name
  let stat = jsonTxt.status // status E,F,S
  console.log('receive POST: ' + 'Nr:' + pln + ' tem  ' + tem + '  stat ' + stat);

  if (pln == 0) { // new player, receive team name
    console.log('1. player Nr:' + pln);
    findTeam(tem);// find team, add team if new  add player cnt if team exist
    playerNo = findPlayer(tem, pln);
    console.log('new player rec. nr', playerNo);
    Fplayercnt = feelPlayersCnt(tem); // update teamMap
    playercnt = teamsPlayersCnt(tem);

  }
  else {
    playerNo = pln;
  }


  // if (playerNo !=  findPlayer(jsonTxt.team_name,playerNo)){
  //   console.log('error !!!');
  // }


  if ((pln > 0) && (stat === 'F')) { //  receive answer or new game
    // console.log('F, update',playerNo);
    dataMap.get(pln).set('d_kas', jsonTxt.quest_kas);
    dataMap.get(pln).set('d_kad', jsonTxt.quest_kad);
    dataMap.get(pln).set('d_ar_ko', jsonTxt.quest_ar_ko);
    dataMap.get(pln).set('d_kur', jsonTxt.quest_kur);
    dataMap.get(pln).set('d_ko_dara', jsonTxt.quest_ko_dara);
    dataMap.get(pln).set('d_kapec', jsonTxt.quest_kapec);
    dataMap.get(pln).set('d_message', jsonTxt.message);
    dataMap.get(pln).set('d_status', jsonTxt.status);
    dataMap.get(pln).set('d_time', sTimer);

    Fplayercnt = feelPlayersCnt(tem); // update teamMap
    playercnt = teamsPlayersCnt(tem);
    //console.log(dataMap.get(playerNo));
  }

  if ((playerNo > 0) && (jsonTxt.status === 'S')) {  // syncro
    Fplayercnt = getFeelPlayersCnt(tem);
    playercnt = getTteamsPlayersCnt(tem);
  }

  if ((playerNo > 0) && (jsonTxt.status === 'N')) {  // syncro
    setFeelPlayersCnt(tem, 0);
  }


  //if((pln > 0) && (stat === 'F') && (playercnt == Fplayercnt)){
  //   console.log(" --------------------------All finished --------------------------");
  //res.send(createResultJson(tem));
  //   res.send({ result: 'OK'});// if 
  // }
  // else{
  res.send({ result: 'OK', team_name: tem, playerNo: playerNo, playercnt: playercnt, Fplayercnt: Fplayercnt });
  console.log('result: OK, playerNo:', playerNo, 'playercnt:', playercnt, 'Fplayercnt:', Fplayercnt);
  //  }
  //console.log(dataMap);
});

app.get(/team/, function (req, res) {
  console.log("app.get(/team/)");
  req.fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  console.log("req.originalUrl", req.originalUrl);
  const data = req.body;

  let team = req.originalUrl;
  team = team.substring(6);
  console.log('team ===>>>', team);

  //team = 'aaa'; // for testing  

  //console.log('createResultJson(team)   ', createResultJson(team).length);
  //console.log(createResultJson(team));
  //console.log('---0000---');
  //console.log(createResultJson(team)[1]);
  //console.log('1111');
  //res.send(createResultJson(team));

  //let txt = {"d_team_name":"aaa","d_kas":"1","d_kad":"1","d_ar_ko":"1","d_kur":"1","d_ko_dara":"1","d_kapec":"1","d_message":null,"d_status":"F","d_time":1682229758}{"d_team_name":"aaa","d_kas":"2","d_kad":"2","d_ar_ko":"2","d_kur":"2","d_ko_dara":"2","d_kapec":"2","d_message":null,"d_status":"F","d_time":1682229770}


  //res.send(createResultJson(team)[1]);

  res.json(createResultJson(team));
  //res.json(createTMPJson());
  // res.json({ answer: 42 });
});

//app.listen(5500, function (err) {
//  if (err) console.log(err);createResultJsono
//  console.log("Server listening on PORT", 5500);
//});


app.delete('/logout', function (req, response) {
  console.log("app.delete");
  /*  const userId = req.headers['sec-websocket-key']; 
    const ws = map.get(req.session.userId);
  
    console.log('Destroying session');
    req.session.destroy(function () {
      if (ws) ws.close();
      response.send({ result: 'OK', message: 'Session destroyed' });
    });
    */
});

server.on('upgrade', function (req, socket, head, message) {
  console.log('Parsing session from request...', req.url);
  console.log(message);

  try {
    // this example expects every message to be in JSON format.
    // data = JSON.parse(message);
    console.warn("data = JSON.parse(message);");
  } catch (e) {
    console.warn("invalid message from server", data);
  }
  console.log(data);
});

function createTMPJson() {
  var obj = new Object();
  obj.team_name = "111";
  obj.playerNo = 3;
  obj.playercnt = 1;
  obj.Fplayercnt = sTimer;
  var jsonString = JSON.stringify(obj);
  console.log('jsonString->', jsonString);
  const jsonObj = JSON.parse(jsonString);    //const data = JSON.parse(json); 
  console.log('jsonObj->', jsonObj);
  return jsonObj;
}

function createResultJson(team_name) {

  //console.log('createResultJson ===============================================',team_name);
  //let JArr = new Array();
  let JArrtxt = '{';
  let tmpcnt = 1;
  for (let [key, value] of dataMap.entries()) {

    if (dataMap.get(key).get('d_team_name') === team_name) {
      let json = JSON.stringify(Object.fromEntries(dataMap.get(key)))
      let jsontxt = JSON.parse(json);
      //console.log(json);  // objekts viss pēdiņās
      //console.log(jsontxt); //  tekstā pēdiņās tikai dati
      // JArr.push(json);
      //JArrtxt =JArrtxt + String(tmpcnt) + ':'   + json + ',';
      JArrtxt = JArrtxt + '\"' + String(tmpcnt) + '\":' + json + ',';
      //JArr = JArr.concat(jsontxt);
      tmpcnt++;
    }
  }
  console.log(JArrtxt);


  //let JArrtxt1 = JArrtxt.replace("\"", "\'");
  let JArrtxt1 = JArrtxt.slice(0, -1);
  JArrtxt1 = JArrtxt1 + '}';
  console.log('\\\\\\\\\\\\\\\\\\\\\\\\');
  //console.log(JArrtxt1);

  let JArr = JSON.parse(JArrtxt1);

  //console.log(JArr['1']["d_team_name"]);




  return JArr;
}



function findTeam(team_name) {
  //console.log('findTeam ', team_name);
  let plInTeam = 1;
  if (teamMap.has(team_name)) {//Team exist
    plInTeam = teamMap.get(team_name).get('t_player_cnt') + 1;
    //console.log(team_name + ' exist in teamMap ' +  ' ' + plInTeam);
    teamMap.get(team_name).set('t_player_cnt', plInTeam);
    //return;   // team exist in Map
  }
  else {  // add new team
    let tMap = new Map([
      ["t_player_cnt", 1],
      ["t_answ_cnt", 0],
      ["t_record", 0],
      ["t_time", sTimer]
    ]);
    teamMap.set(team_name, tMap);
    console.log('////teamMap.size: ', teamMap.size);
  }
  //console.log('findTeam: ' + team_name + ' players in this team ' + plInTeam);
  console.log(teamMap);
}

function findPlayer(team_name, record) {
  // console.log('findPlayer' + ' ' + team_name + ' ' + record);
  if (dataMap.has(record) && (record != 0)) {   // player exist 
    return record;
  }

  else {   // new player
    let rec = 1;
    let newKey = 0;

    for (let [key, value] of dataMap.entries()) {
      for (let [key, value] of dataMap.entries()) {
        if (dataMap.has(rec)) {   // rec exist
          rec++;
          break;
        }
        else {
          newKey = rec;
          break;
        }
      }
      if (newKey) { break; }
    }
    addNewPlayer(team_name, newKey)
    return newKey;// first free number

  }

}
function addNewPlayer(team_name, player) {

  let dMap = new Map([
    ['d_team_name', team_name],
    ['d_kas', ''],
    ['d_kad', ''],
    ['d_ar_ko', ''],
    ['d_kur', ''],
    ['d_ko_dara', ''],
    ['d_kapec', ''],
    ['d_message', ''],
    ['d_status', 'E'],
    ['d_time', sTimer]
  ]);
  dataMap.set(player, dMap);
  console.log('/////dataMap.size: ', dataMap.size);
}
////////////////////////////////////////////////////////////////////////////////////////////////////
/*
let tMap = new Map([
  ["t_player_cnt",0],
  ["t_answ_cnt",0],
  ["t_record",0],
  ["t_time",sTimer]
]);
var teamMap = new Map([["0",tMap ]]);// vienmēr vismaz 1 jābūt ???
*/
function getTteamsPlayersCnt(team_name) {
  if (teamMap.has(team_name)) {
    //console.log(teamMap);
    //console.log('-----');
    //console.log('getTteamsPlayersCnt  ret ',teamMap.get(team_name).get('t_player_cnt'));
    return teamMap.get(team_name).get('t_player_cnt')
  }
  else { console.log('ERROR 3 !!!'); }
}


function getFeelPlayersCnt(team_name) {
  if (teamMap.has(team_name)) {
    //console.log(teamMap);
    //console.log('-----');
    //console.log('getTteamsPlayersCnt  ret ',teamMap.get(team_name).get('t_player_cnt'));
    return teamMap.get(team_name).get('t_answ_cnt')
  }
  else { console.log('ERROR 4 !!!'); }
}

function setFeelPlayersCnt(team_name, val) {
  if (teamMap.has(team_name)) {
    teamMap.get(team_name).set('t_answ_cnt', String(val));
  }
  else { onsole.log('ERROR 4 !!!'); }
}

function teamsPlayersCnt(team_name) {
  //console.log('teamsPlCnt',team_name+ ' '+ dataMap.size);
  let cnt = 0;
  //console.log(dataMap);
  for (let [key, value] of dataMap.entries()) {
    if (dataMap.get(key).get('d_team_name') === team_name) {
      cnt++;
    }
  }
  if (teamMap.has(team_name)) {
    teamMap.get(team_name).set('t_player_cnt', cnt)
    //console.log(teamMap);
    console.log('update t_player_cnt ', cnt);
  }
  else { console.log('ERROR 2 !!!'); }
  // console.log('===teamsPlCnt return ',cnt);
  return cnt;
}

function feelPlayersCnt(team_name) {
  //console.log('feelPlayersCnt',team_name+ ' '+ dataMap.size);
  let cnt = 0;
  for (let [key, value] of dataMap.entries()) {
    if (dataMap.get(key).get('d_status') === 'F') {
      cnt++;
    }
  }
  if (teamMap.has(team_name)) {
    teamMap.get(team_name).set('t_answ_cnt', cnt)
    //console.log(teamMap);
    console.log('update t_answ_cnt ', cnt);
  }
  else { console.log('ERROR 3 !!!'); }
  // console.log('===feelPlayersCnt return ',cnt);
  return cnt;
}



function dataTest() {
  //console.log(' ------------------- test', dataMap);
  //console.log('teamMap area start', teamMap);
  let testTime = sTimer - 7 * 60;   // 7 min

  if (dataMap.size > 1) {
    for (let [key, value] of dataMap.entries()) {
      // console.log('old record  ',dataMap.get(key).get('d_time'),' ',testTime -  dataMap.get(key).get('d_time'));
      // console.log('test  ', testTime - dataMap.get(key).get('d_time'));

      if ((dataMap.get(key).get('d_time') < testTime) && (dataMap.get(key).get('d_time') != 0)) {
        console.log('old record  ', testTime - dataMap.get(key).get('d_time'));

        if (teamMap.has(dataMap.get(key).get('d_team_name'))) {
          let team = dataMap.get(key).get('d_team_name');
          let pl = teamMap.get(team).get("t_player_cnt") - 1;
          if (pl > 0) {
            teamMap.get(team).set("t_player_cnt", pl);
            teamMap.get(team).set("t_time", sTimer);

            if (teamMap.get(dataMap.get(key).get('d_status')) === 'F') {   // answer
              let plc = teamMap.get(team).get("t_answ_cnt") - 1;
              if (plc > 0) {
                teamMap.get(team).set("t_answ_cnt", plc);
                teamMap.get(team).set("t_time", sTimer);
              }
            }
          }
          else {
            console.log('del team = ', team);
            teamMap.delete(team);
          }


          console.log('del key = ', key);
          dataMap.delete(key);

        }
      }
    }
  }

  if (teamMap.size > 1) {
    for (let [key, value] of teamMap.entries()) {
      if ((teamMap.get(key).get('t_time') < testTime) && (teamMap.get(key).get('t_time') != 0)) {
        teamMap.delete(key);
      }
    }
  }

}




/*




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




function messageForAll(teamname,type = 'MES' , mes = null){
  console.log('messageForAll ' + teamname + ' ' + mes);
  let teamidArray = allSocketsByTeamname(teamname);   // get array of ws
  //teamidArray.forEach(element => element.send('MES,' + mes))
  teamidArray.forEach(element => element.send(createJson(type, mes)));
}




let     block scope
war     global
const   block scope

*/
