import { useState } from 'react'
import './App.css'
import React from 'react'

//URL variable, change depending on local testing or Live push
let BackendURL = "https://csce331project3-teammagnificence-live.onrender.com/";

//Fetch and Build employee Table
function EmployeeView(){
  const [employees, setEmployees] = useState("");

  //API call to backend for employee data
  React.useEffect(() => {
    fetch(BackendURL + "manager/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data)
      
    )
    .catch(e => console.log(e))
  }, []);

    var employeeData = JSON.parse(JSON.stringify(employees));
    let rows = new Array();
   for(var i in employeeData){
      rows.push([employeeData[i].id, employeeData[i].name, employeeData[i].clockedin.toString(),
      employeeData[i].clockintime, employeeData[i].clockouttime, 
      employeeData[i].manager.toString(), employeeData[i].pto]);
   }


  return (
    <>
      <h1>Employees</h1>

        <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Clocked In</th>
                <th>Clock In Time</th>
                <th>Clock Out Time</th>
                <th>Manager</th>
                <th>PTO</th>
              </tr>
            </thead>
            <tbody>
              {rows.map( (row:any) => 
                  <tr key = {row}>{
                    row.map( (data:any) => 
                  
                      <td key = {data+Math.random()}>{data}</td>
                  
                    )
                    
                  }</tr>
                
              )}
            </tbody>
      
        </table>

    </>
    
  )
}

//Fetch and build inventory table
function InventoryView(){
  const [inventory, setInventory] = useState("");

  //API call to backend for inventory data
  React.useEffect(() => {
    fetch(BackendURL + "manager/inventory")
    .then((res) => res.json())
    .then((data) => setInventory(data))
    .catch(e => console.log(e))
  }, []);

  var inventoryData = JSON.parse(JSON.stringify(inventory));
  let rows = new Array();
  for(var i in inventoryData){
    rows.push([inventoryData[i].id, inventoryData[i].name, inventoryData[i].unitsize, 
      inventoryData[i].stocknum.toFixed(2), inventoryData[i].stockpercent.toFixed(2), 
      inventoryData[i].idealstock, inventoryData[i].itemprice, 
      inventoryData[i].supplier, inventoryData[i].islow.toString()]);
  }

  return(
    <>
      <h1>Inventory</h1>
    
      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Size</th>
            <th>Stock Num</th>
            <th>Stock Percent</th>
            <th>Ideal Stock</th>
            <th>Item Price</th>
            <th>Supplier</th>
            <th>Low</th>
          </tr>
        </thead>
        <tbody>
          {rows.map( (row:any) =>
            <tr key = {row}>{
              row.map( (data:any) =>
              
                <td key = {data + Math.random()}>{data}</td>
              
              )

            }</tr>
          
          )}
        </tbody>

      </table>
    
    
    
    </>


  );
}

//Fetch and build Menu table
function MenuView(){
  const [menu, setMenu] = useState("");

  //API call to backend for menu data
  React.useEffect(() => {
    fetch(BackendURL + "manager/menu")
    .then((res) => res.json())
    .then((data) => setMenu(data))
    .catch(e => console.log(e))
  }, []);

  var menuData = JSON.parse(JSON.stringify(menu));
  let rows = new Array();
  for(var i in menuData){
    rows.push([menuData[i].id, menuData[i].item_name, menuData[i].base_cost, 
      menuData[i].item_group]);
  }

  return(
    <>
      <h1>Menu</h1>
    
      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Cost</th>
            <th>Group</th>
          </tr>
        </thead>
        <tbody>
          {rows.map( (row:any) =>
            <tr key = {row}>{
              row.map( (data:any) =>
                
                <td key = {data + Math.random()}>{data}</td>
              )
            }</tr>

          )}
        </tbody>
      </table>
    
    </>
  );
}

//Fetch and build hourly sales table
function HourlySalesView(){
  const [hourlySales, setHourlySales] = useState("");

  //API call to backend for sales data
  React.useEffect(() => {
    fetch(BackendURL + "manager/hourlySales")
    .then((res) => res.json())
    .then((data) => setHourlySales(data))
    .catch(e => console.log(e))
  }, []);

  var hourlySalesData = JSON.parse(JSON.stringify(hourlySales));
  let rows = new Array();
  for(var i in hourlySalesData){
    rows.push([hourlySalesData[i].sales, hourlySalesData[i].hour]);
  }

  return(

    <>
      <h1>Hourly Sales</h1>

      <table>

        <thead>
          <tr>
            <th>Sales</th>
            <th>Hour</th>
          </tr>
        </thead>
        <tbody>
          {rows.map( (row:any) =>
            <tr key = {row}>{
              row.map( (data:any) =>
              
                  <td key = {data + Math.random()}>{data}</td>
              )
              }</tr>
          )}
        </tbody>
      </table>
    
    </>

  );
}

//Fetch and build purchase orders table
function PurchaseOrderView(){
  const [purchaseOrders, setPurchaseOrders] = useState("");

  //API call to backend for purchase order data
  React.useEffect(() => {
    fetch(BackendURL + "manager/purchaseOrder")
    .then((res) => res.json())
    .then((data) => setPurchaseOrders(data))
    .catch(e => console.log(e))
  }, []);

  var purchaseOrdersData = JSON.parse(JSON.stringify(purchaseOrders));
  let rows = new Array();
  for(var i in purchaseOrdersData){
    rows.push([purchaseOrdersData[i].inventory_name,
      purchaseOrdersData[i].unitsize, purchaseOrdersData[i].supplier_name,
      purchaseOrdersData[i].order_date, purchaseOrdersData[i].quantity,
      purchaseOrdersData[i].cost_per_unit, purchaseOrdersData[i].total_cost,
      purchaseOrdersData[i].order_status, purchaseOrdersData[i].expected_arrival,
      purchaseOrdersData[i].received_date])
  }


  return(
    <>

      <h1>Purchase Orders</h1>

        <table>

          <thead>
            <tr>
              <th>Inventory Item</th>
              <th>Unit Size</th>
              <th>Supplier</th>
              <th>Order Date</th>
              <th>Amount</th>
              <th>Price per Unit</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Expected Arrival</th>
              <th>Received</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map( (row:any) =>
            
              <tr key = {row}>{
                row.map( (data:any) =>
                
                  <td key = {data + Math.random()}>{data}</td>
                )
                
              }</tr>
            
            )}
          </tbody>
        </table>

    </>

  );
}

function App() {
  //Tab display values
  const [displayEmployee, setDisplayEmployee] = useState(false);
  const [displayInventory, setDisplayInventory] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayHourlySales, setDisplayHourlySales] = useState(false);
  const [displayPurchaseOrders, setDisplayPurchaseOrders] = useState(false);

  //Hide all views
  function hideAll(){
    setDisplayEmployee(() => false);
    setDisplayInventory(() => false);
    setDisplayMenu(() => false);
    setDisplayHourlySales(() => false);
    setDisplayPurchaseOrders(() => false);
  }

  //Toggle view on button clicks
  function toggleEmployees(){
    hideAll();
    setDisplayEmployee((displayEmployee) => !displayEmployee);
  }

  function toggleInventory(){
    hideAll();
    setDisplayInventory((displayInventory) => !displayInventory);
  }

  function toggleMenu(){
    hideAll();
    setDisplayMenu((displayMenu) => !displayMenu);
  }

  function toggleHourlySales(){
    hideAll();
    setDisplayHourlySales((displayHourlySales) => !displayHourlySales);
  }

  function togglePurchaseOrders(){
    hideAll();
    setDisplayPurchaseOrders((displayPurchaseOrders) => !displayPurchaseOrders);
  }

  return (
    <>
      <div>
      <button onClick = {toggleEmployees}>Employees</button>
      <button onClick = {toggleInventory}>Inventory</button>
      <button onClick = {toggleMenu}>Menu</button>
      <button>Sales Data</button>
      <button onClick = {toggleHourlySales}>Hourly Sales</button>
      <button onClick = {togglePurchaseOrders}>Purchase Order</button>
      </div>
      {displayEmployee && <EmployeeView />}
      {displayInventory && <InventoryView />}
      {displayMenu && <MenuView />}
      {displayHourlySales && <HourlySalesView />}
      {displayPurchaseOrders && <PurchaseOrderView/>}
    </>
  )
}

export default App
