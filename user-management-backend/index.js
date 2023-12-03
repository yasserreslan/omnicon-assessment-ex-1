const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./database');
const cors = require('cors');
const fs = require('fs');


const app = express();
app.use(cors());
app.use(bodyParser.json());


// Get all users
app.get('/users', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT * FROM users');
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
    
});


// Add a new user
app.post('/users', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
    
});

// Update a user
/* Update the user based on the fields thatt are passed in the request */

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        // Initialize parts of the query
        let query = 'UPDATE users SET ';
        let fields = [];
        let params = [];

        // Add fields to the query dynamically based on the request body
        if (username) {
            fields.push('username = $' + (fields.length + 1));
            params.push(username);
        }

        if (email) {
            fields.push('email = $' + (fields.length + 1));
            params.push(email);
        }


        // Join the fields to complete the query
        query += fields.join(', ');
        query += ' WHERE id = $' + (fields.length + 1) + ' RETURNING *';

        // Add the user ID to the parameters
        params.push(id);

        // Execute the query
        const updateUser = await pool.query(query, params);
        res.json(updateUser.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
    
});


// Delete a user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json('User was deleted');
    } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
}

});

app.listen(3001, () => {
    console.log('Server has started on port 3001');
});

