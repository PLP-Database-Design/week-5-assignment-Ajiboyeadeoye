// initialize dependencies

const express = require('express');
const app = express();

const mysql = require('mysql2');
const dotenv = require('dotenv');
//const cors = require('cors');

app.use(express.json());
//app.use(cors());
dotenv.config();


//connect to the database
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME

});
// check if the db connection works
db.connect((err) => {
    if (err) {
        console.log("Error connecting to mysql db")
    }else{
        console.log("connected to mysql successfully as id ", db.threadId)
    }

    // rendering templating engine
    app.set('view engine', 'ejs');
    app.set('views', __dirname + '/views');

    //routing to fetch patients data(1)
    app.get('/patients', (req, res) => {
        db.query('SELECT * FROM patients', (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error retrieving data')
            }else{
                res.render('patients', {results: results})
            }
        });
    });
    // Routing to fetch providers' details(2)
    app.get('/providers', (req, res) => {
        db.query('SELECT first_name, last_name, provider_specialty FROM providers', (err, results) => {
            if (err) {
                console.log(err);
                res.status(500).send('Error retrieving providers\' details')
            }else{
                res.render('providers', {results: results})
            }
        });
    });

// Routing to filter patients by first name(3)
app.get('/patients_by_name', (req, res) => {
    const { first_name } = req.query;
    db.query('SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?', [first_name], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving filtered patient data');
        } else {
            res.render('patients', {results: results});
        }
    });
});
// Routing to filter providers by specialty(4)
app.get('/providers_by_specialty', (req, res) => {
    const { provider_specialty } = req.query;
    //console.log(provider_specialty);
    db.query('SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?', [provider_specialty], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error retrieving filtered provider data');
        } else {
            res.render('providers', {results: results});
        }
    });
});



    // listen to the server
    const PORT = 3000
    app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`)
});


});






