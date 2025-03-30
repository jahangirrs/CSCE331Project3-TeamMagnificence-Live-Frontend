import { useState } from 'react'
import './App.css'
import React from 'react'

function GetEmployeeTable(){
  const [employees, setEmployees] = useState("");

  //API call to backend for employee data
  React.useEffect(() => {
    fetch("/manager")
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

function App() {

  return (
    <>

      <GetEmployeeTable />
    </>
  )
}

export default App
