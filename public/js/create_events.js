function getDates(duration_str){
    let dates = duration_str.split('-');
    dates = 
        dates.map(date_str => new Date(date_str.trim()).toISOString());

    console.log(dates);

    return dates;
}

function getEventObj(summary, attendees, duration, location, description){
    const dates = getDates(duration);
    let attendees_list = attendees.split(',');
    attendees_list = attendees_list.map(email => {
        return {email: email.trim()}
    });

    const event_obj = {
        summary,
        location,
        description,
        start: { 
            dateTime: dates[0], 
        },
        end: {
            dateTime: dates[1],
        },
        attendees: attendees_list,
        reminders: {
            useDefault: false,
            overrides: [
                {method: 'email', minutes: 24 * 60},
                {method: 'popup', 'minutes': 10},
            ],
        },
    };


    return event_obj;
}

window.onload = function(){
    $('#duration').daterangepicker({
        "timePicker": true,
        "autoApply": true,
        "startDate": Date.now(),
        "endDate": Date.now(),
        locale: {
            format: 'M/DD/YYYY hh:mm:ss A'
        }
    });

    document.getElementById('event_form')
        .addEventListener('submit', function(){

            $('#submit_btn').prop('disabled', true);
            $('#loader').css('display', 'inline-block');

            const summary = $('#summary').val();
            const attendees = $('#attendees').val();
            const duration = $('#duration').val();
            const location = $('#location').val();
            const description = $('#description').val();

            let event_obj = getEventObj(summary, attendees, duration, location, description);
            
            fetch('/api/events', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event_obj)
            })
            .then(res => {
                if(res.status === 200)
                    window.location.href ='/dashboard';

                else{
                    $('#submit_btn').prop('disabled', false);
                    $('#loader').css('display', 'none');  
                }
            })
            .catch(err => console.log(err));         
        });
}