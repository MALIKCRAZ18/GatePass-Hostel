const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000'
}))
// MySQL Connection Setup
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pammu10Pammu@10',
    database: 'hod_leave', 
    port: 3306,
    multipleStatements: true
});
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Post Route to handle form submission
app.get('/leave-history', (req, res) => {
    try {
        const reg = "REG123";
        const query = "SELECT * FROM leave_requests WHERE studentID = ?";
        
        db.query(query, [reg], (err, result) => {
            if (err) {
                console.error("Database Query Error:", err);
                res.status(500).json({ message: "Internal Server Error" });
            } else {
                if (result.length > 0) {
                    console.log(result);
                    res.json(result);
                } else {
                    res.status(404).json({ message: "Data not found" });
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get('/leave-status', (req, res) => {
    try {
        const reg = "REG123";
        const query = "SELECT * FROM leave_requests WHERE studentID = ?";
        
        db.query(query, [reg], (err, result) => {
            if (err) {
                console.error("Database Query Error:", err);
                res.status(500).json({ message: "Internal Server Error" });
            } else {
                if (result.length > 0) {
                    console.log(result);
                    res.json(result[0]);
                } else {
                    res.status(404).json({ message: "Data not found" });
                }
            }
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// app.get('/leave-data/query', (req, res) => {
//     const reg = req.query.reg
//     const data = leaveData.find(item => item.reg === reg);
//     if (data){
//         res.json(data);
//     }
//     db.query(query, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

app.post('/submit-leave', (req, res) => {
    try{
        console.log(req.body);
    const { Ltype, Visit, fdate, tform, tdate, tto, reason } = req.body;
    const regno = "REG123";
    const query = 'INSERT INTO leave_requests (leave_type, visiting_place, from_date, from_time, to_date, to_time, reason, studentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [Ltype, Visit, fdate, tform, tdate, tto, reason, regno], (err, result) => {
        if (err) throw err;
        res.send('Leave application submitted successfully');
    });
    }
    catch(err){
        console.log(err);
    }
    
});


// HOD PAGES

app.get("/pending-leaves", (req, res) => {
    const query = "SELECT * FROM leave_requests WHERE status = 'pending'";
    db.query(query, (err, result) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(result);
    });
});

app.post("/update-leave-status", (req, res) => {
    const { id, status } = req.body; // ID of leave request & new status
    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    const query = "UPDATE leave_requests SET status = ? WHERE id = ?";
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error("Database Update Error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json({ message: `Leave request ${status} successfully` });
    });
});


// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
