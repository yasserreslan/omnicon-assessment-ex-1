const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./database');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');

const { generateToken, authenticateToken } = require('./JwtUtils');

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());



/*
   /register endpoint:
   - Checks for an existing valid JWT to authorize the registration.
   - Validates input for username and password.
   - Checks if the username already exists in the database.
   - If it exists, returns an error.
   - If it doesn't, hashes the password and adds the new admin user to the database.

*/

// app.post('/register', authenticateToken, async (req, res) => {
//     try {

//         // Validate the input from request body
//         const { username, password } = req.body;

//         if (!username || !password) {
//             return res.status(400).json({ error: 'Username and password are required' });
//         }

//         // Check if the username already exists
//         const userExists = await pool.query('SELECT * FROM admin_user WHERE username = $1', [username]);
//         if (userExists.rows.length > 0) {
//             return res.status(400).json({ error: 'Username already exists' });
//         }

//         // Hash the password
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Insert the new admin user into the database
//         const newUser = await pool.query(
//             'INSERT INTO admin_user (username, password) VALUES ($1, $2) RETURNING *',
//             [username, hashedPassword]
//         );

//         res.sendStatus(201);
        

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });



// /*  login Endpoint:
//     - Accepts username and password.
//     - Queries the database for the username.
//     - If not found, returns 401 Unauthorized.
//     - If found, compares the provided password with the stored hashed password.
//     - If the password matches, generates and returns a JWT.
//     - If it doesn't match, returns 401 Unauthorized.
// */

// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await pool.query('SELECT * FROM admin_user WHERE username = $1', [username]);

//         if (user.rows.length > 0) {
//             const validPassword = await bcrypt.compare(password, user.rows[0].password);
//             if (!validPassword) return res.status(401).send('Invalid Credentials');

//             // const token = jwt.sign({ id: user.rows[0].id }, { key: fs.readFileSync('private.pem'), passphrase: 'yourPassphrase' }, { algorithm: 'RS256', expiresIn: '1h' });
//             const token = generateToken({ username: user.username });
//             res.json({ token });
//         } else {
//             res.status(401).send('Invalid Credentials');
//         }
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

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
    console.log(generateToken({username:"admin"}))
    console.log('Server has started on port 3001');
});

