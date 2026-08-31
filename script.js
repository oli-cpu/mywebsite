// OLIVER // DIGITAL SPACE
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const nav=$("#navigation"), menu=$("#menuButton");
menu?.addEventListener("click",()=>nav.classList.toggle("open"));

function activateTab(name){
  $$(".tab-panel").forEach(p=>p.classList.toggle("active",p.dataset.panel===name));
  $$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));
  nav.classList.remove("open"); window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-tab]").forEach(b=>b.addEventListener("click",()=>activateTab(b.dataset.tab)));

$("#year").textContent=new Date().getFullYear();

// cursor glow
const glow=$(".cursor-glow");
window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
// subtle 3D profile card
const tilt=$(".tilt");
window.addEventListener("pointermove",e=>{
  if(!tilt)return;
  const r=tilt.getBoundingClientRect(), x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
  if(x>-1&&x<1&&y>-1&&y<1) tilt.style.transform=`perspective(900px) rotateY(${x*5}deg) rotateX(${-y*5}deg)`;
});
tilt?.addEventListener("mouseleave",()=>tilt.style.transform="");

// live stats
let packets=8421;
setInterval(()=>{$("#packetCounter").textContent=(packets+=Math.floor(Math.random()*8+1)).toString().padStart(5,"0");$("#latencyReading").textContent=(20+Math.random()*8).toFixed(1)+" ms"},1200);

// project modals
const projectInfo={
 "Cybersecurity Homelab":["Eigene Testumgebung für Security- und Netzwerkexperimente.","Linux / Virtualisierung / SIEM / VLAN"],
 "Network Lab":["DHCP, DNS, VLANs, Firewalls und Monitoring in einer kontrollierten Umgebung.","Networking / DNS / DHCP / Wireshark"],
 "CTF & Security":["Challenges zum Trainieren von Enumeration, Web Security und Linux.","CTF / Nmap / Burp Suite / Linux"],
 "Programming":["Kleine Tools und Automatisierungen für Alltag und Lernen.","Python / C# / SQL / Git"]
};
const modal=$("#modal");
function openModal(title,kicker="PROJECT",text="",body=""){
 $("#modalKicker").textContent=kicker;$("#modalTitle").textContent=title;$("#modalText").textContent=text;$("#modalBody").innerHTML=body;modal.classList.add("open");
}
$$(".project-card").forEach(c=>c.addEventListener("click",e=>{
 const t=c.dataset.project, d=projectInfo[t]; if(!d)return;
 openModal(t,"BUILD LOG",d[0],`<div class="modal-list"><div><span>STACK</span><span>${d[1]}</span></div><div><span>STATUS</span><span class="success">ACTIVE</span></div><div><span>MODE</span><span>LEARN / BUILD / TEST</span></div></div>`);
}));
$("#modalClose").addEventListener("click",()=>modal.classList.remove("open"));
modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
document.addEventListener("keydown",e=>{if(e.key==="Escape")modal.classList.remove("open")});

// photo placeholders
$$(".photo-card").forEach(c=>c.addEventListener("click",()=>openModal(c.dataset.photo,"PHOTO VAULT","Hier kannst du dein eigenes Foto einsetzen.",`<div class="modal-list"><div><span>FILE</span><span>${c.querySelector("small").textContent}</span></div><div><span>TIP</span><span>Ersetze den Platzhalter im HTML durch &lt;img src="..."&gt;</span></div></div>`)));

// clicker
let score=0;
$("#clickTarget").addEventListener("click",()=>{
 score++;$("#clickScore").textContent=score;
 $("#clickMessage").textContent=score>=25?"SYSTEM OVERCLOCKED 🔥":`Noch ${25-score} bis zum Ziel`;
});

// reaction game
const reactionBtn=$("#reactionButton"), reactionText=$("#reactionText"), reactionGame=$("#reactionGame");
let reactionState="idle", reactionStart=0, reactionTimer;
reactionBtn.addEventListener("click",()=>{
 if(reactionState==="idle"){
   reactionState="waiting";reactionText.textContent="WAIT...";reactionBtn.textContent="WAIT";
   const delay=1200+Math.random()*3000;
   reactionTimer=setTimeout(()=>{reactionState="go";reactionGame.classList.add("go");reactionText.textContent="GO!";reactionBtn.textContent="CLICK!";reactionStart=performance.now()},delay);
 }else if(reactionState==="waiting"){
   clearTimeout(reactionTimer);reactionState="idle";reactionText.textContent="TOO EARLY";reactionBtn.textContent="START";
 }else{
   const ms=Math.round(performance.now()-reactionStart);reactionText.textContent=ms+" ms";reactionBtn.textContent="AGAIN";reactionGame.classList.remove("go");reactionState="idle";
 }
});

// memory
const memoryGrid=$(".memory-grid"), symbols=["⌁","⌁","◈","◈","⚿","⚿","{","}"].slice(0,8);
let cards=[...symbols,...symbols], first=null, lock=false, matched=0;
cards.sort(()=>Math.random()-.5);
cards.forEach((s,i)=>{
 const b=document.createElement("button");b.className="memory-cell";b.dataset.value=s;b.textContent=s;
 b.addEventListener("click",()=>{
   if(lock||b.classList.contains("flipped")||b.classList.contains("matched"))return;
   b.classList.add("flipped");
   if(!first){first=b;return}
   if(first.dataset.value===b.dataset.value){first.classList.add("matched");b.classList.add("matched");matched+=2;first=null;if(matched===cards.length)$("#memoryStatus").textContent="SYSTEM MASTERED ✓"}
   else{lock=true;setTimeout(()=>{first.classList.remove("flipped");b.classList.remove("flipped");first=null;lock=false},650)}
 });
 memoryGrid.appendChild(b);
});

// snake
const snakeCanvas=$("#snakeCanvas");
if(snakeCanvas){
 const sctx=snakeCanvas.getContext("2d"), cell=20, cols=snakeCanvas.width/cell, rows=snakeCanvas.height/cell;
 let snake,dir,nextDir,food,snakeLoop,snakeRunning=false,snakeScoreVal=0;
 function placeFood(){food={x:Math.floor(Math.random()*cols),y:Math.floor(Math.random()*rows)}}
 function resetSnake(){snake=[{x:5,y:5},{x:4,y:5},{x:3,y:5}];dir={x:1,y:0};nextDir=dir;placeFood();snakeScoreVal=0;$("#snakeScore").textContent="0"}
 function drawSnake(){
   sctx.fillStyle="#0a0e12";sctx.fillRect(0,0,snakeCanvas.width,snakeCanvas.height);
   sctx.fillStyle="#ff7a3d";snake.forEach(s=>sctx.fillRect(s.x*cell+1,s.y*cell+1,cell-2,cell-2));
   sctx.fillStyle="#6dff9b";sctx.fillRect(food.x*cell+1,food.y*cell+1,cell-2,cell-2);
 }
 function stepSnake(){
   dir=nextDir;
   const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
   if(head.x<0||head.y<0||head.x>=cols||head.y>=rows||snake.some(s=>s.x===head.x&&s.y===head.y)){
     snakeRunning=false;clearInterval(snakeLoop);$("#snakeStart").textContent="RETRY";return;
   }
   snake.unshift(head);
   if(head.x===food.x&&head.y===food.y){snakeScoreVal++;$("#snakeScore").textContent=snakeScoreVal;placeFood()}
   else snake.pop();
   drawSnake();
 }
 resetSnake();drawSnake();
 $("#snakeStart").addEventListener("click",()=>{
   resetSnake();drawSnake();
   if(snakeRunning)clearInterval(snakeLoop);
   snakeRunning=true;$("#snakeStart").textContent="RESTART";
   snakeLoop=setInterval(stepSnake,140);
 });
 document.addEventListener("keydown",e=>{
   if(!snakeRunning)return;
   const k=e.key;
   if((k==="ArrowUp"||k==="w")&&dir.y!==1){nextDir={x:0,y:-1};e.preventDefault()}
   else if((k==="ArrowDown"||k==="s")&&dir.y!==-1){nextDir={x:0,y:1};e.preventDefault()}
   else if((k==="ArrowLeft"||k==="a")&&dir.x!==1){nextDir={x:-1,y:0};e.preventDefault()}
   else if((k==="ArrowRight"||k==="d")&&dir.x!==-1){nextDir={x:1,y:0};e.preventDefault()}
 });
}

// tic-tac-toe vs AI
const tttGrid=$("#tttGrid");
if(tttGrid){
 let board,tttOver;
 function checkWinner(b){
   const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
   for(const[a,b1,c]of lines)if(b[a]&&b[a]===b[b1]&&b[a]===b[c])return b[a];
   return b.every(Boolean)?"draw":null;
 }
 function bestMove(b){
   for(let i=0;i<9;i++)if(!b[i]){b[i]="O";if(checkWinner(b)==="O"){b[i]=null;return i}b[i]=null}
   for(let i=0;i<9;i++)if(!b[i]){b[i]="X";if(checkWinner(b)==="X"){b[i]=null;return i}b[i]=null}
   if(!b[4])return 4;
   const corners=[0,2,6,8].filter(i=>!b[i]);
   if(corners.length)return corners[Math.floor(Math.random()*corners.length)];
   const avail=b.map((v,i)=>v?null:i).filter(i=>i!==null);
   return avail[Math.floor(Math.random()*avail.length)];
 }
 function renderTtt(){
   tttGrid.innerHTML="";
   board.forEach((v,i)=>{
     const c=document.createElement("button");
     c.className="ttt-cell";c.textContent=v||"";c.disabled=!!v||tttOver;
     c.addEventListener("click",()=>tttMove(i));
     tttGrid.appendChild(c);
   });
 }
 function tttMove(i){
   if(board[i]||tttOver)return;
   board[i]="X";
   let w=checkWinner(board);
   if(!w){const ai=bestMove(board);if(ai!==undefined)board[ai]="O";w=checkWinner(board)}
   if(w){tttOver=true;$("#tttStatus").textContent=w==="draw"?"Unentschieden.":w==="X"?"Du gewinnst! 🎉":"AI gewinnt."}
   renderTtt();
 }
 function resetTtt(){board=Array(9).fill(null);tttOver=false;$("#tttStatus").textContent="Du bist X. Mach den ersten Zug.";renderTtt()}
 resetTtt();
 $("#tttReset").addEventListener("click",resetTtt);
}

// typing speed test
const typingTarget=$("#typingTarget"), typingInput=$("#typingInput"), typingStart=$("#typingStart");
if(typingTarget){
 const sentences=[
  "Der schnelle braune Fuchs springt über den faulen Hund.",
  "Netzwerke bestehen aus Routern Switches und endlosen Kabeln.",
  "Linux ist mehr als nur ein Betriebssystem es ist eine Philosophie.",
  "Cybersecurity beginnt mit einem starken Passwort und gesundem Misstrauen.",
  "Wer die Grundlagen versteht kann jedes System durchschauen."
 ];
 let typingStartTime, current;
 function newSentence(){
   current=sentences[Math.floor(Math.random()*sentences.length)];
   typingTarget.textContent=current;typingInput.value="";typingInput.disabled=true;
   $("#typingWpm").textContent="0";$("#typingErrors").textContent="0";
 }
 newSentence();
 typingStart.addEventListener("click",()=>{
   newSentence();typingInput.disabled=false;typingInput.focus();typingStartTime=performance.now();
 });
 typingInput.addEventListener("input",()=>{
   const val=typingInput.value;
   let errors=0;
   for(let i=0;i<val.length;i++)if(val[i]!==current[i])errors++;
   $("#typingErrors").textContent=errors;
   const elapsedMin=(performance.now()-typingStartTime)/60000;
   const wordsTyped=val.length/5;
   $("#typingWpm").textContent=elapsedMin>0?Math.max(0,Math.round(wordsTyped/elapsedMin)):0;
   if(val===current){
     typingInput.disabled=true;
     typingTarget.innerHTML=current+' <span style="color:var(--green)">✓ FERTIG</span>';
   }
 });
}

// terminal
const out=$("#terminalOutput"), input=$("#terminalInput");
let cmdHistory=[], historyIndex=-1;
const commands={
 help:()=>`<span class="dim">AVAILABLE COMMANDS</span><br>help · about · projects · skills · games · status · neofetch · banner · date · echo &lt;text&gt; · ping &lt;host&gt; · theme &lt;color&gt; · open &lt;tab&gt; · social · joke · history · whoami · matrix · sudo · clear`,
 about:()=>`Oliver — Informatiker EFZ.<br>Interested in <span class="cmd">networks</span>, <span class="cmd">Linux</span> and <span class="cmd">cybersecurity</span>.`,
 projects:()=>`01 Homelab<br>02 Network Lab<br>03 CTF & Security<br>04 Programming`,
 skills:()=>`Networking █████████░ 90%<br>Linux     ████████░░ 85%<br>Security  ████████░░ 80%<br>Python    ███████░░░ 70%`,
 games:()=>`Arcade online. Try <span class="cmd">Snake</span>, <span class="cmd">Tic-Tac-Toe</span>, den Clicker, Reaction, Memory & Typing Test.`,
 status:()=>`SYSTEM <span class="success">ONLINE</span><br>NETWORK <span class="success">STABLE</span><br>CURIOSITY <span class="success">UNLIMITED</span>`,
 hello:()=>`Hello, stranger. 👋<br>Nice to see you here.`,
 whoami:()=>`visitor@oliver — access level: <span class="success">GUEST</span>`,
 matrix:()=>{document.body.classList.toggle("matrix-mode");return `Matrix mode <span class="success">${document.body.classList.contains("matrix-mode")?"ENABLED":"DISABLED"}</span>.`},
 neofetch:()=>`<pre class="ascii">   ____  _     _____  ___ __
  / __ \\| |   |_   _|/ _ \\ '__|
 | |_| || |___  | | | | | | |
  \\____/|_____| |_| |_| |_|_|</pre>visitor@oliver<br>-----------------<br>OS: OliverOS v2.0<br>Shell: oliver.exe<br>Uptime: ∞<br>Skills: Networking, Linux, Security<br>Theme: Signal Orange`,
 banner:()=>`<pre class="ascii">  ___  _     _____  ___
 / _ \\| |   |_   _|/ _ \\
| | | | |    | | | | | |
| |_| | |___ | | | |_| |
 \\___/|_____||_| \\___/</pre>`,
 date:()=>new Date().toString(),
 echo:(args)=>args.join(" ")||"",
 ping:(args)=>{
   const host=args[0]||"localhost";
   return `Pinging ${host}...<br>Reply from ${host}: time=${(Math.random()*20+2).toFixed(1)}ms TTL=64<br>Reply from ${host}: time=${(Math.random()*20+2).toFixed(1)}ms TTL=64`;
 },
 theme:(args)=>{
   const c=(args[0]||"").toLowerCase();
   const map={orange:"#ff7a3d",green:"#6dff9b",blue:"#3d9bff",red:"#ff4d4d",purple:"#b07aff",pink:"#ff7ac8"};
   const val=map[c]||(c&&/^#[0-9a-f]{3,6}$/i.test(c)?c:null);
   if(!val)return `Verfügbare Themes: ${Object.keys(map).join(", ")} (oder Hex-Code, z.B. #00ffcc)`;
   document.documentElement.style.setProperty("--accent",val);
   return `Theme geändert zu <span class="success">${c}</span>.`;
 },
 open:(args)=>{
   const tab=(args[0]||"").toLowerCase();
   const valid=["start","about","photos","projects","arcade","terminal","contact"];
   if(!valid.includes(tab))return `Unbekannter Tab. Verfügbar: ${valid.join(", ")}`;
   setTimeout(()=>activateTab(tab),300);
   return `Öffne ${tab}...`;
 },
 social:()=>`E-Mail: oliver.studer5@gmail.com<br>LinkedIn: linkedin.com/in/oliver-studer-380a4b396<br>GitHub: github.com/oli-cpu`,
 joke:()=>{
   const jokes=[
     "Es gibt 10 Arten von Menschen: die, die Binär verstehen und die, die es nicht tun.",
     "Warum gehen Programmierer nicht campen? Zu viele Bugs.",
     "Ein SQL-Query geht in eine Bar, sieht zwei Tabellen und fragt: 'Darf ich mich joinen?'",
     "Mein Code funktioniert. Ich weiss nicht warum. Mein Code funktioniert nicht. Ich weiss nicht warum."
   ];
   return jokes[Math.floor(Math.random()*jokes.length)];
 },
 history:()=>cmdHistory.length?cmdHistory.map((c,i)=>`${i+1}&nbsp;&nbsp;${c}`).join("<br>"):"Keine Befehle bisher.",
 sudo:(args)=>{
   const rest=args.join(" ");
   if(rest.includes("rm -rf"))return `<span class="dim">Netter Versuch. 😏 Dieses System löscht sich nicht selbst.</span>`;
   return `Permission denied: visitor ist kein sudoer. Dieser Vorfall wird gemeldet. (nicht wirklich)`;
 },
 exit:()=>`Du kannst das Terminal schliessen, aber nicht das echte Leben verlassen. 😄`
};
function printTerminal(text,cmd=false){const d=document.createElement("div");if(cmd)d.innerHTML=`<span class="cmd">visitor@oliver:~$ ${text}</span>`;else d.innerHTML=text;out.appendChild(d);out.scrollTop=out.scrollHeight}
$("#terminalForm").addEventListener("submit",e=>{
 e.preventDefault();
 const raw=input.value.trim();if(!raw)return;
 printTerminal(raw,true);
 cmdHistory.push(raw);historyIndex=cmdHistory.length;
 input.value="";
 const[cmdName,...args]=raw.split(/\s+/);
 const key=cmdName.toLowerCase();
 if(key==="clear"){out.innerHTML="";return}
 const fn=commands[key];
 if(fn){const result=fn(args);if(result)printTerminal(result)}
 else printTerminal(`<span class="dim">command not found: ${key}. Try "help".</span>`);
});
input.addEventListener("keydown",e=>{
 if(e.key==="ArrowUp"){
   if(cmdHistory.length){historyIndex=Math.max(0,historyIndex-1);input.value=cmdHistory[historyIndex]||""}
   e.preventDefault();
 }else if(e.key==="ArrowDown"){
   if(cmdHistory.length){historyIndex=Math.min(cmdHistory.length,historyIndex+1);input.value=cmdHistory[historyIndex]||""}
   e.preventDefault();
 }else if(e.key==="Tab"){
   e.preventDefault();
   const val=input.value.toLowerCase();
   if(!val)return;
   const matches=Object.keys(commands).filter(c=>c.startsWith(val));
   if(matches.length===1)input.value=matches[0];
   else if(matches.length>1)printTerminal(matches.join("&nbsp;&nbsp;"));
 }
});
$("#clearTerminal").addEventListener("click",()=>out.innerHTML='<div>Terminal cleared. Type <span class="terminal-accent">help</span>.</div>');

// secret
$("#secretButton").addEventListener("click",()=>openModal("SYSTEM STATUS","EASTER EGG","You found the boring-looking button.",`<div class="modal-list"><div><span>CORE</span><span class="success">ONLINE</span></div><div><span>MOOD</span><span>OVERCLOCKED</span></div><div><span>SECRET LEVEL</span><span>UNLOCKED</span></div></div>`));

// Konami code
let konami=[];const code=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
document.addEventListener("keydown",e=>{konami.push(e.key);konami=konami.slice(-code.length);if(konami.join("|")===code.join("|")){document.body.classList.toggle("matrix-mode");openModal("SECRET MODE","EASTER EGG","Konami code accepted.",`<div class="modal-list"><div><span>MODE</span><span class="success">UNLOCKED</span></div><div><span>STATUS</span><span>YOU FOUND IT</span></div></div>`)}});