function escape_event_data(event_obj){
    let {summary, description, location, attendees, start, end} = event_obj;

    event_obj.summary = escape(summary);
    event_obj.description = escape(description);
    event_obj.location = escape(location);
    event_obj.start.dateTime = escape(start.dateTime);
    event_obj.end.dateTime = escape(end.dateTime);
    event_obj.attendees = attendees.map(attendee => {
        attendee.email = escape(attendee.email);
        return attendee;
    })

    return event_obj;
}