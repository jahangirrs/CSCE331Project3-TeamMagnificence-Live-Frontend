const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const path = require('path');

// Create express app
const app = express();
const port = 3000;


// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const data = {name: 'Mario'};
    res.render('index', data);
});

app.get('/customer', (req, res) => {
    menu = []
    pool
        .query('SELECT item_name as name FROM menu;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu.push(query_res.rows[i]);
            }
            const data = {menu: menu};
            console.log(menu);
            res.render('customer', data);
        });

});


app.get('/manager', (req, res) => {
    employees = []
    
    pool
        .query('SELECT * FROM employees;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                employees.push(query_res.rows[i]);
            }
            const data = {employees: employees};
            console.log(employees);
            res.json(employees);
        //    res.render('manager', data);
        });
    
        
});

app.get("/api", (req, res) => {
    res.json({message: "I am sending data from backend"});
    console.log("API request received");
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

    //     order = []
    // orderPrice = []

    // function addToOrder(menuItem){

    //     order.push(menuItem);

    //     orderPrice += menuItem.basecost;

    //     console.log(order);
    //     console.log(orderPrice);


    // }
        