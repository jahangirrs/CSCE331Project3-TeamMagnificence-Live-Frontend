import { useState } from 'react'
import './Manager.css'
import React from 'react'

//URL variable, change depending on local testing or Live push
//let BackendURL = "https://csce331project3-teammagnificence-live.onrender.com/";
let BackendURL = "http://localhost:3000/";

//Fetch and Build employee Table
function EmployeeView(){

  interface Employee {
    id: number;
    name: string;
    clockedin: boolean;
    clockintime: string;
    clockouttime: string;
    manager: boolean;
    pto: number;
  }

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    manager: false,
    pto: 0
  });
  const [removed, setRemoved] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);


  React.useEffect(() => {
    fetch(BackendURL + "manager/employees")
      .then((res) => res.json())
      .then((data) => setEmployees(data)
      
    )
    .catch(e => console.log(e))
  }, [removed]);

  const handleInputChange = <K extends keyof Employee>(
    index: number,
    field: K,
    value: Employee[K]
  ) => {
    const updated = [...employees];
    updated[index] = { ...updated[index], [field]: value };
    setEmployees(updated);
  };


   //remove button logic
  const [id, setID] = useState(-1);
   function remove(){
     fetch(BackendURL + "manager/remove" + "?table=employees&id=" + id, {method: 'POST'})
     setRemoved(!removed);
     alert("Employee Removed!")
  }
  const handleSubmit = () => {
    fetch(BackendURL + "manager/employees", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employees)
    })
    .then(res => res.json())
    .then(() => {
      alert("Employees updated!");
      setEditMode(false);
    })
    .catch(e => alert("Update failed: " + e.message));
  };

  const submitNewEmployee = () => {
    fetch(BackendURL + "manager/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEmployee)
    })
      .then(res => res.json())
      .then(() => {
        alert("Employee added!");
        setAddingEmployee(false);
        setNewEmployee({ name: "", manager: false, pto: 0 });
        // reload
        return fetch(BackendURL + "manager/employees")
          .then((res) => res.json())
          .then((data) => setEmployees(data));
      });
  };


  return (
    <>
      <h1>Employees</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Update Employees"}
      </button>
      {editMode && <button onClick={handleSubmit}>Submit Changes</button>}
      <button onClick={() => setAddingEmployee(!addingEmployee)}>
        {addingEmployee ? "Cancel Add" : "➕ Add New Employee"}
      </button>
      <button onClick={() => {setRemoveMode(!removeMode)}}>{removeMode ? 'Cancel' : '➖ Remove Employee'}</button>
      {removeMode && <button onClick = {() => {if(id > -1){remove()}  setRemoveMode(false) } }>Remove</button>}

      <table>
        <thead>
          <tr>
            {removeMode && <th>Remove?</th>}
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
          {employees.map((emp: any, idx: number) => (
            <tr key={emp.id}>
              {removeMode && <td><input type = 'radio' name = "removeRadio" onChange={e => {e.target.checked ? setID(emp.id) : setID(-1)} }/></td>}
              <td>{emp.id}</td>
              <td>
                {editMode ? (
                  <input value={emp.name} onChange={e => handleInputChange(idx, "name", e.target.value)} />
                ) : emp.name}
              </td>
              <td>{emp.clockedin.toString()}</td>
              <td>{emp.clockintime}</td>
              <td>{emp.clockouttime}</td>
              <td>
                {editMode ? (
                  <input type="checkbox" checked={emp.manager} onChange={(e) => handleInputChange(idx, "manager", e.target.checked)}/>
                ) : emp.manager.toString()}
              </td>
              <td>
                {editMode ? (
                  <input type="number" value={emp.pto} onChange={(e) => handleInputChange(idx, "pto", parseFloat(e.target.value))}/>
                ) : emp.pto}
              </td>
            </tr>
          ))}
        </tbody>
        {addingEmployee && (
        <tr>
          <td>Auto</td>
          <td>
            <input value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} />
          </td>
          <td>false</td>
          <td>Auto</td>
          <td>Auto</td>
          <td>
            <input type="checkbox" checked={newEmployee.manager} onChange={e => setNewEmployee({...newEmployee, manager: e.target.checked})} />
          </td>
          <td>
            <input type="number" value={newEmployee.pto} onChange={e => setNewEmployee({...newEmployee, pto: parseInt(e.target.value)})} />
          </td>
          <td>
            <button onClick={submitNewEmployee}>Add</button>
          </td>
        </tr>
      )}

      </table>
    </>
  );
}


//Fetch and build inventory table
function InventoryView() {
  interface Inventory {
    id: number;
    name: string;
    unitsize: string;
    stocknum: number;
    stockpercent: number;
    idealstock: number;
    itemprice: number;
    supplier: string;
    islow: boolean;
  }

  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addingInventory, setAddingInventory] = useState(false);
  const [newInventory, setNewInventory] = useState({
    name: "",
    unitsize: "",
    idealstock: 0,
    itemprice: 0,
    supplier: "",
    islow: false
  });
  const [removed, setRemoved] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);

  //API call to backend for inventory data
  React.useEffect(() => {
    fetch(BackendURL + "manager/inventory")
    .then((res) => res.json())
    .then((data) => setInventory(data))
    .catch(e => console.log(e))
  }, [removed]);

  const handleInputChange = <K extends keyof Inventory>(
    index: number,
    field: K,
    value: Inventory[K]
  ) => {
    const updated = [...inventory];
    updated[index] = { ...updated[index], [field]: value };
    setInventory(updated);
  };

  const handleSubmit = () => {
    fetch(BackendURL + "manager/inventory", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inventory)
    })
      .then((res) => res.json())
      .then(() => {
        alert("Inventory updated!");
        setEditMode(false);
      })
      .catch((e) => alert("Update failed: " + e.message));
  };

  const submitNewInventory = () => {
    fetch(BackendURL + "manager/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInventory)
    })
      .then(res => res.json())
      .then(() => {
        alert("Inventory item added!");
        setAddingInventory(false);
        setNewInventory({ name: "", unitsize: "", idealstock: 0, itemprice: 0, supplier: "", islow: false });
        return fetch(BackendURL + "manager/inventory")
          .then(res => res.json())
          .then(data => setInventory(data));
      });
  };


  //remove button logic
  const [id, setID] = useState(-1);
  function remove(){
    fetch(BackendURL + "manager/remove" + "?table=inventory&id=" + id, {method: 'POST'})
    setRemoved(!removed);
    alert("Inventory Removed!")
  }

  return(
    <>
      <h1>Inventory</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Update Inventory"}
      </button>
      {editMode && <button onClick={handleSubmit}>Submit Changes</button>}
      <button onClick={() => setAddingInventory(!addingInventory)}>
        {addingInventory ? "Cancel Add" : "➕ Add New Inventory"}
      </button>
      <button onClick={() => {setRemoveMode(!removeMode)}}>{removeMode ? 'Cancel' : '➖ Remove Inventory'}</button>
      {removeMode && <button onClick = {() => {if(id > -1){remove()}  setRemoveMode(false) } }>Remove</button>}

      <table>

        <thead>
          <tr>
            {removeMode && <th>Remove?</th>}
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
          {inventory.map((item, idx) => (
            <tr key={item.id}>
              {removeMode && <td><input type = 'radio' name = "removeRadio" onChange={e => {e.target.checked ? setID(item.id) : setID(-1)} }/></td>}
              <td>{item.id}</td>
              <td>
                {editMode ? (
                  <input value={item.name} onChange={e => handleInputChange(idx, "name", e.target.value)} />
                ) : item.name}
              </td>
              <td>
                {editMode ? (
                  <input value={item.unitsize} onChange={e => handleInputChange(idx, "unitsize", e.target.value)} />
                ) : item.unitsize}
              </td>
              <td>{item.stocknum.toFixed(2)}</td>
              <td>{item.stockpercent.toFixed(2)}</td>
              <td>
                {editMode ? (
                  <input type="number" value={item.idealstock} onChange={e => handleInputChange(idx, "idealstock", parseFloat(e.target.value))} />
                ) : item.idealstock}
              </td>
              <td>
                {editMode ? (
                  <input type="number" value={item.itemprice} onChange={e => handleInputChange(idx, "itemprice", parseFloat(e.target.value))} />
                ) : item.itemprice}
              </td>
              <td>
                {editMode ? (
                  <input value={item.supplier} onChange={e => handleInputChange(idx, "supplier", e.target.value)} />
                ) : item.supplier}
              </td>
              <td>
                {editMode ? (
                  <input type="checkbox" checked={item.islow} onChange={e => handleInputChange(idx, "islow", e.target.checked)} />
                ) : item.islow.toString()}
              </td>
            </tr>
          ))}
          {addingInventory && (
            <tr>
              <td>Auto</td>
              <td><input value={newInventory.name} onChange={e => setNewInventory({...newInventory, name: e.target.value})} /></td>
              <td><input value={newInventory.unitsize} onChange={e => setNewInventory({...newInventory, unitsize: e.target.value})} /></td>
              <td>Auto</td>
              <td>Auto</td>
              <td><input type="number" value={newInventory.idealstock} onChange={e => setNewInventory({...newInventory, idealstock: parseFloat(e.target.value)})} /></td>
              <td><input type="number" value={newInventory.itemprice} onChange={e => setNewInventory({...newInventory, itemprice: parseFloat(e.target.value)})} /></td>
              <td><input value={newInventory.supplier} onChange={e => setNewInventory({...newInventory, supplier: e.target.value})} /></td>
              <td><input type="checkbox" checked={newInventory.islow} onChange={e => setNewInventory({...newInventory, islow: e.target.checked})} /></td>
              <td><button onClick={submitNewInventory}>Add</button></td>
            </tr>
          )}

        </tbody>
      </table>
    </>
  );
}


//Fetch and build Menu table
function MenuView() {
  interface MenuItem {
    id: number;
    item_name: string;
    base_cost: number;
    item_group: string;
  }

  interface InventoryLink {
    inventory_id: number;
    name: string;
    invamount: number;
  }

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [editingMenuId, setEditingMenuId] = useState<number | null>(null);
  const [ingredientLinks, setIngredientLinks] = useState<InventoryLink[]>([]);
  const [fullInventory, setFullInventory] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addingMenu, setAddingMenu] = useState(false);
  const [newMenu, setNewMenu] = useState({
    item_name: "",
    base_cost: 0,
    item_group: "milk tea"
  });
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [removed, setRemoved] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);

  //API call to backend for menu data
  React.useEffect(() => {
    fetch(BackendURL + "manager/menu")
    .then((res) => res.json())
    .then((data) => setMenu(data))
    .catch(e => console.log(e))
  }, [removed]);

  const handleInputChange = <K extends keyof MenuItem>(
    index: number,
    field: K,
    value: MenuItem[K]
  ) => {
    const updated = [...menu];
    updated[index] = { ...updated[index], [field]: value };
    setMenu(updated);
  };

  const handleSubmit = () => {
    fetch(BackendURL + "manager/menu", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(menu),
    })
      .then((res) => res.json() )
      .then(() => {
        alert("Menu updated!");
        setEditMode(false);
      })
      .catch((e) => alert("Update failed: " + e.message));
  };

  const submitNewMenu = () => {
    fetch(BackendURL + "manager/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMenu),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Menu item added!");
        setAddingMenu(false);
        setNewMenu({ item_name: "", base_cost: 0, item_group: "milk tea" });
        return fetch(BackendURL + "manager/menu")
          .then((res) => res.json())
          .then((data) => setMenu(data));
      });
  };

  const openIngredientEditor = (menuId: number) => {
    fetch(`${BackendURL}manager/menu/${menuId}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedMenu(data.menu);           // Save menu item
        setEditingMenuId(menuId);              // Save menu ID
        setIngredientLinks(data.inventoryLinks); // Save existing links
        return fetch(BackendURL + "manager/inventory"); // Fetch full inventory too
      })
      .then((res) => res.json())
      .then((inventoryData) => {
        setFullInventory(inventoryData);       // Save all inventory items
      })
      .catch(e => console.error("Error loading ingredient editor:", e));
  };


  const updateInvAmount = (index: number, value: number) => {
    const updated = [...ingredientLinks];
    updated[index].invamount = value;
    setIngredientLinks(updated);
  };

  const submitIngredientUpdate = () => {
    const menuItem = menu.find((m) => m.id === editingMenuId);
    fetch(`${BackendURL}manager/menu/${editingMenuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu: menuItem,
        inventoryLinks: ingredientLinks,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Ingredients updated!");
        setEditingMenuId(null);
        setIngredientLinks([]);
      })
      .catch((e) => alert("Update failed: " + e.message));
  };

  const addNewIngredient = () => {
    const select = document.getElementById("newIngredientSelect") as HTMLSelectElement;
    const amountInput = document.getElementById("newIngredientAmount") as HTMLInputElement;

    const inventoryId = parseInt(select.value);
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
      alert("Please select a valid ingredient and enter a positive amount.");
      return;
    }

    const selectedInventory = fullInventory.find(inv => inv.id === inventoryId);
    if (!selectedInventory) {
      alert("Selected inventory item not found!");
      return;
    }

    const newLink = {
      inventory_id: inventoryId,
      name: selectedInventory.name,
      invamount: amount
    };

    setIngredientLinks(prev => [...prev, newLink]);

    // Clear the selection
    select.selectedIndex = 0;
    amountInput.value = "";
  };


  //remove button logic
  const [id, setID] = useState(-1);
  function remove(){
    fetch(BackendURL + "manager/remove" + "?table=menu&id=" + id, {method: 'POST'})
    setRemoved(!removed);
    alert("Menu Item Removed!")
  }

  return(
    <>
      <h1>Menu</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Update Menu"}
      </button>
      {editMode && <button onClick={handleSubmit}>Submit Changes</button>}
      <button onClick={() => setAddingMenu(!addingMenu)}>
        {addingMenu ? "Cancel Add" : "➕ Add New Menu Item"}
      </button>
      <button onClick={() => {setRemoveMode(!removeMode)}}>{removeMode ? 'Cancel' : '➖ Remove Menu'}</button>
      {removeMode && <button onClick = {() => {if(id > -1){remove()}  setRemoveMode(false) } }>Remove</button>}
      <table>

        <thead>
          <tr>
            {removeMode && <th>Remove?</th>}
            <th>ID</th>
            <th>Item</th>
            <th>Cost</th>
            <th>Group</th>
            <th>Edit Ingredients</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item, idx) => (
            <tr key={item.id}>
              {removeMode && <td><input type = 'radio' name = "removeRadio" onChange={e => {e.target.checked ? setID(item.id) : setID(-1)} }/></td>}
              <td>{item.id}</td>
              <td>
                {editMode ? (
                  <input
                    value={item.item_name}
                    onChange={(e) => handleInputChange(idx, "item_name", e.target.value)}
                  />
                ) : item.item_name}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="number"
                    value={item.base_cost}
                    onChange={(e) => handleInputChange(idx, "base_cost", parseFloat(e.target.value))}
                  />
                ) : item.base_cost.toFixed(2)}
              </td>
              <td>
                {editMode ? (
                  <select
                    value={item.item_group}
                    onChange={(e) => handleInputChange(idx, "item_group", e.target.value)}
                  >
                    <option value="milk tea">Milk Tea</option>
                    <option value="brewed tea">Brewed Tea</option>
                    <option value="fruit tea">Fruit Tea</option>
                    <option value="fresh milk">Fresh Milk</option>
                  </select>
                ) : item.item_group}
              </td>
              <td>
                <button onClick={() => openIngredientEditor(item.id)}>Edit Ingredients</button>
              </td>
            </tr>
          ))}
          {addingMenu && (
            <tr>
              <td>Auto</td>
              <td>
                <input value={newMenu.item_name} onChange={e => setNewMenu({...newMenu, item_name: e.target.value})} />
              </td>
              <td>
                <input type="number" value={newMenu.base_cost} onChange={e => setNewMenu({...newMenu, base_cost: parseFloat(e.target.value)})} />
              </td>
              <td>
                <select value={newMenu.item_group} onChange={e => setNewMenu({...newMenu, item_group: e.target.value})}>
                  <option value="milk tea">Milk Tea</option>
                  <option value="brewed tea">Brewed Tea</option>
                  <option value="fruit tea">Fruit Tea</option>
                  <option value="fresh milk">Fresh Milk</option>
                </select>
              </td>
              <td>
                <button onClick={submitNewMenu}>Add</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Ingredients Modal */}
      {editingMenuId !== null && (
        <div className="modal">
          <h3>Edit Ingredients for Menu ID: {editingMenuId}</h3>
          <table>
            <thead>
              <tr>
                <th>Inventory Name</th>
                <th>Amount Used</th>
              </tr>
            </thead>
            <tbody>
              {ingredientLinks.map((inv, idx) => (
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
          <h4>Add New Ingredient</h4>
            <select id="newIngredientSelect">
              {fullInventory
                .filter(inv => !ingredientLinks.some(link => link.inventory_id === inv.id))
                .map(inv => (
                  <option key={inv.id} value={inv.id}>
                    {inv.name}
                  </option>
              ))}
            </select>
            <input id="newIngredientAmount" type="number" placeholder="Amount" />
            <button onClick={addNewIngredient}>Add Ingredient</button>

          <button onClick={submitIngredientUpdate}>Save Ingredients</button>
          <button onClick={() => setEditingMenuId(null)}>Close</button>
        </div>
      )}
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
function PurchaseOrderView() {
  interface PurchaseOrder {
    id: number;
    inventory_name: string;
    unitsize: string;
    supplier_name: string;
    order_date: string;
    quantity: number;
    cost_per_unit: number;
    total_cost: number;
    order_status: string;
    expected_arrival: string;
    received_date: string;
  }

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [addingOrder, setAddingOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    inventory_name: "",
    unitsize: "",
    supplier_name: "",
    order_date: new Date().toISOString().split("T")[0],
    quantity: 0,
    cost_per_unit: 0,
    order_status: "",
    expected_arrival: "",
    received_date: ""
  });
  const [removed, setRemoved] = useState(false);
  const [removeMode, setRemoveMode] = useState(false);

  //API call to backend for purchase order data
  React.useEffect(() => {
    fetch(BackendURL + "manager/purchaseOrder")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((e) => console.log(e));
  }, [removed]);

  const handleInputChange = <K extends keyof PurchaseOrder>(
    index: number,
    field: K,
    value: PurchaseOrder[K]
  ) => {
    const updated = [...orders];
    updated[index] = { ...updated[index], [field]: value };

    // update total_cost when quantity or cost_per_unit changes
    if (field === "quantity" || field === "cost_per_unit") {
      updated[index].total_cost =
        updated[index].quantity * updated[index].cost_per_unit;
    }

    setOrders(updated);
  };
  //remove button logic
  const [id, setID] = useState(-1);
  function remove(){
    fetch(BackendURL + "manager/remove" + "?table=purchaseorders&id=" + id, {method: 'POST'})
    setRemoved(!removed);
    alert("Purchase Order Removed!")
  }

  const handleSubmit = () => {
    fetch(BackendURL + "manager/purchaseOrder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orders),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Purchase Orders updated!");
        setEditMode(false);
      })
      .catch((e) => alert("Update failed: " + e.message));
  };

  const submitNewOrder = () => {
    const total_cost = newOrder.quantity * newOrder.cost_per_unit;
    fetch(BackendURL + "manager/purchaseOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newOrder, total_cost })
    })
      .then(res => res.json())
      .then(() => {
        alert("Order added!");
        setAddingOrder(false);
        setNewOrder({ inventory_name: "", unitsize: "", supplier_name: "", order_date: new Date().toISOString().split("T")[0], quantity: 0, cost_per_unit: 0, order_status: "", expected_arrival: "", received_date: "" });
        return fetch(BackendURL + "manager/purchaseOrder")
          .then(res => res.json())
          .then(data => setOrders(data));
      });
  };


  return (
    <>

      <h1>Purchase Orders</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? "Cancel" : "Update Purchase Orders"}
      </button>
      {editMode && <button onClick={handleSubmit}>Submit Changes</button>}
      <button onClick={() => setAddingOrder(!addingOrder)}>
        {addingOrder ? "Cancel Add" : "➕ Add New Order"}
      </button>

      <button onClick={() => {setRemoveMode(!removeMode)}}>{removeMode ? 'Cancel' : '➖ Remove Order'}</button>
      {removeMode && <button onClick = {() => {if(id > -1){remove()}  setRemoveMode(false) } }>Remove</button>}

      <table>
        <thead>
          <tr>
            {removeMode && <th>Remove?</th>}
            <th>ID</th>
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
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={order.id}>
              {removeMode && <td><input type = 'radio' name = "removeRadio" onChange={e => {e.target.checked ? setID(order.id) : setID(-1)} }/></td>}
              <td>{order.id}</td>
              <td>{order.inventory_name}</td>
              <td>{order.unitsize}</td>
              <td>{order.supplier_name}</td>
              <td>{order.order_date}</td>
              <td>
                {editMode ? (
                  <input
                    type="number"
                    value={order.quantity}
                    onChange={(e) =>
                      handleInputChange(idx, "quantity", parseInt(e.target.value))
                    }
                  />
                ) : order.quantity}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="number"
                    value={order.cost_per_unit}
                    onChange={(e) =>
                      handleInputChange(idx, "cost_per_unit", parseFloat(e.target.value))
                    }
                  />
                ) : order.cost_per_unit.toFixed(2)}
              </td>
              <td>{order.total_cost.toFixed(2)}</td>
              <td>
                {editMode ? (
                  <input
                    value={order.order_status}
                    onChange={(e) =>
                      handleInputChange(idx, "order_status", e.target.value)
                    }
                  />
                ) : order.order_status}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="date"
                    value={order.expected_arrival?.split("T")[0] ?? ""}
                    onChange={(e) =>
                      handleInputChange(idx, "expected_arrival", e.target.value)
                    }
                  />
                ) : order.expected_arrival?.split("T")[0]}
              </td>
              <td>
                {editMode ? (
                  <input
                    type="date"
                    value={order.received_date?.split("T")[0] ?? ""}
                    onChange={(e) =>
                      handleInputChange(idx, "received_date", e.target.value)
                    }
                  />
                ) : order.received_date?.split("T")[0]}
              </td>
            </tr>
          ))}
          {addingOrder && (
            <tr>
              <td><input value={newOrder.inventory_name} onChange={e => setNewOrder({...newOrder, inventory_name: e.target.value})} /></td>
              <td><input value={newOrder.unitsize} onChange={e => setNewOrder({...newOrder, unitsize: e.target.value})} /></td>
              <td><input value={newOrder.supplier_name} onChange={e => setNewOrder({...newOrder, supplier_name: e.target.value})} /></td>
              <td><input type="date" value={newOrder.order_date} onChange={e => setNewOrder({...newOrder, order_date: e.target.value})} /></td>
              <td><input type="number" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: parseInt(e.target.value)})} /></td>
              <td><input type="number" value={newOrder.cost_per_unit} onChange={e => setNewOrder({...newOrder, cost_per_unit: parseFloat(e.target.value)})} /></td>
              <td>Auto</td>
             <td><input value={newOrder.order_status} onChange={e => setNewOrder({...newOrder, order_status: e.target.value})} /></td>
              <td><input type="date" value={newOrder.expected_arrival} onChange={e => setNewOrder({...newOrder, expected_arrival: e.target.value})} /></td>
              <td><input type="date" value={newOrder.received_date} onChange={e => setNewOrder({...newOrder, received_date: e.target.value})} /></td>
              <td><button onClick={submitNewOrder}>Add</button></td>
  </tr>
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


function Manager() {
  //Tab display values
  const [displayEmployee, setDisplayEmployee] = useState(false);
  const [displayInventory, setDisplayInventory] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [displayHourlySales, setDisplayHourlySales] = useState(false);
  const [displayPurchaseOrders, setDisplayPurchaseOrders] = useState(false);
  const [displaySalesReport, setDisplaySalesReport] = useState(false);
  const [displayZReport, setDisplayZReport] = useState(false);

  //Hide all views
  function hideAll(){
    setDisplayEmployee(() => false);
    setDisplayInventory(() => false);
    setDisplayMenu(() => false);
    setDisplayHourlySales(() => false);
    setDisplayPurchaseOrders(() => false);
    setDisplaySalesReport(() => false);
    setDisplayZReport(() => false);
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
      </div>
      {displayEmployee && <EmployeeView />}
      {displayInventory && <InventoryView />}
      {displayMenu && <MenuView />}
      {displayHourlySales && <HourlySalesView />}
      {displayPurchaseOrders && <PurchaseOrderView/>}
      {displaySalesReport && <UserSalesReportView/>}
      {displayZReport && <ZReportView />}
    </>
  )
}

export default Manager
