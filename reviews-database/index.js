const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

//middleware
app.use(cors());
app.use(express.json());


// ROUTES //
// create a reviews table if it does not exist yet
pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
        review_id SERIAL PRIMARY KEY,
        username VARCHAR(255),
        location_name VARCHAR(255),
        rating INT,
        description VARCHAR(1024)
    )
`, (err, result) => {
    if (err) {
        console.error('Error creating reviews table:', err.message);
    } else {
        console.log('Reviews table created successfully');
    }
});

// create a review
app.post('/reviews', async (req, res) => {
    try {
        // Destructuring to extract all the needed fields from req.body
        const { username, location_name, rating, description } = req.body;

        // Adjusting the INSERT statement to include the new fields
        const newReview = await pool.query(
            "INSERT INTO reviews (username, location_name, rating, description) VALUES($1, $2, $3, $4) RETURNING *",
            [username, location_name, rating, description] // Passing the values as an array
        );

        //debug statement
        //console.log(req.body);

        // Sending the inserted review back as a response
        res.json(newReview.rows[0]);
        console.log("New review added:")
        console.log(newReview.rows[0]);

    } catch (err) {
        console.error(err.message);
    }
});

// get all reviews for specific location
app.get('/reviews/:location_name', async (req, res) => {
    try {
        const { location_name } = req.params;

        const ReviewsForLocation = await pool.query("SELECT * FROM reviews WHERE location_name = $1", [location_name]);
        
        res.json(ReviewsForLocation.rows);

        //console.log(ReviewsForLocation.rows);

    } catch (err) {
        console.error(err.message);
    }
});



// get average rating of all reviews for specific location
app.get('/reviews/:location_name/average', async (req, res) => {
    try {
        const { location_name } = req.params;

        const avgRating = await pool.query("SELECT AVG(rating) as average_rating FROM reviews WHERE location_name = $1", [location_name]);
        
        res.json({ average_rating: parseFloat(avgRating.rows[0].average_rating) });

        //debug statement
        //console.log(avgRating.rows[0].average_rating);

    } catch (err) {
        console.error(err.message);
    }
});


// get all reviews

app.get('/reviews', async (req, res) => {
    try{
        const allReviews = await pool.query("SELECT * FROM reviews");
        res.json(allReviews.rows);
    }
    catch (err) {
        console.error(err.message);
    }
});

//get a review by the username

app.get('/reviews/:username', async (req, res) => {
    try {

        //debug message
        // console.log(req.params);

        const { username } = req.params;
        const review = await pool.query("SELECT * FROM reviews WHERE username = $1", [username]);
        res.json(review.rows);

    } catch (err) {
        console.error(err.message);
    }

});





// update a review - by user id and location name

app.put('/reviews/:username/:location_name', async (req, res) => {
    try {
        //what we pass in from params
        const { username, location_name } = req.params;

        //what we want to edit/update
        const { rating, description } = req.body;

        //URL is http://localhost:5000/reviews/3124/SMU for example

        const updateReview = await pool.query(
            "UPDATE reviews SET rating = $1, description = $2 WHERE username = $3 AND location_name = $4",
            [rating, description, username, location_name]
        );

        res.json("Review was updated");
        console.log("Review updated:")
        console.log(updateReview);

    }
    catch (err) {
        console.error(err.message);
    }

});


// delete a review - by user id and location name
app.delete('/reviews/:username/:location_name', async (req, res) => {
    try{
        const { user_id, location_name } = req.params;
        //URL is http://localhost:5000/reviews/3124/SMU for example
        
        const deleteReview = await pool.query("DELETE FROM reviews WHERE username = $1 AND location_name = $2", [user_id, location_name]);
        
        res.json("Review was deleted");
        console.log("Review deleted:")
        console.log(deleteReview);
    
    }
    catch (err) {
        console.error(err.message);
    }

});





app.listen(3003, () => {
    console.log('Server is running on port 3003, updating');
});

