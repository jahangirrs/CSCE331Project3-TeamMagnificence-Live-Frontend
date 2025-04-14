import { useState } from 'react'
import './Manager.css'
import React from 'react'

//URL variable, change depending on local testing or Live push
let BackendURL = "https://csce331project3-teammagnificence-live.onrender.com/";
//let BackendURL = "http://localhost:3000/";

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

  const employeeData = JSON.parse(JSON.stringify(employees));
  const rows = [];
   for(const i in employeeData){
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

  const inventoryData = JSON.parse(JSON.stringify(inventory));
  const rows = [];
  for(const i in inventoryData){
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

  const menuData = JSON.parse(JSON.stringify(menu));
  const rows = [];
  for(const i in menuData){
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

  const hourlySalesData = JSON.parse(JSON.stringify(hourlySales));
  const rows = [];
  for(const i in hourlySalesData){
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

  const purchaseOrdersData = JSON.parse(JSON.stringify(purchaseOrders));
  const rows = [];
  for(const i in purchaseOrdersData){
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
//Make API call to backend and get data
function useSalesReport(startDate:string, endDate:string, viewData:boolean){
  const [salesReport, setSalesReport] = useState("");
  //API call to backend for sales data
  React.useEffect(() => {
    fetch(BackendURL + "manager/salesData?" + "start=" + startDate + "&end=" + endDate)
        .then((res) => res.json())
        .then((data) => setSalesReport(data))
        .catch(e => console.log(e))
  }, [startDate, endDate, viewData]);


  const salesReportData = JSON.parse(JSON.stringify(salesReport));
  const rows = [];
  for(const i in salesReportData){
    rows.push([salesReportData[i].id, salesReportData[i].date, salesReportData[i].total_cost, salesReportData[i].member]);
  }

  return rows;
}


//Fetch report of orders between user inputted dates
function UserSalesReportView(){
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  const [viewReportData, setViewReportData] = useState(false);
  const rows = useSalesReport(startDate,endDate, viewReportData);


  //API call to backend for sales data between startDate and endDate, make call every time input is updated
  function inputHandler(start:string, end:string){
    if(start != "" && end != "") {
      setViewReportData(true);
    }

}

  return(
    <> 
      <h1>Sales Report</h1>

      <label htmlFor = {startDate}>Start Date:

        <input onChange = {e => { setStartDate(e.target.value); inputHandler(e.target.value, endDate); } } type = "date"></input>

      </label>

      <label htmlFor = {endDate}>End Date:
        <input onChange = {e => {setEndDate(e.target.value); inputHandler(startDate, e.target.value) } } type = "date"></input>
      </label>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Cost</th>
            <th>Member</th>
          </tr>
        </thead>
        {viewReportData && <tbody>
        {rows.map( (row:any) =>

            <tr key = {row}>{
              row.map( (data:any) =>

                  <td key = {data + Math.random()}>{data}</td>
              )

            }</tr>

        )}
        </tbody>}
      </table>
    
    </>


  );
}

function ZReportView() {
  const [zReportData, setZReportData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchZReport = async () => {
      try {
        const response = await fetch(BackendURL + "manager/zreport");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch Z-Report');
        }
        const data = await response.json();
        setZReportData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
    };

    fetchZReport();
  }, []);

  if (error) {
    return (
      <div className="zreport-container">
        <h1>Daily Z-Report</h1>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!zReportData) {
    return (
      <div className="zreport-container">
        <h1>Daily Z-Report</h1>
        <div>Loading report...</div>
      </div>
    );
  }

  return (
    <div className="zreport-container">
      <h1>Daily Z-Report</h1>
      <div className="zreport-item">
        <span className="zreport-label">Report Date:</span>
        <span>{zReportData.reportDate}</span>
      </div>
      <div className="zreport-item">
        <span className="zreport-label">Total Sales:</span>
        <span>${zReportData.totalSales.toFixed(2)} ({zReportData.salesCount} sales)</span>
      </div>
      <div className="zreport-item">
        <span className="zreport-label">Total Tax:</span>
        <span>${zReportData.totalTax.toFixed(2)}</span>
      </div>
      <div className="zreport-item">
        <span className="zreport-label">Best Menu Item:</span>
        <span>{zReportData.bestMenuItem} ({zReportData.bestMenuItemCount} sold)</span>
      </div>
      <div className="zreport-item">
        <span className="zreport-label">Low Stock Items:</span>
        <span>{zReportData.lowStockItems}</span>
      </div>
      <div className="zreport-item">
        <span className="zreport-label">Peak Sales Hour:</span>
        <span>{zReportData.peakHour} ({zReportData.peakHourCount} sales)</span>
      </div>
    </div>
  );
}

function MenuUpdateView() {
  const [menuList, setMenuList] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [menuDetails, setMenuDetails] = useState<any>(null);

  React.useEffect(() => {
    fetch(BackendURL + "manager/menu")
      .then(res => res.json())
      .then(data => setMenuList(data))
      .catch(e => console.error("Error fetching menu:", e));
  }, []);

  const loadMenuDetails = (id: number) => {
    fetch(`${BackendURL}manager/menu/${id}`)
      .then(res => res.json())
      .then(data => {
        setSelectedMenuId(id);
        setMenuDetails(data);
      })
      .catch(e => console.error("Error loading menu details:", e));
  };

  const updateField = (field: string, value: any) => {
    setMenuDetails((prev: any) => ({
      ...prev,
      menu: {
        ...prev.menu,
        [field]: value
      }
    }));
  };

  const updateInvAmount = (index: number, value: number) => {
    const newLinks = [...menuDetails.inventoryLinks];
    newLinks[index].invamount = parseFloat(value.toString());
    setMenuDetails((prev: any) => ({ ...prev, inventoryLinks: newLinks }));
  };

  const handleSubmit = () => {
    fetch(`${BackendURL}manager/menu/${selectedMenuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menuDetails)
    })
    .then(res => res.json())
    .then( () => {
      alert("Menu updated!");
      setSelectedMenuId(null);
      setMenuDetails(null);
    })
    .catch(e => alert("Failed to update menu: " + e.message));
  };

  if (selectedMenuId === null) {
    return (
      <div>
        <h2>Select a Menu to Update</h2>
        {menuList.map((item: any) => (
          <button key={item.id} onClick={() => loadMenuDetails(item.id)}>{item.item_name}</button>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>Editing Menu: {menuDetails.menu.item_name}</h2>

      <label>Item Name: 
        <input 
          type="text" 
          value={menuDetails.menu.item_name}
          onChange={(e) => updateField("item_name", e.target.value)}
        />
      </label>

      <label>Base Cost:
        <input 
          type="number" 
          value={menuDetails.menu.base_cost}
          onChange={(e) => updateField("base_cost", e.target.value)}
        />
      </label>

      <label>Item Group:
        <select 
          value={menuDetails.menu.item_group}
          onChange={(e) => updateField("item_group", e.target.value)}
        >
          <option value="milk tea">Milk Tea</option>
          <option value="brewed tea">Brewed Tea</option>
          <option value="fruit tea">Fruit Tea</option>
          <option value="fresh milk">Fresh Milk</option>
        </select>
      </label>

      <h3>Inventory Used</h3>
      <table>
        <thead>
          <tr>
            <th>Inventory Item</th>
            <th>Amount Used</th>
          </tr>
        </thead>
        <tbody>
          {menuDetails.inventoryLinks.map((inv: any, idx: number) => (
            <tr key={inv.inventory_id}>
              <td>{inv.name}</td>
              <td>
                <input 
                  type="number" 
                  value={inv.invamount}
                  onChange={(e) => updateInvAmount(idx, parseFloat(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleSubmit}>Save Changes</button>
    </div>
  );
}


function Manager() {
  //Tab display values
  const [displayEmployee, setDisplayEmployee] = useState(false);
  const [displayInventory, setDisplayInventory] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayHourlySales, setDisplayHourlySales] = useState(false);
  const [displayPurchaseOrders, setDisplayPurchaseOrders] = useState(false);
  const [displaySalesReport, setDisplaySalesReport] = useState(false);
  const [displayZReport, setDisplayZReport] = useState(false);
  const [displayMenuUpdate, setDisplayMenuUpdate] = useState(false);

  //Hide all views
  function hideAll(){
    setDisplayEmployee(() => false);
    setDisplayInventory(() => false);
    setDisplayMenu(() => false);
    setDisplayHourlySales(() => false);
    setDisplayPurchaseOrders(() => false);
    setDisplaySalesReport(() => false);
    setDisplayZReport(() => false);
    setDisplayMenuUpdate(() => false);
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

  function toggleSalesReport(){
    hideAll();
    setDisplaySalesReport((displaySalesReport) => !displaySalesReport);
  }

  function toggleZReport() {
    hideAll();
    setDisplayZReport((displayZReport) => !displayZReport);
  }

  function toggleMenuUpdate() {
    hideAll();
    setDisplayMenuUpdate((displayMenuUpdate) => !displayMenuUpdate);
  }

  return (
    <>
      <div>
      <button onClick = {toggleEmployees}>Employees</button>
      <button onClick = {toggleInventory}>Inventory</button>
      <button onClick = {toggleMenu}>Menu</button>
      <button onClick = {toggleSalesReport}>Sales Data</button>
      <button onClick = {toggleHourlySales}>Hourly Sales</button>
      <button onClick = {togglePurchaseOrders}>Purchase Order</button>
      <button onClick={toggleZReport}>Daily Z-Report</button>
      <button onClick={toggleMenuUpdate}>Update Menu</button>
      </div>
      {displayEmployee && <EmployeeView />}
      {displayInventory && <InventoryView />}
      {displayMenu && <MenuView />}
      {displayHourlySales && <HourlySalesView />}
      {displayPurchaseOrders && <PurchaseOrderView/>}
      {displaySalesReport && <UserSalesReportView/>}
      {displayZReport && <ZReportView />}
      {displayMenuUpdate && <MenuUpdateView />}
    </>
  )
}

export default Manager
