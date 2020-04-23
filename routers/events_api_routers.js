const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET || 'secret';

const CALENDER_EVENTS_ROUTE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

router.get('/', function(req, res){
    if(!req.cookies.jwt)
        return res.json(400 ,{ error: { msg: 'Please authenticate with google and try again!' } });

    const TOKEN = jwt.verify(req.cookies.jwt, jwt_secret);
    const ACCESS_TOKEN = TOKEN.access_token;
    
    fetch(CALENDER_EVENTS_ROUTE, {
        headers: { 'Authorization' : `Bearer ${ACCESS_TOKEN}` }
    })
    .then(res => res.json())
    .then(events => {
        if(events.items.length > 0)
            return res.json(events.items);

        return res.status(404).json({msg: 'No events found'});
    })
    .catch(err => console.log(err));
});

router.post('/', function(req, res){
    if(!req.cookies.jwt)
        return res.json(400 ,{ error: { msg: 'Please authenticate with google and try again!' } });

    const TOKEN = jwt.verify(req.cookies.jwt, jwt_secret);
    const ACCESS_TOKEN = TOKEN.access_token;
    const json_event_data = req.body; 

    fetch(CALENDER_EVENTS_ROUTE, {
        method:'POST',
        headers: { 
            'Authorization' : `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(json_event_data)
    }).then(response => {
        if(response.status === 200)
            return res.json();
        else
            return res.status(400).json({msg: 'Something went wrong, please try again!'});           
    })
    .then(response => res.json({msg: "Event created successfully!"})) 
    .catch(err => console.log(err));
});

module.exports = router;