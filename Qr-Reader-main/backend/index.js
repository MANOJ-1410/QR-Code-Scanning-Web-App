const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg')
require("dotenv").config();
const cors = require('cors')
const jwt = require('jsonwebtoken');


const app = express();
const port = process.env.PORT || 6000;
app.use(express.json());


const corsOptions = {
    origin: ["https://qr-reader-frontend.vercel.app", "http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  };

app.use(cors(null , corsOptions))


const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})




app.get('/', (req, res) => {
    res.send("QR Code Api");
  });

// Sign up a new user
app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const emailCheckQuery = 'SELECT * FROM users WHERE email = $1';
        const emailCheckResult = await pool.query(emailCheckQuery, [email]);

        if (emailCheckResult.rows.length > 0) {
            return res.status(409).send('Email already exists');
        }

        const hashed_password = await bcrypt.hash(password, 10);

        const insertQuery = 'INSERT INTO users (name, email, hashed_password) VALUES ($1, $2, $3) RETURNING id,name';
        const values = [name, email, hashed_password];
        const result = await pool.query(insertQuery, values);
     
        res.json({ id: result.rows[0].id, name: result.rows[0].name});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});


// Login with existing user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);

        if (result.rows.length === 0) {
            return res.status(401).send('User not found');
        }

        const user = result.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);

        if (passwordMatch) {
            // Generate a JWT token
            const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET);

            res.json({ message: 'Login successful', token }); // Send the token in the response
        } else {
            res.status(401).send('Incorrect password');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
});



// Create a QR code
app.post('/qrcodes', async (req, res) => {
    try {
        const { user_id, data } = req.body;

        const insertQRCodeQuery = 'INSERT INTO qr_data (user_id, data) VALUES ($1, $2) RETURNING id';
        const values = [user_id, data];
        console.log('SQL Query:', insertQRCodeQuery);
console.log('Data Values:', values);

        const result = await pool.query(insertQRCodeQuery, values);
        res.json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating QR code');
    }
});


// Fetch all QR codes related to a user
app.get('/qrcodes/:user_id', async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const page = parseInt(req.query.page);
      const perPage = parseInt(req.query.perPage);
      const offset = (page - 1) * perPage;
  
      // Modify the SQL query to use LIMIT and OFFSET for pagination
      const query = 'SELECT * FROM qr_data WHERE user_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3';
      const result = await pool.query(query, [user_id, perPage, offset]);
  
      // Calculate total pages by counting all QR codes for the user
      const countQuery = 'SELECT COUNT(*) FROM qr_data WHERE user_id = $1';
      const countResult = await pool.query(countQuery, [user_id]);
      const totalCount = countResult.rows[0].count;
      const totalPages = Math.ceil(totalCount / perPage);
  
      res.json({ qrCodes: result.rows, totalPages });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching QR codes');
    }
  });
  
  

// Delete a QR code entry
app.delete('/qrcodes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleteQuery = 'DELETE FROM qr_data WHERE id = $1';
        const result = await pool.query(deleteQuery, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('QR code not found');
        }

        res.send('QR code deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting QR code');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
