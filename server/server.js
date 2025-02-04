const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const cors = require('cors');
const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000'
}))
// MySQL Connection Setup
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pammu10Pammu@10',
    database: 'hod_leave', 
    port: 3306
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Post Route to handle form submission
app.get('/leave-data', (req, res) => {
    
    const query = 'SELECT * FROM leave_requests where status = "pending"';
    
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


app.post('/submit-leave', (req, res) => {
    const { Ltpye, Visit, fdate, tform, tdate, tto, reason } = req.body;

    const query = 'INSERT INTO leave_requests (leave_type, visiting_place, from_date, from_time, to_date, to_time, reason) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [Ltpye, Visit, fdate, tform, tdate, tto, reason], (err, result) => {
        if (err) throw err;
        res.send('Leave application submitted successfully');
    });
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
