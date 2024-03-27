const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());


// ROUTES //
// create an events table if it does not exist yet
pool.query(`
    CREATE TABLE IF NOT EXISTS events (
        event_id SERIAL PRIMARY KEY,
        host_username VARCHAR(255),
        name VARCHAR(255),
        location_name VARCHAR(255),
        datetime DATETIME,
        description VARCHAR(1024),
        capacity INT,
        headcount INT,
        participants VARCHAR(255)[] SET DEFAULT '{}'
    )
`, (err, result) => {
    if (err) {
        console.error('Error creating events table:', err.message);
    } else {
        console.log('Events table created successfully');
    }
});

// create an event
app.post('/events', async (req, res) => {
    try {
        // Destructuring to extract all the needed fields from req.body
        const { host_username, name, location_name, datetime, description, capacity, headcount } = req.body;

        // Adjusting the INSERT statement to include the new fields
        const newEvent = await pool.query(
            "INSERT INTO events (host_username, name, location_name, datetime, description, capacity, headcount) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [host_username, name, location_name, datetime, description, capacity, headcount] // Passing the values as an array
        );

        //debug statement
        //console.log(req.body);

        // Sending the inserted event back as a response
        res.json(newEvent.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

// get all events
app.get('/events', async (req, res) => {
    try {
        const Events = await pool.query("SELECT * FROM events");
        
        res.json(Events.rows);

        //console.log(Events.rows);

    } catch (err) {
        console.error(err.message);
    }
});


//get events by the host_username

app.get('/events/:host_username', async (req, res) => {
    try {

        //debug message
        // console.log(req.params);

        const { host_username } = req.params;
        const events = await pool.query("SELECT * FROM events WHERE host_username = $1", [host_username]);
        res.json(events.rows);

    } catch (err) {
        console.error(err.message);
    }

});





// update an event when user joins - by host_username and event name

app.put('/events/join/:host_username/:name', async (req, res) => {
    try {
        //what we pass in from params
        const { host_username, name } = req.params;

        //what we want to edit/update
        const { newParticipant } = req.body;

        //URL is http://localhost:5000/events/3124/SMU for example

        const updateEvent = await pool.query(
            "UPDATE events SET participants = array_append(participants, $1), headcount = headcount + 1 WHERE host_username = $2 AND name = $3",
            [newParticipant, host_username, name]
        );

        res.json("Event was updated");

    }
    catch (err) {
        console.error(err.message);
    }

});


// update an event when user quits - by host_username and event name

app.put('/events/quit/:host_username/:name', async (req, res) => {
    try {
        //what we pass in from params
        const { host_username, name } = req.params;

        //what we want to edit/update
        const { participant } = req.body;

        //URL is http://localhost:5000/events/3124/SMU for example

        const updateEvent = await pool.query(
            "UPDATE events SET participants = array_remove(participants, $1), headcount = headcount - 1 WHERE host_username = $2 AND name = $3",
            [participant, host_username, name]
        );

        res.json("Event was updated");

    }
    catch (err) {
        console.error(err.message);
    }

});


// delete an event - by host_username and event name
app.delete('/events/:host_username/:name', async (req, res) => {
    try{
        const { host_username, name } = req.params;
        //URL is http://localhost:5000/events/3124/SMU for example
        
        const deleteEvent = await pool.query("DELETE FROM events WHERE host_username = $1 AND name = $2", [host_username, name]);
        
        res.json("Event was deleted");
    
    }
    catch (err) {
        console.error(err.message);
    }

});





app.listen(3002, () => {
    console.log('Server is running on port 3002, updating');
});

