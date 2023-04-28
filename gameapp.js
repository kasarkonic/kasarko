// vers 0.1.1

const head = document.querySelector('#head');
const body = document.querySelector('#body');
let fonsImg;
let teameImg;
let doc;
let distance;
let div1;
let div2;
let div3;
let input_btn_submTeam;
let input_btn_toServer;
let label_quest_kas;
let label_quest_kad;
let label_quest_ar_ko;
let label_quest_kur;
let label_quest_ko_dara;
let label_quest_kapec;

let input_team_name;
let input_quest_kas;
let input_quest_kad;
let input_quest_ar_ko;
let input_quest_kur;
let input_quest_ko_dara;
let input_quest_kapec;
let input_btn_left;
let input_btn_mix;
let input_btn_right;
let label_result;
let input_btn_new_game;
let label_team_name;
let label_info_team_name;
let label_message;
let playerNo = 0; // global
var nodeTeamName = ''// global
var Fplayercnt = 0; // global
var playercnt = 0;// global
var GETreq = 0;


let allAnswArray;
//let allAnswArray = new Array('team_name','player','quest_kas','quest_kad','quest_ar_ko',
//'quest_kur','quest_ko_dara','quest_kapec','message','time');

let pageNr = 0;
var stepp = 1;

var timcount = 0;



const string_map = new Map;
let teamimgArray = new Array();   // id,ststus,x,y

const winWidth = window.innerWidth;
const winHeight = window.innerHeight;

// const url = '127.0.0.1:5500'; ????
const url = '';
let myInterval1 = setInterval(intervalFunction, 10);
let myInterval = setInterval(sTime, 100);

function sTime() {
  clearInterval(myInterval);
  if ((GETreq != 0) && (playerNo != 0)) {
    console.log('GETreq', GETreq);
    myInterval = setInterval(sTime, GETreq);
    updateTeamStatus();
  }
  else {
    myInterval = setInterval(sTime, 100);
  }
}

function updateTeamStatus() {
  postJSON(createJson('Status', mes = null));
}



//xhr.onload = () =>{commStatus = true;};
//???  Access-Control-Allow-Origin: *
async function postJSON(data) {
  //console.log('data: json->', data);

  try {
    const response = await fetch(url, {
      method: "POST", // or 'PUT'
      headers: {
        'Content-Type': "application/json; charset=UTF-8"
      },
      // body: JSON.stringify({ "id": 78912 })
      body: JSON.stringify(data)
    })
      .then(response => response.json())
    playerNo = parseInt(response.playerNo);
    //console.log("!!!!!!!!:   " + playerNo + '  ' + playercnt + '-> ' + parseInt(response.playercnt));

    while (playercnt < parseInt(response.playercnt)) {
      console.log("create team" + ' ' + playercnt + ' ' + parseInt(response.playercnt));
      createteam();
      playercnt++;
    }

    Fplayercnt = parseInt(response.Fplayercnt);

    console.log("playerNo: " + playerNo + ',  playercnt ' + playercnt + ',  Fplayercnt ' + Fplayercnt);

    if ((playercnt == Fplayercnt) && (Fplayercnt != 0)) {
      console.log("stop sync");
      GETreq = 0; // stop sync
      //clearInterval(myInterval);   ????
      //console.log("------------------------------------- Answers");
      getData(response.team_name);
      //setTimeout(getData(response.team_name), 2000)

      clearInterval(myInterval);
      GETreq = 0;
    }

    //console.log(response);



    //.then(response => console.log(JSON.stringify(response)))
  }
  //const result = await response.json();
  //console.log("Success:", result);
  catch (error) {
    console.error("Error:", error);
  }
  // const result = await response.json();
  //  console.log("Success:", result);

};

async function getData(team) {
  console.log('getData() ' + team);
  let adr = 'application/team/' + team;
  console.log('from adr', adr);
  let answAll;

  fetch('team/' + team, {
    method: 'GET',
    headers: {
      //'Accept': 'application/team/'+team,
      'Content-Type': "application/json; charset=UTF-8"
    },

  })
    .then(console.log('bbbbbbbbbbbbbbbb'))
    .then((response) => response.json())
    .then(response => {
      allAnswArray = response
      //console.log(allAnswArray)
      console.log(allAnswArray['1']["d_team_name"])
      displayResult(pageNr)
    })
}



function initPage() {
  console.log('initPage()');

  nodeTeamName = '';// global
  Fplayercnt = 0; // global
  playercnt = 0;// global



  createPage();
  //let jsonTxt = createJson('Cmd');
  //postJSON(jsonTxt);//   for test
  // getData();  // for test
}
//var dArray = new Array('team_name','player','quest_kas','quest_kad','quest_ar_ko',
//'quest_kur','quest_ko_dara','quest_kapec',message,status,time); 

function createJson(Cmd, mes = null) {// // status   empty-> 'E'||'F' <- fill
  var obj = new Object();
  const timeSinc = new Date();
  //console.log('createJson', Cmd);

  if (Cmd === 'Team') {   // Team || Answer
    obj.status = 'E';
    //playerNo = 0;
    console.log('input_team_name.value  ', input_team_name.value);
  }
  if (Cmd === 'Answer') {   // Team || Answer
    obj.status = 'F';  // status   empty-> 'E'||'F' <- fill


  }
  if (Cmd === 'Answer' || Cmd === 'Team') {
    obj.team_name = input_team_name.value;
    obj.player = playerNo.toString();
    obj.quest_kas = input_quest_kas.value;
    obj.quest_kad = input_quest_kad.value;
    obj.quest_ar_ko = input_quest_ar_ko.value;
    obj.quest_kur = input_quest_kur.value;
    obj.quest_ko_dara = input_quest_ko_dara.value;
    obj.quest_kapec = input_quest_kapec.value;
    obj.message = mes;
    obj.time = parseInt(timeSinc.getTime() / 1000);
  }

  if (Cmd === 'Status') {
    obj.team_name = nodeTeamName;
    obj.player = playerNo.toString();
    obj.message = '';
    obj.status = 'S'; // status
    obj.time = parseInt(timeSinc.getTime() / 2000);
  }
  if (Cmd === 'NEW') {
    obj.team_name = nodeTeamName;
    obj.player = playerNo.toString();
    obj.message = '';
    obj.status = 'M'; // status
    obj.time = parseInt(timeSinc.getTime() / 2000);
    Fplayercnt = 0;
    newGame();
  }


  var jsonString = JSON.stringify(obj);
  console.log(Cmd + '  jsonString ', jsonString);
  const jsonObj = JSON.parse(jsonString);
  return jsonObj;
}

function newGame() {
  Fplayercnt = 0;
  string_map.set(null);
  string_map.set(null);
  string_map.set(null);
  string_map.set(null);
  string_map.set(null);
  string_map.set(null);
  string_map.set(null); 

  }

  window.onload = initPage();









  /*
  //https://stream-wild-elm.glitch.me/
  // https://qlik.dev/tutorials/build-a-simple-web-app
  //(function () {
  
  
     const dataJson = JSON;
     var team;
     let menb;
     let ws;
  
  
     let jsonObj;
     let allAnswArray = new Array();
     let pageNr = 0;
     var stepp = 1;
     const scrWidth = screen.width;
     const scrHeight = screen.height;
  
    
     //myInterval1 = setTimeout(timeoutFunction, 2000);
  
  
  
  
     var timcount = 0;
     let myInterval = setInterval(intervalFunction, 10);
     s = new FriendlyWebSocket();
  
  
  
  ///////////////////////////////////////////////////
  */




  function createteam() {

    let arrlen = teamimgArray.length;
    let divId = 'tdiv' + arrlen;
    //console.log('create New element' + ' ' + divId + teamimgArray);
    //let teamimgArray = new Array();   // id,ststus,x,y

    const imgArray = new Map();
    imgArray.set('id', '1');
    imgArray.set('ststus', '1');    // fill answers, wait result
    imgArray.set('xDest', '1');   // destination
    imgArray.set('yDest', '1');
    imgArray.set('move', '0');    // 0 stop, 1 move
    imgArray.set('step', '1');    // step must  to go

    teameImg = document.createElement("img");
    teameImg.setAttribute('src', 'images/scrill1.png');
    teameImg.setAttribute('height', '100px');
    teameImg.setAttribute('width', '100px');
    //teameImg.setAttribute('id', 'teameImg');

    const teamediv = document.createElement("div");
    teamediv.appendChild(teameImg);

    teamediv.setAttribute("position", "absolute");
    teamediv.setAttribute('id', divId);


    //let str = 'position:absolute;width:100px;height:100px;top:10px;left:'+ (winWidth - 50 * (teamimgArray.length*1 +1)).toString() + 'px;opacity:0.8';
    teamediv.style.cssText = 'position:absolute;/*width:100px;height:100px;top:10px;left:10px;*/  /*opacity:0.8;z-index:100;;';
    //teamediv.style.cssText ='position:absolute;width:100px;height:100px;top:10px;left:10px;opacity:0.8;z-index:100;background:#000;';

    imgArray.set('id', divId);
    imgArray.set('ststus', '1');    // fill answers = 1 , wait result = 2

    let dest = 500 + 50 * (teamimgArray.length * 1 + 1);
    imgArray.set('xDest', dest.toString());
    imgArray.set('yDest', 9 * winHeight / 10);
    imgArray.set('move', '0');    // 0 stop, 1 move
    imgArray.set('step', '200');    // step must  to go

    teamimgArray.push(imgArray);

    //console.log('create New element' + ' ' + divId );
    //teamediv.style.backgroundColor = "lightgreen";
    document.body.appendChild(teamediv);

    teameMoveTo(divId, winWidth - 50 * (teamimgArray.length * 1 + 1), 10, 0);
  }

  function deleteMember(mes) {
    console.log('deleteMember 1 ' + mes + ' l=' + teamimgArray.length)
    let id;

    for (let i = 0; i < teamimgArray.length; i++) {
      console.log(i + ' ' + teamimgArray[i].get('ststus') + '  ' + mes + ' ' + team)

      if (mes == 'ANSWER') {
        if (teamimgArray[i].get('ststus') > 1) {   // send answer
          console.log(i + ' DEL  ' + teamimgArray[i].get('ststus') + '  ' + mes + ' ' + team)
          id = teamimgArray[i].get('id');
          teamimgArray.splice(i, 1);
          break;
        }
      }
      else {

        if (teamimgArray[i].get('ststus') <= 1) {   // send answer
          console.log(i + ' DELLLL  ' + teamimgArray[i].get('ststus') + '  ' + mes + ' ' + team)
          id = teamimgArray[i].get('id');
          teamimgArray.splice(i, 1);
          break;
        }
      }
    }
    console.log('deleteMember 2 ' + mes + ' l=  ' + teamimgArray.length + ' ' + id)
    const element = document.getElementById(id);
    element.remove();
    // id.remove();
  }

  function membersFinished(menFinish) {

    let finished = menFinish;

    for (let i = 0; (i < teamimgArray.length) && (finished > 0); i++) {

      if (teamimgArray[i].get('ststus') < 2) {    // 
        teamimgArray[i].set('ststus', 3);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
        teamimgArray[i].set('xDest', winWidth / 3);
        teamimgArray[i].set('yDest', 10);
        teamimgArray[i].set('move', '1');    // 0 stop, 1 move
        teamimgArray[i].set('step', '200');    // step must  to go
      }
      finished--;
    }

  }


  //AAAAA
  function teameMoveTo(id, xPos, yPos, stat) {
    for (let i = 0; i < teamimgArray.length; i++) {

      if (teamimgArray[i].get('id').localeCompare(id) == 0) {
        teamimgArray[i].set('ststus', stat);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
        teamimgArray[i].set('xDest', xPos);
        teamimgArray[i].set('yDest', yPos);
        teamimgArray[i].set('move', '1');    // 0 stop, 1 move
        teamimgArray[i].set('step', '200');    // step must  to go
      }
    }
  }

  function intervalFunction() {
    timcount = timcount + 1;
    //console.log(timcount);

    for (let i = 0; i < teamimgArray.length; i = i + 1) {
      // console.log(teamimgArray[i].get('move') + ' '+ teamimgArray[i].get('id'));


      if (teamimgArray[i].get('move') == 1) {


        doc = document.getElementById(teamimgArray[i].get('id'));

        var elStyle = window.getComputedStyle(doc);      // actual location
        var topValue = elStyle.getPropertyValue('top').replace("px", "");
        var leftValue = elStyle.getPropertyValue('Left').replace("px", "");

        let step = teamimgArray[i].get('step')
        let xStep = (teamimgArray[i].get('xDest') * 1 - leftValue * 1) / step * 1;   // target
        let yStep = (teamimgArray[i].get('yDest') * 1 - topValue * 1) / step * 1;

        teamimgArray[i].set('step', step - 1);
        if ((step - 1) <= 0) {          // stop
          teamimgArray[i].set('move', 0);
          if (teamimgArray[i].get('ststus') == 2) {
            teamimgArray[i].set('ststus', 3);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
            teamimgArray[i].set('xDest', winWidth / 3);
            teamimgArray[i].set('yDest', 10);
            teamimgArray[i].set('move', '1');    // 0 stop, 1 move
            teamimgArray[i].set('step', '200');    // step must  to go
          }

          else if (teamimgArray[i].get('ststus') == 3) {
            teamimgArray[i].set('ststus', 2);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
            teamimgArray[i].set('xDest', 2 * winWidth / 3);
            teamimgArray[i].set('yDest', 10);
            teamimgArray[i].set('move', '1');    // 0 stop, 1 move
            teamimgArray[i].set('step', '200');    // step must  to go
          }

        }


        if (xStep >= 0) {
          move(doc, "right", distance = xStep);
        }
        if (xStep < 0) {
          move(doc, "left", distance = xStep * -1);
        }
        if (yStep >= 0) {
          move(doc, "up", distance = yStep * -1);
        }
        if (yStep < 0) {
          move(doc, "down", distance = yStep);
        }

      }
    }
  }


  function move1(element, direction, distance = 20) {
    var topOrLeft = (direction == "left" || direction == "right") ? "left" : "top";
    if (direction == "up" || direction == "left") { distance *= -1; }
    var elStyle = window.getComputedStyle(element);
    var value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
    element.style[topOrLeft] = (Number(value) + distance) + "px";
  }

  function move(element, direction, distance = 20) {
    var topOrLeft = (direction == "left" || direction == "right") ? "left" : "top";
    var elStyle = window.getComputedStyle(element);

    if (direction == "down") {
      var topValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
      element.style.top = (Number(topValue) + distance) + "px";
    }

    if (direction == "up") {
      var topValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
      element.style.top = (Number(topValue) - distance) + "px";
    }
    if (direction == "left") {
      var leftValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
      element.style.left = (Number(leftValue) - distance) + "px";
    }
    if (direction == "right") {
      var leftValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
      element.style.left = (Number(leftValue) + distance) + "px";
    }
  }


  function sendteamnameToServ() {
    postJSON(createJson('Team', mes = null));
  }

  function sendAnswersToServ() {
    postJSON(createJson('Answer', mes = null));
  }



  function createPage() {
    fonsImg = document.createElement("img");
    fonsImg.setAttribute('src', 'images/fons41.png');
    fonsImg.setAttribute('height', '100%');
    fonsImg.setAttribute('width', '100%');

    const fonsdiv = document.createElement("div");

    fonsdiv.style.cssText = 'position:absolute;width:100%;height:96%;top:0%;left:0%;opacity:1;z-index:100;;';

    label_team_name = document.createElement("label");
    label_team_name.innerHTML = "Team name";
    label_team_name.style.cssText = 'position:fixed;top:17%;left:44%;width:17%;height:%;opacity:1;font-size:3vw;';

    label_info_team_name = document.createElement("label");
    label_info_team_name.innerHTML = "Team name";
    //label_info_team_name.setAttribute('id', 'info_team_name');  
    label_info_team_name.style.cssText = 'position:fixed;top:5%;left:47%;width:17%;height:%;opacity:1;font-size:2vw;';

    input_team_name = document.createElement("TEXTAREA");
    input_team_name.setAttribute("type", "text");
    //input_team_name.setAttribute('id', 'input_team_name');

    let cook = document.cookie;

    input_team_name.value = cook;
    input_team_name.style.cssText = 'position:fixed;top:25%;left:30%;width:40%;height:5%;opacity:1;font-size:2vw;';

    input_btn_submTeam = document.createElement("BUTTON");
    input_btn_submTeam.innerHTML = "Connect to team";
    //input_btn_submTeam.setAttribute('id', 'btn_submTeam'); 
    input_btn_submTeam.style.cssText = 'position:fixed;top:41%;left:35%;width:30%;height:7%;opacity:1;font-size:3vw;';


    label_quest_kas = document.createElement("label");
    label_quest_kas.innerHTML = "Kas?";
    label_quest_kas.style.cssText = 'position:fixed;top:19%;left:23%;width:100%;height:100%;opacity:1;font-size:3vw;;';

    input_quest_kas = document.createElement("TEXTAREA");
    input_quest_kas.setAttribute("type", "text");
    //input_quest_kas.setAttribute('id', 'quest_kas');
    input_quest_kas.value = '';
    input_quest_kas.style.cssText = 'position:fixed;top:18%;left:35%;width:38%;height:5%;opacity:1;font-size:2vw;';

    label_quest_kad = document.createElement("label");
    label_quest_kad.innerHTML = "Kad?";
    label_quest_kad.style.cssText = 'position:fixed;top:28%;left:23%;width:100%;height:100%;opacity:1;font-size:3vw;;';

    input_quest_kad = document.createElement("TEXTAREA");
    input_quest_kad.setAttribute("type", "text");
    //input_quest_kad.setAttribute('id', 'quest_kad');
    input_quest_kad.value = '';
    input_quest_kad.style.cssText = 'position:fixed;top:27%;left:35%;width:38%;height:5%;opacity:1;font-size:2vw;';


    label_quest_ar_ko = document.createElement("label");
    label_quest_ar_ko.innerHTML = "Ar ko?";
    label_quest_ar_ko.style.cssText = 'position:fixed;top:38%;left:23%;width:100%;height:100%;opacity:1;font-size:3vw;;';

    input_quest_ar_ko = document.createElement("TEXTAREA");
    input_quest_ar_ko.setAttribute("type", "text");
    //input_quest_ar_ko.setAttribute('id', 'quest_ar_ko');
    input_quest_ar_ko.value = '';
    input_quest_ar_ko.style.cssText = 'position:fixed;top:36%;left:35%;width:38%;height:5%;;opacity:1;font-size:2vw;';

    label_quest_kur = document.createElement("label");
    label_quest_kur.innerHTML = "Kur?";
    label_quest_kur.style.cssText = 'position:fixed;top:46%;left:23%;width:100%;height:100%;opacity:1;font-size:3vw;;';

    input_quest_kur = document.createElement("TEXTAREA");
    input_quest_kur.setAttribute("type", "text");
    //input_quest_kur.setAttribute('id', 'quest_kur');
    input_quest_kur.value = '';
    input_quest_kur.style.cssText = 'position:fixed;top:45%;left:35%;width:38%;height:5%;opacity:1;font-size:2vw;';

    label_quest_ko_dara = document.createElement("label");
    label_quest_ko_dara.innerHTML = "Ko dara?";
    label_quest_ko_dara.style.cssText = 'position:fixed;top:55%;left:23%;width:100%;height:100%;opacity:1;font-size:3vw;;';

    input_quest_ko_dara = document.createElement("TEXTAREA");
    input_quest_ko_dara.setAttribute("type", "text");
    //input_quest_ko_dara.setAttribute('id', 'ko_dara');
    input_quest_ko_dara.value = '';
    input_quest_ko_dara.style.cssText = 'position:fixed;top:54%;left:35%;width:38%;height:5%;opacity:1;font-size:2vw;';

    label_quest_kapec = document.createElement("label");
    label_quest_kapec.innerHTML = "Kāpēc?";
    label_quest_kapec.style.cssText = 'position:fixed;top:64%;left:23%;width:100%;height:100%;opacity:1;font-size:3vw;;';

    input_quest_kapec = document.createElement("TEXTAREA");
    input_quest_kapec.setAttribute("type", "text");
    //input_quest_kapec.setAttribute('id', 'kapec');
    input_quest_kapec.value = '';
    input_quest_kapec.style.cssText = 'position:fixed;top:63%;left:35%;width:38%;height:5%;opacity:1;font-size:2vw;';

    input_btn_toServer = document.createElement("BUTTON");
    input_btn_toServer.innerHTML = "SEND ANSWERS";
    // input_btn_toServer.setAttribute('id', 'btn_toServer'); 
    input_btn_toServer.style.cssText = 'position:fixed;top:71%;left:38%;width:30%;height:7%;opacity:1;;';

    div1 = document.createElement("div");
    div1.setAttribute('id', 'div1');
    div1.cssText = 'position:fixed;top:79%;left:38%;width:30%;height:7%;opacity:1;;';
    //div1.style.cssText ='position:absolute;width:100px;height:100px;top:120px;left:200px;opacity:1;z-index:100;color: #FFFFFF;;';

    div3 = document.createElement("div");
    div3.setAttribute('id', 'div3');
    //div3.style.cssText ='position:absolute;width:100%;height:100%;top:12%;left:20%;opacity:1;z-index:100;color: #FFFFFF;;';

    div3.appendChild(label_team_name);
    div3.appendChild(input_team_name);
    div3.appendChild(input_btn_submTeam);


    div1.appendChild(label_info_team_name);
    div1.appendChild(label_quest_kas);
    div1.appendChild(input_quest_kas);
    div1.appendChild(label_quest_kad);
    div1.appendChild(input_quest_kad);
    div1.appendChild(label_quest_ar_ko);
    div1.appendChild(input_quest_ar_ko);
    div1.appendChild(label_quest_kur);
    div1.appendChild(input_quest_kur);
    div1.appendChild(label_quest_ko_dara);
    div1.appendChild(input_quest_ko_dara);
    div1.appendChild(label_quest_kapec);
    div1.appendChild(input_quest_kapec);
    div1.appendChild(input_btn_toServer);


    div2 = document.createElement("div");
    div2.setAttribute('id', 'div2');
    input_btn_left = document.createElement("img");
    input_btn_left.setAttribute('src', 'images/pngwing(L).png');
    input_btn_left.style.cssText = 'position:fixed;top:18%;left:24%;width:7%;height:auto;opacity:1;';


    input_btn_mix = document.createElement("img");
    input_btn_mix.setAttribute('src', 'images/mix.png');
    input_btn_mix.style.cssText = 'position:fixed;top:18%;left:44%;width:10%;height:auto;opacity:1;';


    input_btn_right = document.createElement("img");
    input_btn_right.setAttribute('src', 'images/pngwing(R).png');
    input_btn_right.style.cssText = 'position:fixed;top:18%;left:64%;width:7%;height:auto;opacity:1;';

    label_result = document.createElement("label");
    label_result.innerHTML = "";
    label_result.style.cssText = 'position:fixed;top:28%;left:24%;width:52%;height:58%;opacity:1;font-size:2vw;;';//background:#F00;


    input_btn_new_game = document.createElement("img");
    input_btn_new_game.setAttribute('src', 'images/new.png');
    input_btn_new_game.style.cssText = 'position:fixed;top:75%;left:39%;width:21%;height:auto;opacity:1;';


    div2.appendChild(input_btn_left);
    div2.appendChild(input_btn_mix);
    div2.appendChild(input_btn_right);
    div2.appendChild(label_result);
    div2.appendChild(input_btn_new_game);


    label_message = document.createElement("label");
    //label_message.setAttribute('id', 'message '); 
    label_message.innerHTML = '';
    label_message.style.cssText = 'position:fixed;top:87%;left:21%;width:60%;height:5%;opacity:1;font-size:2vw;;';


    fonsdiv.appendChild(fonsImg);
    fonsdiv.appendChild(div1);
    fonsdiv.appendChild(div2);
    fonsdiv.appendChild(div3);

    fonsdiv.appendChild(label_message);
    document.body.appendChild(fonsdiv);
    body.style.backgroundImage = "url('images/fons3.jpg')";
    // body.style.backgroundColor = "lightgreen";

    div1.style.display = "none";
    div2.style.display = "none";
    div3.style.display = "block";

  }

  function showMessage(mes) {
    label_message.innerHTML = mes;
  }

  //AAAAA



  input_btn_new_game.onclick = function () {
    console.log('input_btn_new_game..onclick ==> ');
    input_quest_kas.value = '';
    input_quest_kad.value = '';
    input_quest_ar_ko.value = '';
    input_quest_kur.value = '';
    input_quest_ko_dara.value = '';
    input_quest_kapec.value = '';

    //sendMessToServer(createJson('NEW'));
    postJSON(createJson('NEW'), mess = null);

    showInputTable(true);
    GETreq = 5000;  // enable GET request 1000ms
  };


  input_btn_left.onclick = function () {
    console.log('left_btn.onclick ==> ' + ' ' + allAnswArray.length + " " + pageNr);
    if (pageNr <= 0) {
      pageNr = allAnswArray.length - 1;
    }
    else {
      pageNr = pageNr - 1;
    }
    displayResult(pageNr);
  };

  input_btn_mix.onclick = function () {
    pageNr = pageNr + stepp;
    stepp++;
    if (pageNr >= allAnswArray.length) {
      pageNr = pageNr % allAnswArray.length;
    }
    displayResult(pageNr);
  };
  input_btn_right.onclick = function () {
    console.log('btn_right.onclick ==> page' + pageNr);
    if (pageNr >= allAnswArray.length - 1) {
      pageNr = 0;
    }
    else {
      pageNr = pageNr + 1;
    }
    displayResult(pageNr);
  };

  input_btn_submTeam.onclick = function () {
    team = input_team_name.value;
    nodeTeamName = team;
    if (!team || team.length === 0) { team = 'Team' };
    label_info_team_name.innerHTML = team;
    console.log('enter teamename ==> ' + ' ' + team);
    string_map.set('name', team);
    sendteamnameToServ();


    //old sendMessToServer(createJson('TEAMNAME'));
    showInputTable(true);
    //  createteam();   // I'am
    document.cookie = team + "; max-age=2592000";  // 60*60*24*30= (s)

    GETreq = 5000;  // enable GET request
  };



  /*
  submitname.onclick = function () {
      //   login();
    sendMessToServer(createJson('TEAMNAME')); 
  };
  */

  input_quest_kas.oninput = function () {
    string_map.set('kas', input_quest_kas.value);
  };
  input_quest_kad.oninput = function () {
    string_map.set('kad', input_quest_kad.value);
  };
  input_quest_ar_ko.oninput = function () {
    string_map.set('arko', input_quest_ar_ko.value);
  };
  input_quest_kur.oninput = function () {
    string_map.set('kur', input_quest_kur.value);
  };
  input_quest_ko_dara.oninput = function () {
    string_map.set('ko_dara', input_quest_ko_dara.value);
  };
  input_quest_kapec.oninput = function () {
    string_map.set('kapec', input_quest_kapec.value);
  };

  input_btn_toServer.onclick = function () {
    //const string_map = new Map('id','name','kas','kad','arko','kur','ko_dara','kapec');
    if (
      string_map.get('name') &&
      string_map.get('kas') &&
      string_map.get('kad') &&
      string_map.get('arko') &&
      string_map.get('kur') &&
      string_map.get('ko_dara') &&
      string_map.get('kapec')) {
      sendAnswersToServ();
      showInputTable(false);
      showMessage("Replies sent to server");
    }
    else {
      showMessage(
        string_map.get('name') + ' ' +
        string_map.get('kas') + ' ' +
        string_map.get('kad') + ' ' +
        string_map.get('arko') + ' ' +
        string_map.get('kur') + ' ' +
        string_map.get('ko_dara') + ' ' +
        string_map.get('kapec') + ' ' +
        "Fill all answers !!!!!");
      return;
    }
  }



  function displayResult(offs) {
    console.log('displayResult', offs);
    showMessage('displayResult');

    //let displArray = [...allAnswArray(offs)];
    let displArray = allAnswArray;
    // console.log('displayResult ' + ' ' + offs + ' ' + allAnswArray.length);
    // console.log('displArray len => ',Fplayercnt);

    if (offs > displArray.length - 1) {
      offs = 0;
    }

    let str = displArray[String(offs % Fplayercnt + 1)]["d_kas"].concat("<br>",
      displArray[String((offs + 1) % Fplayercnt + 1)]["d_kad"], "<br>",
      displArray[String((offs + 2) % Fplayercnt + 1)]["d_ar_ko"], "<br>",
      displArray[String((offs + 3) % Fplayercnt + 1)]["d_kur"], "<br>",
      displArray[String((offs + 4) % Fplayercnt + 1)]["d_ko_dara"], "<br>",
      displArray[String((offs + 5) % Fplayercnt + 1)]["d_kapec"], "<br>");



    showMessage(allAnswArray['1']["d_team_name"] + ' team result');
    //  console.log(str);
    label_result.innerHTML = str;
  }


  function max(max, val) {
    if (val < max) {
      return val;
    }
    else {
      val = val % max;
      return val;
    }
  }

  function showInputTable(value) { // 
    console.log('showInputTable ==> ', value);
    let val = '';
    if (value) {
      val = "block";
      div1.style.display = "block";
      div2.style.display = "none";
      div3.style.display = "none";
      label_info_team_name.style.display = "block";
    }
    else {
      val = "none";
      div1.style.display = "none";
      div2.style.display = "block";
      div3.style.display = "none";
      label_info_team_name.style.display = "block";
    }
  }
