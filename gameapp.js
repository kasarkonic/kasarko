// vers 0.0.1


(function () {

    const head = document.querySelector('#head');
    const body = document.querySelector('#body');

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

    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    //showMessage('screen: ' + scrWidth + ' x ' + scrHeight + ',  window ' + winWidth + ' x ' + winHeight);
   
    let teamimgArray = new Array();   // id,ststus,x,y

   
    //const teamediv = document.createElement("div");
   // enum Cmd {
   //   TEAMNAME,
   //   ANSWER,
   //   LOG,
   // }

    //const string_map = new Map('id','name','kas','kad','ar_ko','kur','ko_dara','kapec');
    const string_map = new Map;

    window.onload = initPage();
    login();
    //myInterval1 = setTimeout(timeoutFunction, 2000);

    var timcount = 0;
    myInterval = setInterval(intervalFunction, 10);


  function createteam(){

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
    teamediv.setAttribute('id', divId );


    //let str = 'position:absolute;width:100px;height:100px;top:10px;left:'+ (winWidth - 50 * (teamimgArray.length*1 +1)).toString() + 'px;opacity:0.8';
    teamediv.style.cssText ='position:absolute;/*width:100px;height:100px;top:10px;left:10px;*/opacity:0.8;z-index:100;;';
    //teamediv.style.cssText ='position:absolute;width:100px;height:100px;top:10px;left:10px;opacity:0.8;z-index:100;background:#000;';

    imgArray.set('id', divId);
    imgArray.set('ststus', '1');    // fill answers = 1 , wait result = 2

    let dest = 500 + 50 * (teamimgArray.length*1 +1);
    imgArray.set('xDest', dest.toString());
    imgArray.set('yDest', 9 * winHeight/10);
    imgArray.set('move', '0');    // 0 stop, 1 move
    imgArray.set('step', '200');    // step must  to go

    teamimgArray.push(imgArray);

    //console.log('create New element' + ' ' + divId );
    //teamediv.style.backgroundColor = "lightgreen";
    document.body.appendChild(teamediv);

    teameMoveTo(divId,winWidth - 50 * (teamimgArray.length*1 +1), 10,0);
  }

  function deleteMember(mes){
    console.log('deleteMember 1 ' + mes +' l='+ teamimgArray.length )
    let id ;

    for (let i=0 ; i < teamimgArray.length; i++){
      console.log(i + ' ' + teamimgArray[i].get('ststus') +'  '+  mes + ' ' + team )

      if(mes == 'ANSWER'){
          if (teamimgArray[i].get('ststus') > 1){   // send answer
            console.log(i + ' DEL  ' + teamimgArray[i].get('ststus') +'  '+  mes + ' ' + team )
            id = teamimgArray[i].get('id');
            teamimgArray.splice(i, 1); 
            break;
        }
      }
      else{

        if (teamimgArray[i].get('ststus') <= 1){   // send answer
          console.log(i + ' DELLLL  ' + teamimgArray[i].get('ststus') +'  '+  mes + ' ' + team )
          id = teamimgArray[i].get('id');
          teamimgArray.splice(i, 1); 
          break;
      }
      }
  }

  console.log('deleteMember 2 ' + mes +' l=  '+ teamimgArray.length + ' ' + id )

  const element = document.getElementById(id);
  element.remove();


 // id.remove();




  }

  function membersFinished(menFinish){

    let finished = menFinish;

    for (let i = 0; (i < teamimgArray.length) && (finished  >  0); i++){

      if(teamimgArray[i].get('ststus') < 2 ){    // 
        teamimgArray[i].set('ststus', 3);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
        teamimgArray[i].set('xDest', winWidth/3);
        teamimgArray[i].set('yDest', 10);
        teamimgArray[i].set('move', '1');    // 0 stop, 1 move
        teamimgArray[i].set('step', '200');    // step must  to go
      }
        finished--;
    }

  }




  //AAAAA
  function teameMoveTo(id,xPos, yPos,stat){  

    for (let i = 0; i < teamimgArray.length; i++){

      if(teamimgArray[i].get('id').localeCompare(id) == 0){
        teamimgArray[i].set('ststus', stat);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
        teamimgArray[i].set('xDest', xPos);
        teamimgArray[i].set('yDest', yPos);
        teamimgArray[i].set('move', '1');    // 0 stop, 1 move
        teamimgArray[i].set('step', '200');    // step must  to go
      }
    }
  }

  function intervalFunction(){
    timcount = timcount +1 ;
    //console.log(timcount);

    for(let i = 0; i < teamimgArray.length; i=i+1){
    // console.log(teamimgArray[i].get('move') + ' '+ teamimgArray[i].get('id'));


      if(teamimgArray[i].get('move') == 1){


        doc = document.getElementById(teamimgArray[i].get('id'));

        var elStyle = window.getComputedStyle(doc);      // actual location
        var topValue = elStyle.getPropertyValue('top').replace("px", "");
        var leftValue = elStyle.getPropertyValue('Left').replace("px", "");
      
        let step = teamimgArray[i].get('step')
        let xStep = (teamimgArray[i].get('xDest') * 1 - leftValue * 1)/step * 1 ;   // target
        let yStep = (teamimgArray[i].get('yDest') * 1 -  topValue * 1)/step * 1;

        teamimgArray[i].set('step', step -1);
        if((step - 1) <= 0){          // stop
          teamimgArray[i].set('move', 0);   
            if(teamimgArray[i].get('ststus') == 2){
                teamimgArray[i].set('ststus', 3);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
                teamimgArray[i].set('xDest', winWidth/3);
                teamimgArray[i].set('yDest', 10);
                teamimgArray[i].set('move', '1');    // 0 stop, 1 move
                teamimgArray[i].set('step', '200');    // step must  to go
            }

            else if(teamimgArray[i].get('ststus') == 3){
                teamimgArray[i].set('ststus', 2);    // fill team count = 0,  answers = 1, wait result move L = 2,wait result move R = 3,
                teamimgArray[i].set('xDest', 2*winWidth/3);
                teamimgArray[i].set('yDest', 10);
                teamimgArray[i].set('move', '1');    // 0 stop, 1 move
                teamimgArray[i].set('step', '200');    // step must  to go
            }

        }


        if(xStep >= 0){
          move(doc, "right", distance=xStep);
        }
        if(xStep < 0){
          move(doc, "left", distance=xStep*-1);
        }
        if(yStep >= 0){
          move(doc, "up", distance=yStep*-1);
        }
        if(yStep < 0){
          move(doc, "down", distance=yStep);
        }

      }
    } 
  }


  function move1(element, direction, distance=20) {
    var topOrLeft = (direction=="left" || direction=="right") ? "left" : "top";
    if (direction=="up" || direction=="left") { distance *= -1; }
    var elStyle = window.getComputedStyle(element);
    var value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
    element.style[topOrLeft] = (Number(value) + distance) + "px";
 }

 function move(element, direction, distance=20) {
  var topOrLeft = (direction=="left" || direction=="right") ? "left" : "top";
  var elStyle = window.getComputedStyle(element);

  if (direction=="down" ) { 
    var topValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
    element.style.top = (Number(topValue) + distance) + "px";
  }

  if (direction=="up") {
      var topValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
      element.style.top = (Number(topValue) - distance) + "px";
    }
  if (direction=="left") {
    var leftValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
    element.style.left = (Number(leftValue) - distance) + "px";

  }
  if (direction=="right") { 
    var leftValue = elStyle.getPropertyValue(topOrLeft).replace("px", "");
    element.style.left = (Number(leftValue) + distance) + "px";
   }
 }

  function initPage(){ 
     fonsImg = document.createElement("img");
     fonsImg.setAttribute('src', 'images/fons41.png');
     fonsImg.setAttribute('height','100%');
     fonsImg.setAttribute('width', '100%');

     const fonsdiv = document.createElement("div"); 
  
     fonsdiv.style.cssText = 'position:absolute;width:100%;height:96%;top:0%;left:0%;opacity:1;z-index:100;;';

     label_team_name = document.createElement("label");
     label_team_name.innerHTML = "Team name";  
     label_team_name.style.cssText ='position:fixed;top:17%;left:44%;width:17%;height:%;opacity:1;font-size:2vw;';

     label_info_team_name = document.createElement("label");
     label_info_team_name.innerHTML = "Team name";
     //label_info_team_name.setAttribute('id', 'info_team_name');  
     label_info_team_name.style.cssText ='position:fixed;top:5%;left:47%;width:17%;height:%;opacity:1;font-size:2vw;';
     
     input_team_name = document.createElement("TEXTAREA");
     input_team_name.setAttribute("type", "text");
     //input_team_name.setAttribute('id', 'input_team_name');
     
     let cook = document.cookie;

     input_team_name.value = cook; 
     input_team_name.style.cssText ='position:fixed;top:25%;left:30%;width:40%;height:5%;opacity:1;;';

     label_quest_kas = document.createElement("label");
     label_quest_kas.innerHTML = "Kas?";  
     label_quest_kas.style.cssText ='position:fixed;top:19%;left:25%;width:100%;height:100%;opacity:1;font-size:2vw;;';
     
     input_btn_submTeam = document.createElement("BUTTON");
     input_btn_submTeam.innerHTML = "Send to server team";  
     //input_btn_submTeam.setAttribute('id', 'btn_submTeam'); 
     input_btn_submTeam.style.cssText = 'position:fixed;top:41%;left:35%;width:30%;height:7%;opacity:1;;';




     input_quest_kas = document.createElement("TEXTAREA");
     input_quest_kas.setAttribute("type", "text");
     //input_quest_kas.setAttribute('id', 'quest_kas');
     input_quest_kas.value = '';  
     input_quest_kas.style.cssText ='position:fixed;top:18%;left:35%;width:40%;height:5%;opacity:1;;';

     label_quest_kad = document.createElement("label");
     label_quest_kad.innerHTML = "Kad?";  
     label_quest_kad.style.cssText ='position:fixed;top:28%;left:25%;width:100%;height:100%;opacity:1;font-size:2vw;;';
     
     input_quest_kad = document.createElement("TEXTAREA");
     input_quest_kad.setAttribute("type", "text");
     //input_quest_kad.setAttribute('id', 'quest_kad');
     input_quest_kad.value = '';  
     input_quest_kad.style.cssText ='position:fixed;top:27%;left:35%;width:40%;height:5%;opacity:1;;';

     
     label_quest_ar_ko = document.createElement("label");
     label_quest_ar_ko.innerHTML = "Ar ko?";  
     label_quest_ar_ko.style.cssText ='position:fixed;top:38%;left:25%;width:100%;height:100%;opacity:1;font-size:2vw;;';
     
     input_quest_ar_ko = document.createElement("TEXTAREA");
     input_quest_ar_ko.setAttribute("type", "text");
     //input_quest_ar_ko.setAttribute('id', 'quest_ar_ko');
     input_quest_ar_ko.value = '';  
     input_quest_ar_ko.style.cssText ='position:fixed;top:36%;left:35%;width:40%;height:5%;;opacity:1;;';

     label_quest_kur = document.createElement("label");
     label_quest_kur.innerHTML = "Kur?";  
     label_quest_kur.style.cssText ='position:fixed;top:46%;left:25%;width:100%;height:100%;opacity:1;font-size:2vw;;';
     
     input_quest_kur = document.createElement("TEXTAREA");
     input_quest_kur.setAttribute("type", "text");
     //input_quest_kur.setAttribute('id', 'quest_kur');
     input_quest_kur.value = '';  
     input_quest_kur.style.cssText ='position:fixed;top:45%;left:35%;width:40%;height:5%;opacity:1;;';

     label_quest_ko_dara = document.createElement("label");
     label_quest_ko_dara.innerHTML = "Ko dara?";  
     label_quest_ko_dara.style.cssText ='position:fixed;top:55%;left:25%;width:100%;height:100%;opacity:1;font-size:2vw;;';
     
     input_quest_ko_dara = document.createElement("TEXTAREA");
     input_quest_ko_dara.setAttribute("type", "text");
     //input_quest_ko_dara.setAttribute('id', 'ko_dara');
     input_quest_ko_dara.value = '';  
     input_quest_ko_dara.style.cssText ='position:fixed;top:54%;left:35%;width:40%;height:5%;opacity:1;;';

     label_quest_kapec = document.createElement("label");
     label_quest_kapec.innerHTML = "Kāpēc?";  
     label_quest_kapec.style.cssText ='position:fixed;top:64%;left:25%;width:100%;height:100%;opacity:1;font-size:2vw;;';
     
     input_quest_kapec = document.createElement("TEXTAREA");
     input_quest_kapec.setAttribute("type", "text");
     //input_quest_kapec.setAttribute('id', 'kapec');
     input_quest_kapec.value = '';  
     input_quest_kapec.style.cssText ='position:fixed;top:63%;left:35%;width:40%;height:5%;opacity:1;;';

     input_btn_toServer = document.createElement("BUTTON");
     input_btn_toServer.innerHTML = "Send to server";  
    // input_btn_toServer.setAttribute('id', 'btn_toServer'); 
     input_btn_toServer.style.cssText = 'position:fixed;top:71%;left:38%;width:30%;height:7%;opacity:1;;';

     const div1 = document.createElement("div"); 
     div1.setAttribute('id', 'div1' );
     div1.cssText = 'position:fixed;top:79%;left:38%;width:30%;height:7%;opacity:1;;';
     //div1.style.cssText ='position:absolute;width:100px;height:100px;top:120px;left:200px;opacity:1;z-index:100;color: #FFFFFF;;';
     
     const div3 = document.createElement("div"); 
     div3.setAttribute('id', 'div3' );
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
  

     const div2 = document.createElement("div"); 
     div2.setAttribute('id', 'div2' );
     input_btn_left = document.createElement("img");
     input_btn_left.setAttribute('src', 'images/pngwing(L).png');
     input_btn_left.style.cssText ='position:fixed;top:18%;left:24%;width:7%;height:auto;opacity:1;';


     input_btn_mix = document.createElement("img");
     input_btn_mix.setAttribute('src', 'images/mix.png');
     input_btn_mix.style.cssText ='position:fixed;top:18%;left:44%;width:10%;height:auto;opacity:1;';


     input_btn_right = document.createElement("img");
     input_btn_right.setAttribute('src', 'images/pngwing(R).png');
     input_btn_right.style.cssText ='position:fixed;top:18%;left:64%;width:7%;height:auto;opacity:1;';

     label_result = document.createElement("label");
     label_result.innerHTML = "Result ";  
     label_result.style.cssText ='position:fixed;top:28%;left:24%;width:52%;height:58%;opacity:1;font-size:2vw;;';//background:#F00;


     input_btn_new_game = document.createElement("img");
     input_btn_new_game.setAttribute('src', 'images/new.png');
     input_btn_new_game.style.cssText ='position:fixed;top:75%;left:39%;width:21%;height:auto;opacity:1;';


     div2.appendChild(input_btn_left);
     div2.appendChild(input_btn_mix);
     div2.appendChild(input_btn_right);
     div2.appendChild(label_result);
     div2.appendChild(input_btn_new_game);
    

     label_message = document.createElement("label");
     //label_message.setAttribute('id', 'message '); 
     label_message.innerHTML = '';  
     label_message.style.cssText ='position:fixed;top:87%;left:21%;width:60%;height:5%;opacity:1;font-size:2vw;;';

 
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
 //AAAAAAAAAAAAAAAAAAAAAAAAAAAA

  }

  function showMessage(mes) {
    label_message.innerHTML = mes;  
  } 


  /////////////////////////////////


  function login(){
    fetch('/login', { method: 'POST', credentials: 'same-origin' })
    .then(handleResponse)
    //.then(showMessage)
    .then(createSocket)
    .catch(function (err) {
      showMessage(err.message);
    });
 }

  function createSocket(){
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
    ws = new WebSocket(`ws://${location.host}`);

    ws.onmessage = function(event) {
      //alert(`Rec. msg from server ${event.data}`);
      ////--------------------------------------------------------------------------------------------------------------------
      const strObj = JSON.parse(event.data);
      let messageLength = Object.keys(strObj).length;

      if(messageLength != 11){    // error
      showMessage('Error receive message lenght: ' + messageLength);
        return;
      }

    if(strObj.cmd.localeCompare('MES') == 0){
      //alert(`showMessage ok ok ok ${strObj.message}`);
      //showMessage(strObj.message);
      console.log('MES ==> ' + strObj.message);
    }
    if(strObj.cmd.localeCompare('FINISH') == 0){
      //alert(`showMessage ok ok ok ${strObj.message}`);
      console.log('FINISH ==> ' + strObj.message);
      membersFinished(strObj.message);
    }

    if(strObj.cmd.localeCompare('MEMB') == 0){
     // showMessage('FINISH ==> ' + strObj.message);
      let cnt = strObj.message -  teamimgArray.length;
      console.log('MES ==> ' + strObj.message + ' ' + cnt);
      while (cnt > 0) {
      console.log('cnt ==> ' + cnt);
        createteam();
        cnt--;
      }
    }
    if(strObj.cmd.localeCompare('ANSWER') == 0){
  
    }
    //messageForAll(teamname,'CLOSE' , userId)
    if(strObj.cmd.localeCompare('CLOSE') == 0){
      console.log('CLOSE ==> ' + strObj.mes + ' ' + strObj.cmd);
      let mes = strObj.message;
      deleteMember(mes);
    }




    if(strObj.cmd.localeCompare('RESULT') == 0){
     // showMessage('RESULT msg -> ' + strObj.message);
     //var dArray = new Array('cmd','id','team_name','quest_kas','quest_kad','quest_ar_ko','quest_kur','quest_ko_dara','quest_kapec',message,time);
      let strObjArray = new Array();
      //strObjArray[0] = strObj.message;

      let val0 = strObj.quest_kas;
      let val1 = strObj.quest_kad;
      let val2 = strObj.quest_ar_ko;
      let val3 = strObj.quest_kur;
      let val4 = strObj.quest_ko_dara;
      let val5 = strObj.quest_kapec;

      strObjArray[0] = val0;
      strObjArray[1] = val1;
      strObjArray[2] = val2;
      strObjArray[3] = val3;
      strObjArray[4] = val4;
      strObjArray[5] = val5;
      allAnswArray.push(strObjArray);

        displayResult(pageNr);
      }
    };

    ws.onerror = function () {
      showMessage('WebSocket error');
    };

    ws.onopen = function () {
      sendMessToServer(createJson('LOG','WebSocket connection established'));
    };

    ws.onclose = function () {
      showMessage('WebSocket connection closed');
      ws = null; 
    };
  }

  function sendMessToServer(mes) {
    if (!ws) {
      //showMessage('No WebSocket connection');
        return;
    }
    ws.send(mes);
  }


        input_btn_new_game.onclick = function(){

          input_quest_kas.value = '';
          input_quest_kad.value = '';
          input_quest_ar_ko.value = '';
          input_quest_kur.value = '';
          input_quest_ko_dara.value = '';
          input_quest_kapec.value = '';

          sendMessToServer(createJson('NEW'));
          showInputTable(true);
        };


        input_btn_left.onclick = function(){
          console.log('left_btn.onclick ==> '+ ' '+ allAnswArray.length + " " + pageNr );
          if( pageNr <= 0){
            pageNr = allAnswArray.length-1 ;
          }
          else{
            pageNr = pageNr - 1;
          }
          displayResult(pageNr);
        };

        input_btn_mix.onclick = function(){
          pageNr = pageNr + stepp;
          stepp++;
          if (pageNr >= allAnswArray.length){
            pageNr = pageNr % allAnswArray.length;
          }
          displayResult(pageNr);
        };
        input_btn_right.onclick = function(){
          console.log('btn_right.onclick ==> '+ ' ' +allAnswArray.length + " " + pageNr );
          if( pageNr >= allAnswArray.length - 1){
            pageNr = 0;
          }
          else{
            pageNr = pageNr + 1;
          }
          displayResult(pageNr);
         };

        input_btn_submTeam.onclick = function(){
          team = input_team_name.value;
          label_info_team_name.innerHTML = team;
          console.log('enter teamename ==> ' + ' ' + team);
          string_map.set('name',team);
          sendMessToServer(createJson('TEAMNAME'));
          showInputTable(true);
          createteam();   // I'am
          document.cookie = team + "; max-age=2592000";  // 60*60*24*30= (s)
         };

 /*
  submitname.onclick = function () {
     //   login();
    sendMessToServer(createJson('TEAMNAME')); 
  };
 */
 input_quest_kas.oninput = function () {
        string_map.set('kas',input_quest_kas.value);
    };
    input_quest_kad.oninput = function () {
        string_map.set('kad',input_quest_kad.value);
    };
    input_quest_ar_ko.oninput = function () {
      string_map.set('arko',input_quest_ar_ko.value);
    }; 
    input_quest_kur.oninput = function () {
        string_map.set('kur',input_quest_kur.value);
    };
    input_quest_ko_dara.oninput = function () {
        string_map.set('ko_dara',input_quest_ko_dara.value);
    };
    input_quest_kapec.oninput = function () {
      string_map.set('kapec',input_quest_kapec.value);
    };

    function handleResponse(response) {
      return response.ok
        ? response.json().then((data) => JSON.stringify(data, null, 2))
        : Promise.reject(new Error('Unexpected response'));
    }

    input_btn_toServer.onclick = function(){
          //const string_map = new Map('id','name','kas','kad','arko','kur','ko_dara','kapec');
      if(
        string_map.get('name') &&
        string_map.get('kas') &&
        string_map.get('kad') &&
        string_map.get('arko') &&
        string_map.get('kur') &&
        string_map.get('ko_dara') &&
        string_map.get('kapec')) {
          sendMessToServer(createJson('ANSWER'));
          showInputTable(false);
          //showMessage("Replies sent to server");
        }
        else{
          showMessage(/*
          string_map.get('name') + ' ' +
           string_map.get('kas') + ' ' +
          string_map.get('kad') + ' ' +
           string_map.get('arko') + ' ' +
          string_map.get('kur') + ' ' +
          string_map.get('ko_dara') + ' ' +
          string_map.get('kapec') + ' ' +*/
          "Fill all answers !!!!!");
          return;
        }
    };

  function createJson(trCmd, mes = null){
    const timeSinc = new Date();
    const jsonTxt = { cmd:trCmd, 
    id:null,
    teamName:input_team_name.value,
    quest_kas: input_quest_kas.value,
    quest_kad:input_quest_kad.value,
    quest_ar_ko:input_quest_ar_ko.value,
    quest_kur:input_quest_kur.value,
    quest_ko_dara:input_quest_ko_dara.value,
    quest_kapec:input_quest_kapec.value,
    message:mes,
    time:timeSinc.getTime()};

    if(trCmd === 'LOG'){
      console.log('trCmd == LOG  ' + jsonTxt.teamName);
      jsonTxt.teamName = '';
    }
    jsonObj = JSON.stringify(jsonTxt);
    return jsonObj;
  }

  function displayResult(offs){

    let displArray = [...arrayRotate(offs)];
   // console.log('displayResult ' + ' ' + offs + ' ' + displArray.length);

    if(offs > displArray.length-1){
      offs = 0;
    }
    let offset = 0;
    let str = displArray[offset][0] + "<br>"+
    displArray[offset][1] + "<br>"+
    displArray[offset][2] + "<br>"+
    displArray[offset][3] + "<br>"+
    displArray[offset][4] + "<br>"+
    displArray[offset][5] ;
   // console.log(str);
    label_result.innerHTML = str;  
  }

  function arrayRotate(offs){
    let step = offs;
    // let allAnswRotateArray = [...allAnswArray];
    let maxRow = allAnswArray.length; //allAnswArray[i][0] message 
    let maxCol = 6;  //   maxCol
    var allAnswRotateArray = [];
    for(let i = 0; i < allAnswArray.length; i++) {
       allAnswRotateArray.push(new Array(6));
    }

    for(let k = 0; k < maxCol; k = k + 1 ){
      let offset = k + 1 + step;//
      for( let i = 0; i < maxRow; i = i + 1 ){ 
      // showMessage('['+ max(maxRow,i+offset)+']' +'['+ k +']' + '<=' + '[' + i + ']' + '[' + k + '] ;' +' R=' + maxRow + ' o=' + offset + ' ' + allAnswArray[i][k] + ' <= ' + allAnswArray[i][k] );   
        let val = allAnswArray[i][k];
        allAnswRotateArray[max(maxRow,i+offset)][k] = val;
      //allAnswRotateArray[max(maxRow,i+offset)][k] = allAnswArray[i][k];
      }
    }
    return allAnswRotateArray;
  }

  function max(max,val){
    if (val<max){
      return val;
    }
    else{
      val =  val % max;
      return val;
    }

  }

  function showInputTable(value){ // 
    let  val = '';
    if(value){
      val = "block";
      div1.style.display = "block";
      div2.style.display = "none"; 
      div3.style.display = "none"; 
      label_info_team_name.style.display = "block"; 
     }
     else{
      val = "none";
      div1.style.display = "none"; 
      div2.style.display = "block";
      div3.style.display = "none"; 
      label_info_team_name.style.display = "block";  
    }
  }

})();

