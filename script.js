let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput=document.getElementById("taskInput");
const taskDesc=document.getElementById("taskDesc");
const addBtn=document.getElementById("addTaskBtn");
const priority=document.getElementById("priority");

const columns=document.querySelectorAll(".column");

const sidebar=document.getElementById("sideDashboard");
const menuBtn=document.getElementById("menuBtn");

const search=document.getElementById("search");

const darkToggle=document.getElementById("darkToggle");
let touchTask = null;

function handleTouchStart(e){
  touchTask = e.currentTarget;
  touchTask.classList.add("dragging");
}

function handleTouchMove(e){
  e.preventDefault();
}

function handleTouchEnd(e){

  if(!touchTask) return;

  const touch = e.changedTouches[0];

  const dropTarget = document.elementFromPoint(
    touch.clientX,
    touch.clientY
  );

  const column = dropTarget?.closest(".column");

  if(column){
    column.appendChild(touchTask);

    const index = touchTask.dataset.index;

    if(index !== undefined){
      tasks[index].status = column.id;
    }

    saveTasks();
    render();
  }

  touchTask.classList.remove("dragging");
  touchTask = null;
}


menuBtn.onclick=()=>sidebar.classList.toggle("open");

darkToggle.onclick=()=>document.body.classList.toggle("dark");

addBtn.onclick=addTask;



function addTask(){

if(!taskInput.value.trim()) return;

const task={
text:taskInput.value,
description:taskDesc.value,
priority:priority.value,
status:"todo"
};

tasks.push(task);

saveTasks();

taskInput.value="";
taskDesc.value="";

render();
}


function saveTasks(){
localStorage.setItem("tasks",JSON.stringify(tasks));
}



function render(){

columns.forEach(col=>{

const title=col.querySelector("h2").innerText;

col.innerHTML=`<h2>${title}</h2>`;

});


tasks.forEach((task,i)=>{

const div=document.createElement("div");
;

div.className=`task ${task.priority}`;

div.draggable=true;
div.dataset.index = i;
div.innerHTML=`
div.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("touchstart", e => e.stopPropagation());
  });

  div.querySelectorAll("button").forEach(btn=>{
  btn.addEventListener("click", e => e.stopPropagation());
});

<div class="taskContent">
<span>${task.text}</span>
<span class="task-desc">${task.description}</span>
</div>

<div class="taskActions">
<button class="editBtn" onclick="editTask(${i})">✎</button>
<button class="deleteBtn" onclick="deleteTask(${i})">🗑</button>
</div>
`;

div.addEventListener("dragstart",()=>div.classList.add("dragging"));
div.addEventListener("dragend",()=>div.classList.remove("dragging"));
  
div.addEventListener("touchstart", handleTouchStart);
div.addEventListener("touchmove", handleTouchMove);
div.addEventListener("touchend", handleTouchEnd);

document.getElementById(task.status).appendChild(div);

});


updateCharts();
}



window.deleteTask=i=>{

tasks.splice(i,1);

saveTasks();

render();

};



window.editTask=i=>{

const newText=prompt("Edit Task",tasks[i].text);

if(newText){
tasks[i].text=newText;
saveTasks();
render();
}

};




columns.forEach(col=>{

col.addEventListener("dragover",e=>{
e.preventDefault();

const dragging=document.querySelector(".dragging");

if(!dragging) return;

col.appendChild(dragging);

});


col.addEventListener("drop",()=>{

const dragging=document.querySelector(".dragging");

if(!dragging) return;

const index = dragging.dataset.index;

if(index !== undefined){
tasks[index].status = col.id;
}

saveTasks();

render();

});

});



search.addEventListener("keyup",()=>{

const val=search.value.toLowerCase();

document.querySelectorAll(".task").forEach(task=>{

task.style.display=task.innerText.toLowerCase().includes(val)?"flex":"none";

});

});



function updateCharts(){

const todo = tasks.filter(t => t.status === "todo").length;
const progress = tasks.filter(t => t.status === "progress").length;
const done = tasks.filter(t => t.status === "done").length;

const ctx=document.getElementById("taskChart");

if(window.statusChart) window.statusChart.destroy();

window.statusChart=new Chart(ctx,{
type:"doughnut",
data:{
labels:["To-Do","In Progress","Done"],
datasets:[{
data:[todo,progress,done],
backgroundColor:["#CDB4DB","#FFC8DD","#BDE0FE"]
}]
}
});


const low = tasks.filter(t => t.priority === "low").length;
const medium = tasks.filter(t => t.priority === "medium").length;
const high = tasks.filter(t => t.priority === "high").length;

const ctxPriority = document.getElementById("priorityChart").getContext("2d");

if (window.priorityChart && typeof window.priorityChart.destroy === "function") {
  window.priorityChart.destroy();
}

window.priorityChart = new Chart(ctxPriority, {
  type: "doughnut",
  data: {
    labels: ["Low", "Medium", "High"],
    datasets: [{
      data: [low, medium, high],
      backgroundColor: [
        "#b8f2c2",
        "#fff3a6",
        "#ffb3b3"
      ]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  } 
}); }

render();
document.addEventListener("click", function(e) {

  const sidebar = document.getElementById("sideDashboard");
  const menuBtn = document.getElementById("menuBtn");

  // If click is NOT inside sidebar and NOT on menu button
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      sidebar.classList.remove("open");
  }


});



