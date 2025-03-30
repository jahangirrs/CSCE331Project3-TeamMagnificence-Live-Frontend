const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const path = require('path');
const { timeStamp } = require('console');

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


app.get('/manager/employees', (req, res) => {

    //get employee data from database
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
        });
    
    
        
});

app.get("/manager/inventory", (req, res) => {
    //get inventory data from backend
    inventory = []
    pool
        .query('SELECT * FROM inventory;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            console.log(inventory);
            res.json(inventory);
        });
});

app.get("/manager/menu", (req, res) => {
    //get menu data from backend
    menu = []
    pool
        .query('SELECT * FROM menu;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                menu.push(query_res.rows[i]);
            }
            const data = {menu: menu}; 
            console.log(menu);
            res.json(menu);
        });
});


app.get("/manager/hourlySales", (req, res) => {
    //get timestamp of last Zreport generated
    lastZReport = [];
    pool
        .query("SELECT * FROM zreportgenerated ORDER BY date DESC LIMIT 1;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                lastZReport.push(query_res.rows[i]);
            }
            const data = {lastZReport: lastZReport};
            console.log(lastZReport);
        });

    //get sales data from backend
    sales = []
    const now = new Date().getTime();
    pool
        .query(`SELECT SUM(total_cost) AS sales, EXTRACT(HOUR FROM date) 
            AS hour FROM orders WHERE date BETWEEN` + 
            "'" + lastZReport.toString() + "'" +  "AND" + 
            "'" +  now.toString() + "'" +
            `GROUP BY hour ORDER BY hour;`)
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                sales.push(query_res.rows[i]);
            }
            const data = {sales: sales};
            console.log(sales);
            res.json(sales);
        });
});

app.get("/manager/purchaseOrder", (req, res) => {
    //get menu data from backend
    purchaseOrders = []
    pool
        .query('SELECT * FROM purchaseorders;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                purchaseOrders.push(query_res.rows[i]);
            }
            const data = {purchaseOrders: purchaseOrders}; 
            console.log(purchaseOrders);
            res.json(purchaseOrders);
        });
});


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
        