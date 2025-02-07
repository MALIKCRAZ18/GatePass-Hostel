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
    port: 3306
});
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Post Route to handle form submission
app.get('/leave-data', async (req, res) => {
    try{
         await mysql2.connect(db);
         const result = await mysql2.query`SELECT * FROM leaveData WHERE studentID = ${reg}`;
    
         if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
          } else {
            res.status(404).json({ message: 'Data not found' });
          }
    }
    catch(err){
        console.log(err);
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
    console.log(req.body);
    const { Ltype, Visit, fdate, tform, tdate, tto, reason } = req.body;

    const query = 'INSERT INTO leave_requests (leave_type, visiting_place, from_date, from_time, to_date, to_time, reason) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [Ltype, Visit, fdate, tform, tdate, tto, reason], (err, result) => {
        if (err) throw err;
        res.send('Leave application submitted successfully');
    });
});

// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
