
const DB_KEY='localTickets';
const toolboxPriorityContainer=document.querySelector(".toolbox-prority");
const addBtn=document.querySelector(".add-btn");
const deleteBtn=document.querySelector(".remove-btn");
const modal=document.querySelector(".modal-cont");
const modalCloseBtn=modal.querySelector(".modal-close");
const textArea=modal.querySelector(".textarea-cont");
const prioritySetModal=modal.querySelector(".priority-color-cont");
const priorityColorArray=prioritySetModal.querySelectorAll(".priority-color");

const pendingContainer=document.querySelector(".pending-cont");
const finishedContainer=document.querySelector(".finished-cont");
const containers=document.querySelectorAll(".container");

let  allTicketList=[];

window.addEventListener("load",function(){
    populateUi();
    // console.log(allTicketList);
});

toolboxPriorityContainer.addEventListener("click",function(e){
    if(e.target===e.currentTarget){
        return;
    }
    const currentElement=e.target;
    const clickedColor=currentElement.classList[1];
    const ticketArray=document.querySelectorAll(".ticket-cont");
    for(let i=0;i<ticketArray.length;i++){
        const ticketColorElem=ticketArray[i].querySelector(".ticket-color");
        const ticketColor=ticketColorElem.classList[1];
        if(ticketColor!=clickedColor){
            ticketArray[i].style.display="none";
        }
        else{
            ticketArray[i].style.display="block";
        }
    }
});

toolboxPriorityContainer.addEventListener("dblclick",function(e){
    const ticketArray=document.querySelectorAll(".ticket-cont");
    for(let i=0;i<ticketArray.length;i++){
        ticketArray[i].style.display="block";
    }
});


addBtn.addEventListener("click",()=>{
    textArea.value="";
    clearSelectedColor();
    modal.style.display="flex";
});

deleteBtn.addEventListener("click",function(e){
    e.target.classList.toggle("red");
});

modalCloseBtn.addEventListener("click",closeModal);


prioritySetModal.addEventListener("click",(e)=>{
    if(e.target===e.currentTarget){
        return;
    }
    clearSelectedColor();
    e.target.classList.add("active"); 
});

function clearSelectedColor(){
    for(let i=0;i<priorityColorArray.length;i++){
        priorityColorArray[i].classList.remove("active");
    }
}

function closeModal(){
    modal.style.display="none";
}

modal.addEventListener("keypress",(e)=>{
    if(e.key!=="Enter"){
        return;
    }
    const content=textArea.value;
    // console.log(content);
    const activeColorElement=prioritySetModal.querySelector(".active");
    if(!activeColorElement){
        alert("please select a color");
    }
    const cColor=activeColorElement.classList[1];
    const { randomUUID } = new ShortUniqueId({ length: 7 });
    const id=randomUUID();
    console.log(id);
    createNewTicket(content,cColor,id,true,true);
    closeModal();
});


function createNewTicket(content,cColor,id,isPending,saveToDb=false){
    
    if(isPending===true){
        const ticketDom=getTicketDom(id,content,cColor);
        pendingContainer.appendChild(ticketDom);
    }
    if(saveToDb){
        saveTicketsToDB(content,cColor,id,isPending);
    }
    
}

function saveTicketsToDB(content,cColor,id,isPending){
    // to save on local machine
    const ticketObj={
        id: id,
        content: content,
        color: cColor,
        isPending: isPending
    }
    allTicketList.push(ticketObj);
    saveTicketsList(allTicketList);
}

function populateUi(){
    allTicketList=getTicketsList();
    //lines to handle bug
    if(allTicketList===null){
        allTicketList=[];
        return;
    }
    // console.log(allTicketList);
    for(let i=0;i<allTicketList.length;i++){
        const currentTicket=allTicketList[i];
        // console.log(currentTicket.color);
        const ticketDom=getTicketDom(
            currentTicket.id,
            currentTicket.content,
            currentTicket.color
        );
        if(currentTicket.isPending){
            renderPendingTickets(ticketDom);
        }
        else{
            renderFinishedTickets(ticketDom);
        }
    }
}

function getTicketDom(id,content, cColor){
    const ticketContainer=document.createElement("div");
    ticketContainer.setAttribute("class","ticket-cont");
    ticketContainer.setAttribute("draggable",true);
    ticketContainer.innerHTML=`
        <div class="ticket-color ${cColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="ticket-area">${content}</div>
        <div class="lock-unlock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `;
    ticketContainer.querySelector(".ticket-area").setAttribute("contenteditable",true);
    attachListnersOnATicket(ticketContainer);
    return ticketContainer;
}

function attachListnersOnATicket(ticketContainer){
    ticketContainer.addEventListener("click",function(e){
        const isDeleteActivated=deleteBtn.children[0].classList.contains("red");
        if(isDeleteActivated){
            const ticketId=e.currentTarget.querySelector(".ticket-id").textContent.trim();
            e.currentTarget.remove();   
            deleteTicket(ticketId);
        }
    });
}

function deleteTicket(ticketId){
    allTicketList=allTicketList.filter((ticket)=>{
        return ticketId !== ticket.id;
    });
    saveTicketsList(allTicketList);
}

function renderPendingTickets(pendingTicketDom){
    pendingContainer.appendChild(pendingTicketDom);
}

function renderFinishedTickets(finishedTicketsDom){
    finishedContainer.appendChild(finishedTicketsDom);
}

function saveTicketsList(taskList){
    localStorage.setItem(DB_KEY, JSON.stringify(taskList));
}

function getTicketsList(){
    return JSON.parse(localStorage.getItem(DB_KEY));
}