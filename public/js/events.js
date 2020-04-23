const loader = `<div id="loader" style="width: 100%; display: flex; justify-content: center;">
                <div class="spinner-border text-secondary" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                </div>`;


let events;

async function getEvents(){
    let event_promise;
    try{
        event_promise = await fetch("/api/events");
    }catch(err){
        throw new Error(err);
    }
    return event_promise;
}

function displayEvents(res, section){
    section.innerHTML = "";
    
    if(res.status === 404){
        section.innerHTML = `<h4>${res.msg}</h4>`;
        return;        
    }

    let count = 0;

    res.map(event => {
        let event_card = getEventCard(event);
        if(event_card !== undefined){
            ++count;
            section.innerHTML += event_card;
        }
    });

    if(count == 0){
        section.innerHTML = "<h3>No upcoming events found!</h3>";
    }
}

function getEventCard({summary, description, location, creator, created, start, end}){
    let end_date, start_date, created_date, created_time;
    
    if(start.date !== undefined && end.date !== undefined){
        start_date = Date.parse(start.date);
        end_date = Date.parse(end.date);
    }else{
        start_date = Date.parse(start.dateTime);
        end_date = Date.parse(end.dateTime);
    } 
    if(end_date - Date.now() < 0)
        return;

    let instance = new Date(Date.parse(created));
    created_date = `${instance.getMonth()+1}-${instance.getDate()}-${instance.getFullYear()}`;

    let template = `<div style="padding:20px 40px; background-color:aliceblue; margin-bottom:10px;">
                    <h4 style="margin: 0px;">${summary}</h4>
                    <small>${created_date}</small>
                    <br>
                    <small>Created by ${creator.email}</small>
                    <br><br>
                    `;
                
    if(description === undefined)    
        template += `<p><i>No description</i></p>`;
    else
        template += `<p>${description}</p>`;

    template += `</div>`;

    return template;
}

window.onload = function() {
    const event_section = this.document.getElementById('events');
    event_section.innerHTML = loader;
    
    const event_promise = getEvents();
    event_promise
    .then(res => res.json())
    .then(res => {
        events = res;
        displayEvents(res, event_section);
    })
    .catch(err => {
        event_section.innerHTML = '<p>Something went wrong, refresh browser tab to try again!</p>';
    });
}